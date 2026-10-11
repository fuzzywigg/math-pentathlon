# Contributing

Human / trunk PRs target **`alpha`**. Do not open new work against `main`.

Cloud-agent workers open **draft** PRs into the living tip (`cursor/mp-tip-*`) per [AGENTS.md](./AGENTS.md). Tip owners fold those drafts; only Grok Bot merges a tip into `alpha` / `main`. Do not treat the tip as the human PR base.

## Setup

```bash
npm install          # Node.js >= 20
npm run dev          # Vite → http://localhost:5173
```

## Verify before you push

Run the blocking half of the CI `lint` job (`npm run verify` ⊆ lint job — same order as `.github/workflows/ci.yml`):

```bash
npm run verify
```

That runs `lint` → `lint:ratchet` → `format:check` → `typecheck` → `typecheck:ratchet` → `check:boundaries`. CI then runs report-only `npm run check:copy-pins -- --fail` with `continue-on-error: true` (outside `package.json` `verify`; does not fail the required lint job).

Then the rest of the required local gates:

```bash
npm run test:unit
npm run test:e2e:chromium    # required CI e2e path
npm run build
```

Use `npm run typecheck` (not bare `npx tsc --noEmit`) so the check matches `package.json` and CI — `npm run verify` already covers it. `npm test` runs unit tests then Chromium e2e (same required pair as CI). Prefer `npm run test:e2e:chromium` over bare `npm run test:e2e`, which launches every Playwright project. For the report-only browser pair, `npm run test:e2e:firefox-webkit` matches CI (`firefox` + `webkit`). `npm run test:e2e:cross` adds `ipad-webkit` for local/cross coverage; it is not a separate CI job.

Full script list, CI posture, and testing layers: [docs/wiki/development.md](./docs/wiki/development.md).

Before adding tests that assert status/menu chrome strings, run `npm run check:copy-pins` (report-only). Prefer structural asserts over pinning `getPhaseMessage` / `getCurrentPhaseMessage` / `Coming Soon` — see [docs/dev/check-copy-pins.md](./docs/dev/check-copy-pins.md).

Product and agent guardrails: [AGENTS.md](./AGENTS.md). Coding patterns: [.github/copilot-instructions.md](./.github/copilot-instructions.md).

## Escalations

Do not self-serve production promotions (`alpha` → `main`), scoring/schema changes, or student-facing records changes without human review.
