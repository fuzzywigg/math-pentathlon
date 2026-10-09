# AGENTS.md — math-pentathlon

parent_governance: github.com/fuzzywigg/agents-governance

## Classification
- Tier: A=Active Strategic
- Autonomy: L2=Standard
- Stack: TypeScript, CSS

## Purpose
Math Pentathlon games platform — interactive educational math games and competition tools built with TypeScript. Primary branch is `alpha` (active development). Tip integration branch for stacked agent drafts is `cursor/mp-tip-post755`.

## Safe Agent Actions
- Update documentation and game copy
- Add or improve tests
- Fix UI/CSS styling issues
- Non-breaking dependency updates

## Draft PR into tip
- Open **draft** PRs targeting `cursor/mp-tip-post755` (never `alpha` / `main` unless the tip owner asks).
- Do not merge, do not mark ready, do not push to `alpha` / `main` / the tip branch itself.
- Tip owner folds; PR body ends with: `Next action: fold into tip by the tip owner`.
- Before starting: read the live tip tree and open draft list so work is not duplicated.
- If another open draft already covers the change, leave it open and comment `superseded` / `contained` instead of closing it.

## Local verify
Script names must match `package.json`. Prefer these over bare `npx tsc` / ad-hoc eslint.

1. **`npm run verify`** — same order as CI job `lint` in `.github/workflows/ci.yml`:
   `lint` → `lint:ratchet` → `format:check` → `typecheck` → `typecheck:ratchet` → `check:boundaries`
2. **`npm run test:unit`** — required CI `unit` job.
3. As needed: **`npm run build`** (hard 250 kB JS chunk budget under `dist/assets`) then report-only **`npm run size:check`**; required e2e **`npm run test:e2e:chromium`**.

Ratchets (`lint:ratchet`, `typecheck:ratchet`, `check:boundaries`) may only go **down**. Do not skip Prettier or ratchets.

### Local helpers (not blocking CI jobs; script / path must exist)
- **Emit identity** (type-only / brace-only proofs): `npm run check:emit-identity` → `node scripts/check-emit-identity.mjs` (see `docs/dev/ai-typeonly-option.md`). Knip `unlisted` for `esbuild` is intentional (Vite transitive); see `docs/dev/knip-report.md`.
- **Copy pins** (report-only): `npm run check:copy-pins` — prefer structural asserts; do not add new pins on player-facing copy / phase messages (`docs/dev/check-copy-pins.md`).
- **Lint buckets** (report-only): `npm run report:lint-buckets` → `node scripts/report-lint-buckets.mjs` — per-rule totals + path buckets using the same probe as `lint:ratchet`; does not write ceilings or run in CI (`docs/dev/lint-bucket-report.md`).
- Do **not** add asserts that lock AI search, scoring, difficulty, or move timing. Hex Hard stays **450ms** with real time; no Stars & Bars history cap.

## CI gates (live `.github/workflows/ci.yml`)
Workflow: `permissions: contents: read`; checkout `persist-credentials: false`.

| Role | Jobs / steps | Local reproduce (`package.json` / noted) |
| --- | --- | --- |
| **Blocking `lint`** | `lint`, `lint:ratchet`, `format:check`, `typecheck`, `typecheck:ratchet`, `check:boundaries` | `npm run verify` |
| **Blocking `audit`** | `npm audit --audit-level=high` | same |
| **Blocking `build`** | `build`; `dist/` + `dist/health.txt`; hard 250 kB/JS chunk; soft `size:check`, `check:pwa-manifest` | `npm run build` · soft: `npm run size:check` · `npm run check:pwa-manifest` |
| **Blocking `unit`** | Vitest under `tests/unit` | `npm run test:unit` |
| **Blocking `e2e`** | Chromium smoke (`@fullgame` excluded) | `npm run test:e2e:chromium` |
| **Report-only** | `e2e-fullgame`, `mobile-touch`, `zoom-reflow`, `forced-colors`, `e2e-cross-browser`, `knip`, `visual-baseline` | `npm run test:e2e:fullgame` · `npm run test:e2e:mobile` · `npm run test:e2e:zoom-reflow` · `npm run test:e2e:forced-colors` · `npm run test:e2e:firefox-webkit` (CI job runs `npm run test:e2e -- --project=firefox --project=webkit`) · `npm run report:knip` · `npm run test:e2e:visual` |

Job graph detail: `docs/dev/ci-gates-mermaid-q-mp-073.md`. Full command list: `docs/wiki/development.md`, `CONTRIBUTING.md`.

## Escalate to Human
- Production deploys or branch promotions (alpha → main)
- Game mechanic or scoring logic changes
- Schema/data model changes
- Any changes affecting student-facing scoring or records
