# Microsoft Entra ID Integration

AskAU uses **Microsoft Entra ID (formerly Azure AD)** for enterprise authentication, specifically for employees of the African Union Commission.

## NextAuth.js (Auth.js)

Authentication is implemented using `NextAuth.js` (v5). It handles the OAuth 2.0 / OpenID Connect (OIDC) flow securely.

## Configuration

The configuration lives in `lib/auth/config.ts`. It utilizes the `MicrosoftEntraId` provider.

### Required Environment Variables

To run authentication locally, you need the following variables in `.env.local`:

- `NEXTAUTH_SECRET`: A random 32-character string used to encrypt cookies.
- `NEXTAUTH_URL`: The full URL of the application.
- `ENTRA_CLIENT_ID`: The Application (Client) ID from the Azure App Registration.
- `ENTRA_CLIENT_SECRET`: The Client Secret.
- `ENTRA_TENANT_ID`: The AU Commission Tenant ID.

## The Auth Flow

1. The user clicks "Sign In".
2. NextAuth redirects them to the Microsoft login portal.
3. Upon successful login, Microsoft redirects back to the Next.js API route (`/api/auth/callback/microsoft-entra-id`).
4. NextAuth exchanges the authorization code for an Access Token and an ID Token.
5. The tokens and user profile are saved in an encrypted, HttpOnly session cookie.
6. The Next.js server proxies requests to the backend or the API client uses `credentials: "same-origin"` to authenticate backend requests.

## Security Considerations

- Access Tokens have short lifespans.
- Refresh tokens (if configured) are handled server-side to prevent leakage to the client.
- We do not store sensitive Microsoft credentials on the client.
