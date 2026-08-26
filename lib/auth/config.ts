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
 * 3. Grant the following Microsoft Graph API permissions (Delegated):
 *    - User.Read (to read user profile)
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

/**
 * Extends NextAuth session types to include AskAU-specific fields.
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
      /** Microsoft Entra Object ID */
      entraId?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
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
          scope: "openid profile email User.Read",
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
            async authorize() {
              return {
                id: "mock-user-1",
                name: "Mock Admin User",
                email: "mockadmin@askau.org",
                entraId: "mock-entra-oid",
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
    async jwt({ token, account, profile }) {
      if (account && profile) {
        // Store Entra Object ID for backend correlation
        token.entraId = (profile as { oid?: string }).oid;

        // NOTE: Do NOT store access tokens in the client-accessible session.
        // If the backend needs the Entra token, proxy it server-side only.
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
