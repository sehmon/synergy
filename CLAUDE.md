# Synergy Project Guidelines

## Development Commands
- Start all services: `npm run dev`
- Client only: `npm run dev:client`
- Server only: `npm run dev:server`
- Build project: `npm run build`
- Client linting: `npm run lint --workspace=@synergy/client`
- Prisma commands: `npm run prisma:generate`, `npm run prisma:migrate`

## Code Style Guidelines
- **TypeScript**: Use strict typing where possible, avoid `any` and `@ts-nocheck`
- **React**: Follow React hooks best practices, use functional components
- **Imports**: Group by external/internal, sort alphabetically
- **Formatting**: 2-space indentation, semicolons required, trailing commas
- **Naming**: camelCase for variables/functions, PascalCase for components
- **Error Handling**: Use try/catch blocks and proper error logging
- **Components**: One component per file, use React Three Fiber best practices

## Project Structure
- Monorepo with client (React/Three.js) and server (Express/Prisma) packages
- Follow existing file structure and component patterns