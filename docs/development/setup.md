# Development Setup

This guide walks you through setting up the AskAU Frontend on your local machine.

## Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: v20 or higher (We recommend using `nvm` or `fnm`).
- **Package Manager**: `pnpm` v9 or higher.
- **Git**: For version control.

## 1. Clone the Repository

```bash
git clone <repository-url>
cd askau-frontend
```

## 2. Install Dependencies

We use `pnpm` exclusively. Do not use `npm` or `yarn`.

```bash
pnpm install
```

## 3. Environment Variables

The project requires several environment variables to run locally.

1. Duplicate the `.env.example` file and rename it to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Open `.env.local` and fill in the missing values.
   - `NEXT_PUBLIC_API_BASE_URL`: The URL of your local or staging backend API.
   - `NEXTAUTH_SECRET`: A strong random string for encrypting sessions.
   - Entra ID Variables: `ENTRA_CLIENT_ID`, `ENTRA_CLIENT_SECRET`, and `ENTRA_TENANT_ID`. Request these from your team lead.

**Note:** Never commit `.env.local` to version control.

## 4. Run the Development Server

Start the Next.js development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 5. Other Useful Commands

- `pnpm build`: Build the application for production.
- `pnpm start`: Run the compiled production build locally.
- `pnpm lint`: Run ESLint and Prettier to check for code style issues.
- `pnpm typecheck`: Run TypeScript compiler to check for type errors.
- `pnpm test`: Run Vitest unit tests.