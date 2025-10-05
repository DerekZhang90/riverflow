# Repository Guidelines

## Project Structure & Module Organization
The Next.js App Router lives in `src/app`, with locale-aware routes under `src/app/[locale]/(free)` and API endpoints in `src/app/api`. Shared backend logic is organized in `src/backend` (config, service, models, SQL, and utilities). UI parts sit in `src/components`, while `src/config`, `src/lib`, `src/contexts`, and `src/providers` hold configuration, helpers, state, and wrappers. Static assets reside in `public`, and localization strings in `messages`. Tailwind and design tokens are defined via `tailwind.config.ts` and `components.json`.

## Build, Test, and Development Commands
Use `npm run dev` to launch the app at `http://localhost:3000`. `npm run build` (or `npm run build:prod` when you need `NODE_ENV=production`) compiles production assets. `npm run start` serves the built output. `npm run lint` runs the Next.js ESLint suite; address warnings rather than disabling rules. `npm run postbuild` triggers sitemap generation and should be run after a successful build if you deploy outside Vercel.

## Coding Style & Naming Conventions
Write TypeScript with explicit return types for exported functions and API handlers. Keep two-space indentation, double-quoted strings, grouped imports (`react` first, `@/` aliases next), and Tailwind classes sorted by layout → color → motion where practical. React components, pages, and providers use PascalCase, hooks use `useCamelCase`, and utilities stay camelCase. Reuse existing helper modules instead of duplicating logic.

## Testing Guidelines
The project does not yet ship a formal test runner. Validate changes via `npm run lint`, local smoke tests in `npm run dev`, and sample data seeded with `psql -U <user> -d <db> -f src/backend/sql/init.sql`. When authoring automated coverage, place `.test.ts` or `.spec.ts` files adjacent to the target module, mock external services, and document how to run the suite in your PR until a shared script is added.

## Commit & Pull Request Guidelines
Commits follow Conventional Commit prefixes (`feat:`, `fix:`, `chore:`) with optional scopes (`feat(auth): ...`). PRs must summarize behavior, link issues, list environment or migration changes, and attach screenshots or request logs for UI/API updates. Keep branches rebased on `main`, squash fixups locally, and ensure lint passes before requesting review.

## Environment & Secrets
Copy `.env.example` to `.env.local` and customize secrets for Stripe, Google OAuth, Replicate, AWS S3, or Cloudflare R2. Never commit credentials; instead, describe new variables in the PR body and update `README.md` if defaults change. For reviewer testing, prefer provider sandbox keys and minimal privilege service accounts.
