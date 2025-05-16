# Synergy

Synergy is a monorepo that houses the client, server and shared packages for the project. The client is a React/Three.js app while the server uses Express with Prisma for database access. All packages can be developed together or individually using the provided npm scripts.

## Development Commands

- **Start all services:** `npm run dev`
- **Client only:** `npm run dev:client`
- **Server only:** `npm run dev:server`
- **Build project:** `npm run build`
- **Client linting:** `npm run lint --workspace=@synergy/client`
- **Generate Prisma client:** `npm run prisma:generate`
- **Apply Prisma migrations:** `npm run prisma:migrate`
