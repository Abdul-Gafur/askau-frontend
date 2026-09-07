/**
 * NextAuth.js v5 Configuration — Microsoft Entra ID (Azure AD)
 *
 * SECURITY NOTES:
 * ────────────────────────────────────────────────────────────────────
 * - NEXTAUTH_SECRET must be a strong, randomly generated secret.
 *   It is used to sign and encrypt JWTs. Never expose it client-side.
 * - ENTRA_CLIENT_SECRET is server-only. Never use NEXT_PUBLIC_ for it.
 * - ENTRA_TENANT_ID and ENTRA_CLIENT_ID are server-only.
 * - Only the session object (stripped user info) reaches the browser.
 * - The backend must independently verify the authentication state.
 *   Frontend session state is NOT an authorization mechanism.
 * ────────────────────────────────────────────────────────────────────
 *
 * SETUP INSTRUCTIONS:
 * 1. Register an App in Microsoft Entra ID (Azure AD).
 * 2. Set Redirect URI to: {NEXTAUTH_URL}/api/auth/callback/microsoft-entra-id
 * 3. Grant the AskAU API's `access_as_user` scope (Delegated), under
 *    "My APIs", and grant admin consent. Set ENTRA_API_SCOPE to
 *    api://<AskAU API client id>/access_as_user. A Microsoft Graph scope is
 *    NOT sufficient: the backend validates `aud` against its own audience.
 * 4. Copy Application (client) ID → ENTRA_CLIENT_ID
 * 5. Copy Directory (tenant) ID  → ENTRA_TENANT_ID
 * 6. Create a client secret       → ENTRA_CLIENT_SECRET
 * 7. Generate NEXTAUTH_SECRET:    openssl rand -base64 32
 * 8. Set all values in .env.local (never commit)
 *
 * See docs/authentication/entra-id.md for full setup instructions.
 */

import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import type { Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import { devDisplayName } from "./dev-identities";

/**
 * Extends NextAuth session types to include AskAU-specific fields.
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      /**
       * The backend identity key, NOT a label.
       *
       * Under Entra this is the person's directory name, but in mock mode it
       * is the seeded username, because app/api/[...path] uses it to look up
       * that person's bearer token. Render `displayName` instead.
       */
      name: string;
      /** What to show a reader. Falls back to `name` when unset. */
      displayName?: string;
      image?: string;
      /** Microsoft Entra Object ID */
      entraId?: string;
    };
  }

  interface User {
    displayName?: string;
    entraId?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    displayName?: string;
    entraId?: string;
    accessToken?: string;
    accessTokenExpires?: number;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    MicrosoftEntraID({
      clientId: process.env["ENTRA_CLIENT_ID"] ?? "",
      clientSecret: process.env["ENTRA_CLIENT_SECRET"] ?? "",
      issuer: `https://login.microsoftonline.com/${process.env["ENTRA_TENANT_ID"] ?? "common"}/v2.0`,
      authorization: {
        params: {
          // `User.Read` is a *Microsoft Graph* scope. A token issued for Graph
          // is rejected by the AskAU backend, which requires `aud` to equal
          // ASKAU_ENTRA_AUDIENCE — so requesting only Graph scopes produced a
          // successful sign-in followed by a 401 on every single API call.
          //
          // ENTRA_API_SCOPE is the API registration's exposed scope,
          // `api://<AskAU API client id>/access_as_user`. Kept in the
          // environment rather than hardcoded: it carries a tenant-specific
          // GUID, and a wrong value here fails as an authorization error at
          // runtime rather than anything a build would catch.
          scope: `openid profile email offline_access ${
            process.env["ENTRA_API_SCOPE"] ?? ""
          }`.trim(),
        },
      },
    }),
    ...(process.env.NEXT_PUBLIC_USE_MOCK_API === "true"
      ? [
          CredentialsProvider({
            name: "Mock Auth (Dev Only)",
            credentials: {
              username: { label: "Username (any)", type: "text", placeholder: "admin" },
              password: { label: "Password (any)", type: "password" },
            },
            async authorize(credentials) {
              // The submitted username becomes the identity, so the dev proxy
              // can look up that person's backend token. A fixed user made
              // permission-aware retrieval impossible to see from the
              // interface — every reader had the same access list.
              const username = String(credentials?.username ?? "staff.finance").trim();
              return {
                id: `mock-${username}`,
                // `name` stays the username on purpose — the proxy keys the
                // backend token off it. The person's actual name rides along
                // in `displayName`, which is what the UI renders.
                name: username,
                displayName: devDisplayName(username),
                email: `${username}@africanunion.org`,
                entraId: `oid-${username}`,
              };
            },
          }),
        ]
      : []),
  ],

  session: {
    strategy: "jwt",
    // Session expires in 8 hours (standard working day)
    maxAge: 8 * 60 * 60,
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  callbacks: {
    /**
     * JWT callback — runs on sign-in and on token refresh.
     * Adds Entra ID object ID to the token.
     *
     * SECURITY: Never add sensitive data (tokens, secrets) to the JWT
     * that will be exposed client-side via useSession().
     */
    async jwt({ token, user, account, profile }) {
      if (user?.displayName) {
        token.displayName = user.displayName;
      }
      if (account && profile) {
        // Store Entra Object ID for backend correlation
        token.entraId = (profile as { oid?: string }).oid;
      }
      if (account?.access_token) {
        // The API-scoped access token, kept HERE and nowhere else.
        //
        // This JWT is encrypted with NEXTAUTH_SECRET and only ever decrypted on
        // the server. The `session` callback below deliberately does not copy
        // this across: whatever the session callback returns is served to the
        // browser by /api/auth/session, so a token placed there is a token in
        // everyone's devtools. The proxy reads it from this token directly via
        // `getToken`, which is the server-side path.
        token.accessToken = account.access_token;
        token.accessTokenExpires =
          typeof account.expires_at === "number" ? account.expires_at * 1000 : undefined;
      }
      return token;
    },

    /**
     * Session callback — shapes what the client receives from useSession().
     * Only expose what is needed by the frontend UI.
     */
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.displayName = token.displayName ?? session.user.name;
        session.user.entraId = token.entraId;
        // Do NOT add accessToken to session — keep it server-side only
      }
      return session;
    },
  },

  // Enable debug logging in development only
  debug: process.env["NODE_ENV"] === "development",

  // Trust the X-Forwarded-Host header in production (behind reverse proxy)
  trustHost: true,
});
