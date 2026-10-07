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
npm run format:check
npx tsc --noEmit
npm run test:unit
npm run test:e2e:chromium   # required CI e2e path
npm run build
```

`npm test` runs unit tests then Chromium e2e (same required pair as CI). Prefer `npm run test:e2e:chromium` over bare `npm run test:e2e`, which launches every Playwright project.

Full script list, CI posture, and testing layers: [docs/wiki/development.md](./docs/wiki/development.md).

Product and agent guardrails: [AGENTS.md](./AGENTS.md). Coding patterns: [.github/copilot-instructions.md](./.github/copilot-instructions.md).

## Escalations

Do not self-serve production promotions (`alpha` → `main`), scoring/schema changes, or student-facing records changes without human review.
