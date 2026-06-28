# Workbook Web

Frontend for the **Online Workbook** product — a focused, autosaving rich-text
workbook. Built with Next.js 16 (App Router), React 19, TypeScript (strict),
Tailwind CSS v4, Apollo Client v4, Tiptap, and Motion.

---

## Installation

Requirements:

- **Node.js 20+** (matches `@types/node`; Next.js 16 needs a current LTS).
- **npm** (the repo ships a `package-lock.json`).

```bash
git clone <repo-url>
cd workbook-web
npm install
```

Dependencies are installed at their latest stable versions via the package
manager — versions are never hand-pinned in `package.json`.

---

## Environment variables

Copy the example file and adjust it for your environment. Next.js loads
`.env.local` automatically and never commits it:

```bash
cp .env.example .env.local
```

Only `NEXT_PUBLIC_*` variables are exposed to the browser. There are two:

| Variable                   | Required | Default                        | Purpose                                                                                       |
| -------------------------- | -------- | ------------------------------ | --------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_GRAPHQL_URL`  | No\*     | `http://localhost:3000/graphql`| Absolute URL of the backend GraphQL endpoint. **Must be absolute** so SSR can reach it.       |
| `NEXT_PUBLIC_API_BASE_URL` | No\*     | `http://localhost:3000`        | Origin of the API. Used to build `/uploads/<storageKey>` URLs and to `POST /files/upload`.    |

\* Not strictly required for local dev because sensible localhost defaults are
baked in (see `src/config/env.ts`), but you should set them explicitly for any
non-local backend.

All environment access is funnelled through a single typed module —
`src/config/env.ts` — rather than reading `process.env` throughout the app:

```12:15:src/config/env.ts
  /** Absolute URL of the GraphQL endpoint (required to be absolute for SSR). */
  graphqlUrl: withDefault(process.env.NEXT_PUBLIC_GRAPHQL_URL, 'http://localhost:3000/graphql'),
  /** Base URL of the API origin, used to resolve served upload URLs. */
  apiBaseUrl: withDefault(process.env.NEXT_PUBLIC_API_BASE_URL, 'http://localhost:3000'),
```

### Pointing at the backend GraphQL URL

The GraphQL endpoint is configured **only** through `NEXT_PUBLIC_GRAPHQL_URL`.
Set it in `.env.local`:

```bash
# .env.local
NEXT_PUBLIC_GRAPHQL_URL=https://api.example.com/graphql
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
```

That value flows into the Apollo `HttpLink` used by both the server (RSC) and
browser clients:

```14:19:src/lib/apollo/client.ts
export const { getClient, query, PreloadQuery } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({ uri: env.graphqlUrl }),
  });
});
```

Notes:

- The URL **must be absolute** (`https://host/graphql`, not `/graphql`) because
  server-side rendering performs the fetch from Node, where relative paths have
  no origin.
- `NEXT_PUBLIC_*` values are inlined at **build time**. After changing them,
  restart `npm run dev` (or rebuild) for the change to take effect.
- The backend contract is frozen in `schema.graphql`. Operation documents live
  in `src/lib/graphql/operations/**`. Run `npm run codegen` to regenerate typed
  documents and hooks after editing the schema or any operation.

---

## Running the dev server

```bash
npm run dev        # http://localhost:3000
```

If your backend also runs on `:3000`, run the frontend on another port to avoid
a clash:

```bash
PORT=4000 npm run dev   # http://localhost:4000
```

### Scripts

| Script                 | Purpose                                        |
| ---------------------- | ---------------------------------------------- |
| `npm run dev`          | Start the dev server                           |
| `npm run build`        | Production build                               |
| `npm run start`        | Serve the production build                     |
| `npm run lint`         | ESLint (Next + TypeScript rules)               |
| `npm run lint:fix`     | ESLint with autofix                            |
| `npm run typecheck`    | TypeScript type checking (`tsc --noEmit`)      |
| `npm run codegen`      | Generate typed GraphQL documents from schema   |
| `npm run codegen:watch`| Regenerate on schema/operation changes         |
| `npm run format`       | Format with Prettier                           |
| `npm run format:check` | Verify formatting                              |

