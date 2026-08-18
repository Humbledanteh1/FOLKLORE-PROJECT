# Folklore

Folklore is a field guide for dependable e-commerce agents. The public application presents an editorial agent library, focused workspaces, and review-first operating patterns for support, inventory, fulfillment, marketing, and customer feedback workflows.

## Local setup

Install the locked dependencies and build the client and server:

```bash
pnpm install --frozen-lockfile
pnpm exec tsc --noEmit
pnpm run build
```

Start the production build with:

```bash
NODE_ENV=production PORT=3000 node dist/index.js
```

The browser interface is available at `http://localhost:3000/`. The production server is defined in `server/_core/index.ts` and provides the application’s OAuth, storage, tRPC, and static-site routes.

## Application structure

| Path | Purpose |
| --- | --- |
| `client/src/pages/Home.tsx` | Folklore landing page |
| `client/src/pages/Agents.tsx` | Agent library and interactive workspaces |
| `server/_core/index.ts` | Production Express entrypoint |
| `server/routers.ts` | tRPC application router |
| `server/db.ts` | Drizzle database access for the existing scaffold |
| `drizzle/schema.ts` | Application database schema |

## Verification

Run the project checks with:

```bash
pnpm exec vitest run --config vitest.config.ts
pnpm exec tsc --noEmit
pnpm run build
```

The privacy gateway has been moved to the separate public repository [Humbledanteh1/atlas-1](https://github.com/Humbledanteh1/atlas-1). This repository intentionally retains only the Folklore application and its unrelated agent-library work.
