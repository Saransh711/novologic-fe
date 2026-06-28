# Workbook Web

Frontend for the **Online Workbook** product — a focused, autosaving rich-text
workbook. Built with Next.js (App Router), TypeScript, Tailwind CSS v4, Apollo
Client, and Framer Motion.

## Getting started

```bash
npm install
cp .env.example .env.local   # point at your running workbook API
npm run dev                  # http://localhost:3000
```

The API is expected at `NEXT_PUBLIC_GRAPHQL_URL` (defaults to
`http://localhost:3000/graphql`).

## Scripts

| Script                 | Purpose                                  |
| ---------------------- | ---------------------------------------- |
| `npm run dev`          | Start the dev server                     |
| `npm run build`        | Production build                         |
| `npm run start`        | Serve the production build               |
| `npm run lint`         | ESLint (Next + TypeScript rules)         |
| `npm run typecheck`    | TypeScript type checking                 |
| `npm run format`       | Format with Prettier                     |
| `npm run format:check` | Verify formatting                        |

## Architecture

Feature-based structure under `src/`:

```
src/
  app/            App Router routes, root layout, global stylesheet
  components/ui/  Reusable presentational primitives (Button, Card, …)
  config/         App constants: copy, routes, autosave, upload limits, env
  design/         Design tokens + CSS-variable generator + motion presets
  features/       Domain UI + logic (e.g. landing)
  lib/            Clients & utilities (Apollo, theme, cn)
```

## Design system — one source of truth

Every visual value originates in **`src/design/tokens.ts`** (colour, typography,
spacing, radii, shadows, z-index, breakpoints, motion).

- `src/design/css-variables.ts` turns those tokens into CSS custom properties
  (`:root` light theme + a dark variant under `[data-theme='dark']`, falling
  back to `prefers-color-scheme`). It also exposes `var(--…)` reference maps.
- `tailwind.config.ts` builds its **entire** theme from those reference maps, so
  utilities like `bg-primary`, `p-4`, and `rounded-lg` resolve to runtime
  variables — there are no raw hex/px values in components or config.
- `src/design/ThemeStyle.tsx` injects the generated variables once in the layout
  `<head>`.

Changing the look means editing tokens only. User-facing copy and constants live
in `src/config` and are never inlined in components.

## Data

Server state flows through Apollo Client. Use the RSC client from
`src/lib/apollo/client.ts` (`getClient`/`query`/`PreloadQuery`) in server
components and the hooks via the `ApolloWrapper` provider in client components.