---

## Architecture

Feature-based structure under `src/`:

```
src/
  app/            App Router routes, root layout, global stylesheet
  components/ui/  Reusable presentational primitives (Button, Card, Dialog, …)
  config/         App constants: copy, routes, env, autosave, upload limits, breakpoints
  design/         Design tokens + CSS-variable generator + theme injector
  features/       Domain UI + logic (e.g. workbook editor, version history)
  lib/            Clients & utilities (Apollo, GraphQL hooks, theme, upload, hooks, cn)
```

Conventions (enforced by project rules):

- Server Components by default; `"use client"` only where interactivity/hooks
  are required.
- No business or data logic in JSX — it lives in custom hooks or `lib`.
- All data access goes through generated, typed GraphQL hooks
  (`@/lib/graphql`). Components never hand-write query strings.
- No magic values in components — visual values come from `src/design`, copy and
  constants from `src/config`.

---

## Design system — one source of truth

Every visual value originates in **`src/design/tokens.ts`**: the semantic colour
palette (light + dark), typography, spacing, radii, shadows, z-index layers,
breakpoints, and motion (durations + easings). Changing the look of the product
means editing tokens only.

The token pipeline:

1. **`src/design/tokens.ts`** — typed source of truth. Nothing else defines a
   colour, size, radius, shadow, z-index, breakpoint, or motion value.
2. **`src/design/css-variables.ts`** — turns those tokens into CSS custom
   properties: a `:root` light theme plus a dark variant under
   `[data-theme='dark']` (falling back to `prefers-color-scheme`). It also
   exposes `var(--…)` reference maps.
3. **`tailwind.config.ts`** — builds its **entire** theme from those reference
   maps, so utilities like `bg-primary`, `p-4`, and `rounded-lg` resolve to
   runtime CSS variables. There are no raw hex/px values in components.
4. **`src/design/ThemeStyle.tsx`** — injects the generated variables once in the
   layout `<head>`.

Because tokens become runtime CSS variables, theming is switchable at runtime
with no rebuild. `src/lib/theme.ts` toggles `data-theme`, persists the choice to
`localStorage`, and a tiny pre-paint init script (`themeInitScript`) applies the
stored theme before first paint to avoid a flash of the wrong colours.

```html
<!-- ❌ never -->            <!-- ✅ always -->
class="text-[#4f46e5]"       class="text-primary"
class="mt-[13px]"            class="mt-3"
```

**Constants, not literals.** All user-facing copy/labels, route paths, autosave
timing, upload limits/allowed types, and breakpoint names live in `src/config`
and are never inlined in components. Features compose the UI primitives in
`src/components/ui` (Button, Input, Card, Dialog, Tooltip, Toast, Skeleton, …)
rather than restyling from scratch.

---

## Responsive strategy

Mobile-first, then scale up — the layout must look polished on mobile, tablet,
laptop, and large desktop.

- **Single breakpoint source.** Breakpoints are defined once in
  `tokens.breakpoints` (`sm 640 / md 768 / lg 1024 / xl 1280 / 2xl 1536`),
  consumed by Tailwind's `screens` and re-exported from
  `src/config/breakpoints.ts` for JS `matchMedia` logic — so CSS and JS never
  disagree.
- **Fluid layouts.** Flex/grid and `clamp()`-based fluid type/space rather than
  fixed pixel widths that break on small screens.
- **Adaptive editor toolbar.** On small screens, overflow formatting actions
  collapse into a menu; touch targets stay comfortable (min ~44px).
- **SSR-safe media queries.** `src/lib/hooks/useMediaQuery.ts` (and
  `useBreakpoint`) use `useSyncExternalStore` with a `false` server snapshot —
  a mobile-first default that assumes the smaller layout until the client knows
  better — making them tear-free and hydration-safe.

### Motion & accessibility

- A single animation library (Motion). Animations derive their durations and
  easings from the motion tokens; `prefers-reduced-motion` is respected with
  reduced/disabled variants.
