# Deployment

AskAU Frontend is a Next.js application that requires a Node.js runtime to host the server components and API routes.

## Deployment Strategy

The application can be deployed to any platform that supports Node.js (e.g., Vercel, AWS ECS, Google Cloud Run, Azure App Service, VPS).

### Environment Variables

At deployment time, the following environment variables must be configured in the production environment:

- `NODE_ENV=production`
- `NEXT_PUBLIC_API_BASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `ENTRA_CLIENT_ID`
- `ENTRA_CLIENT_SECRET`
- `ENTRA_TENANT_ID`

## Build Process

During CI/CD, the following commands should be executed:

1. **Install dependencies:** `pnpm install --frozen-lockfile`
2. **Lint and Typecheck:** `pnpm lint && pnpm typecheck`
3. **Run Tests:** `pnpm test`
4. **Build:** `pnpm build`

The `pnpm build` command produces an optimized production build inside the `.next` folder.

## Docker Deployment (Optional)

If deploying via containerization, use a multi-stage Dockerfile to minimize the final image size. Next.js supports a "standalone" output mode (`output: "standalone"` in `next.config.ts`) which drastically reduces the container size by only copying the required dependencies.
