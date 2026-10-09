# Contributing

PRs target **`alpha`** (trunk). Do not open new work against `main`.

## Setup

```bash
npm install          # Node.js >= 20
npm run dev          # Vite → http://localhost:5173
```

## Verify before you push

```bash
npm run lint
npm run lint:ratchet         # curly:all ceiling (debt only goes down)
npm run format:check
npm run typecheck            # same as CI / package.json (tsc --noEmit)
npm run typecheck:ratchet    # scoped type-error ceiling
npm run check:boundaries     # import-graph / layering ceilings
npm run test:unit
npm run test:e2e:chromium    # required CI e2e path
npm run build
```

Use the `package.json` script names above (`npm run typecheck`, not a bare `npx tsc`). `npm test` runs unit tests then Chromium e2e (same required pair as CI). Prefer `npm run test:e2e:chromium` over bare `npm run test:e2e`, which launches every Playwright project.

Full script list, CI posture, and testing layers: [docs/wiki/development.md](./docs/wiki/development.md).

Product and agent guardrails: [AGENTS.md](./AGENTS.md). Coding patterns: [.github/copilot-instructions.md](./.github/copilot-instructions.md).

## Escalations

Do not self-serve production promotions (`alpha` → `main`), scoring/schema changes, or student-facing records changes without human review.