- Semantic HTML with proper roles/aria for the toolbar and dialogs, keyboard
  operability, visible token-based focus states, and sufficient contrast.
  Accessible names for icon-only controls live in `labels.a11y`.

---

## Data layer

Server state flows through Apollo Client; local UI state stays in React.

- **RSC client** (`src/lib/apollo/client.ts`): `getClient`/`query` give Server
  Components a request-scoped client, and `PreloadQuery` warms the cache for
  client components below them.
- **Browser client** (`src/lib/apollo/ApolloWrapper.tsx`): provides hooks to
  client components.
- **Typed operations** (`src/lib/graphql`): `npm run codegen` reads
  `schema.graphql` + operation documents and emits `TypedDocumentNode`s, which a
  thin, fully-typed hooks layer (`hooks.ts`) wraps. Components import named hooks
  from `@/lib/graphql` and never write query strings.

Every async surface (projects list, workbook load, saves, uploads, version
history) handles explicit loading, error, and empty states.

### Autosave & versioning

The workbook autosaves: a save fires once typing has been idle for
`autosaveDebounceMs` (1.5s), with an `autosaveMaxWaitMs` (10s) ceiling that
guarantees a save during continuous typing. The latest document is held in a ref
so an in-flight request always persists the freshest content, and a best-effort
flush on unmount avoids losing edits when navigating away. `Ctrl/⌘+S` forces an
immediate save. The server retains the last `editor.maxVersions` (5) snapshots,
restorable from the Version History panel.

---

## Design decisions

- **Tokens → CSS variables → Tailwind.** Keeping tokens as runtime CSS variables
  (rather than compile-time-only values) makes runtime theming trivial and keeps
  Tailwind, raw CSS, and JS reading from the same numbers.
- **`TypedDocumentNode` + a hand-written hooks layer** instead of the legacy
  `typescript-react-apollo` codegen plugin, which targets Apollo Client v3 and
  references types removed in v4. This keeps full typing on Apollo v4 while still
  exposing named, typed hooks to components (see `codegen.ts` for the rationale).
- **Centralised env access.** A single `env` module with validated defaults
  avoids scattered `process.env` reads and makes the "must be absolute for SSR"
  contract explicit in one place.
- **Two-step upload flow over `XMLHttpRequest`.** Binaries are sent to
  `POST /files/upload` (REST) and the returned `storageKey` is recorded via the
  `uploadFileMetadata` mutation. `XMLHttpRequest` is used (not `fetch`) so we get
  determinate upload-progress events. Type/size are validated client-side first,
  mirroring the server allowlist, to reject bad files before any round-trip.
- **`useSyncExternalStore` for theme and media queries.** Treating the OS theme
  and viewport as external systems avoids setState-in-effect and hydration
  mismatches.
- **Behavioural timing vs. motion timing are separated.** Interaction timing
  (toast lifetime, tooltip delay) lives in `config/ui.ts`; transition
  durations/easings live in the motion tokens.

---

## Assumptions made

- **Backend contract is frozen.** `schema.graphql` is treated as the immutable
  source of truth; the frontend adapts to it rather than the reverse.
- **AI summary is mocked.** The frozen GraphQL contract exposes no
  summarisation operation, so `src/lib/ai/requestSummary.ts` returns a canned
  summary after simulated latency. It mirrors the shape a real client would
  return, so swapping in a real `POST /ai/summary` later leaves callers (and
  their loading/error handling) unchanged.
- **API and frontend share `localhost:3000` defaults.** The default env points
  the frontend at a backend on `:3000`; run the dev server on another port (or
  set the env vars) when both run locally.
- **Upload limits mirror the server** (images + PDF, 10 MiB). If the server
  allowlist changes, update `src/config/upload.ts` to match.
- **Version retention is server-enforced at 5.** `editor.maxVersions` mirrors the
  backend's `MAX_WORKBOOK_VERSIONS`; the client only reflects it.
- **Single-user context.** There is no auth/login flow in scope; the app assumes
  the API resolves the current user and their projects.
- **Modern evergreen browsers** with support for CSS custom properties,
  `matchMedia`, and `prefers-reduced-motion`.
