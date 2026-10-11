# Testing layers — live counts (2026-10-10)

**Task id:** `q-mp-026t` tip-owner remasure on tip `cursor/mp-tip-post1083` (supersedes #1098 mid-tip stamp + post1059 inherit)  
**Measured tip:** `cursor/mp-tip-post1083` @ `548802e2` (full `548802e254b9e13baed951f7ebb6762ff91d5683`; cut from `alpha` @ `8901cff6` after #1083)  
**Measured on:** 2026-10-10 (UTC)  
**Parent wiki:** [`docs/wiki/development.md`](../wiki/development.md) (testing guide from #475)

Docs-only tip-owner remasure on post1083 tip open (#1098 obligation; prior mid-tip stamp moot). Pin policy unchanged. No `src/` or AI/copy/rules changes. Live tip HEAD remasure is **3366** files / **14347** listed cases (`unit-shared` **13104** / `unit-node` **380** / `unit-isolated` **863**). Counts move every fold — tip owner should re-measure at fold. E2E / visual / playtest / bench rows below are carried forward from the prior post898 stamp @ `b7e518b4` (not re-listed this pass).

## Duplicate check (open drafts)

| Open draft                                                                              | Overlap                                                   | Action                                                                |
| --------------------------------------------------------------------------------------- | --------------------------------------------------------- | --------------------------------------------------------------------- |
| [#1041](https://github.com/fuzzywigg/math-pentathlon/pull/1041) `q-mp-090u` backlog 10u | Spec source for this task (`q-mp-600`)                    | Leave open `contained`                                                |
| [#1004](https://github.com/fuzzywigg/math-pentathlon/pull/1004) / `q-mp-540`            | Older tip remasure inventories (**3280** / **13408**)     | **contained** — leave open                                            |
| [#1009](https://github.com/fuzzywigg/math-pentathlon/pull/1009) / `q-mp-560`            | Older tip remasure inventories                            | **contained** — leave open                                            |
| [#929](https://github.com/fuzzywigg/math-pentathlon/pull/929) `q-mp-445` → post898      | Same pages; stamped **3234** / **12972** @ `b7e518b4`     | **contained** — leave open                                            |
| [#886](https://github.com/fuzzywigg/math-pentathlon/pull/886) `q-mp-386` → post865      | Same pages; stamped **3210** / **12768** @ `3908809d`     | **contained** — leave open                                            |
| [#841](https://github.com/fuzzywigg/math-pentathlon/pull/841) `q-mp-335` → post785      | Same pages; stamped **3182** / **12490** @ `c9b55cff`     | **contained** — leave open                                            |
| [#791](https://github.com/fuzzywigg/math-pentathlon/pull/791) `q-mp-260` → post755      | Same pages; stamped **3156** / **12279** @ `74a1596f`     | **contained** — leave open                                            |
| Wall task `q-mp-541` / #1011                                                            | Owns wall budget + AI-bench skip evidence                 | Keep ownership disjoint — this task does not edit `ci-unit-budget.md` |
| Prior stamps (`q-mp-540` / post977 @ `50d9b4a0`)                                        | Stale **3285** / **13502** on testing-layers              | Superseded by this remasure (**3308** / **13760**)                    |
| Prior tip-owner wiki stamp @ `78c7e39b`                                                 | Wiki-only **3306** / **13748** (testing-layers untouched) | Superseded by live remasure (**3308** / **13760** @ `780db960`)       |
| #658 `q-mp-063` unit CI headroom                                                        | May change **unit wall time** (fixtures / virtual clocks) | **Does not change file/case counts** — note only                      |
| Tip-pointer / AGENTS drafts                                                             | Own tip-name pointer lines                                | Serialize: this task owns **count cells** + measurement tip SHA only  |

## How counts were measured

```bash
# Unit files (same formula CI prints in the unit job)
find tests/unit \( -name '*.test.ts' -o -name '*.spec.ts' \) \
  ! -path '*/_tokenmaxx_archive/*' | wc -l

# Unit cases (Vitest project list; includes skip/todo entries)
npx vitest list | wc -l

# Each Playwright project
npx playwright test --project=<name> --list
# Required CI chromium path:
npx playwright test --project=chromium --grep-invert @fullgame --list
# Opt-in visual config:
npx playwright test -c playwright.visual.config.ts --list
```

## Live counts @ `548802e2` (post1083 tip-owner remasure)

### Unit (Vitest)

| Metric                                                |        Count | Command                                                  |
| ----------------------------------------------------- | -----------: | -------------------------------------------------------- |
| Files under `tests/unit` (excl. `_tokenmaxx_archive`) |     **3366** | `npm run test:unit`                                      |
| Cases listed (`npx vitest list`)                      |    **14347** | `npm run test:unit`                                      |
| → `unit-shared` cases (`vitest list`)                 |        13104 | `npx vitest list --project unit-shared`                  |
| → `unit-node` cases (`vitest list`)                   |        380 | `npx vitest list --project unit-node`                    |
| → `unit-isolated` cases (`vitest list`)               |          863 | `npx vitest list --project unit-isolated`                |
| Watch / coverage                                      |            — | `npm run test:unit:watch` / `npm run test:unit:coverage` |

`npm test` = `test:unit` && `test:e2e:chromium`.

**#658 note:** open draft [#658](https://github.com/fuzzywigg/math-pentathlon/pull/658) (`q-mp-063` unit CI headroom) may shrink CI unit **wall time**; file and case **counts above are tip-as-is** and are not expected to move with that PR.

AI latency benches inside the unit tree (`tests/unit/ai-move-time-midgame.bench.test.ts`, `tests/unit/tablet-ai-hard-latency.bench.test.ts`) use `describe.skipIf(!!process.env.CI)` — they count in `vitest list` locally but are skipped on GitHub Actions.

### E2E (Playwright projects in `playwright.config.ts`)

Carried forward from prior stamp @ `b7e518b4` (not re-listed this unit-count pass):

| Project                                                | Spec files | Cases (`--list`) | npm script                                   | CI posture                |
| ------------------------------------------------------ | ---------: | ---------------: | -------------------------------------------- | ------------------------- |
| `chromium` (all matched specs)                         |         45 |              269 | `npm run test:e2e` with `--project=chromium` | —                         |
| `chromium` **required CI** (`--grep-invert @fullgame`) |         25 |              249 | `npm run test:e2e:chromium`                  | **required**              |
| fullgame (`tests/e2e/fullgame`, `@fullgame`)           |         20 |               20 | `npm run test:e2e:fullgame`                  | report-only               |
| `firefox`                                              |         25 |              249 | `npm run test:e2e:firefox-webkit`            | report-only (with webkit) |
| `webkit`                                               |         25 |              249 | `npm run test:e2e:firefox-webkit`            | report-only               |
| `ipad-webkit`                                          |         25 |              249 | `npm run test:e2e:cross`                     | local / cross script      |
| `mobile-iphone-13`                                     |          1 |               20 | `npm run test:e2e:mobile`                    | report-only               |
| `mobile-pixel-7`                                       |          1 |               20 | `npm run test:e2e:mobile`                    | report-only               |
| `mobile-ipad`                                          |          1 |               20 | `npm run test:e2e:mobile`                    | report-only               |
| `zoom-reflow`                                          |          1 |               69 | `npm run test:e2e:zoom-reflow`               | report-only               |
| `forced-colors`                                        |          1 |               25 | `npm run test:e2e:forced-colors`             | report-only               |
| `visual-desktop`                                       |          1 |               21 | `npm run test:e2e:visual`                    | report-only               |
| `visual-phone`                                         |          1 |               21 | `npm run test:e2e:visual`                    | report-only               |

Bare `npm run test:e2e` (no `--project`) runs **every** registered project — prefer an explicit script.

Playwright UI mode: `npm run test:e2e:ui`.

### Visual (opt-in separate config)

| Suite                                                      |                 Spec files |   Cases | Committed PNG baselines                  | Command                                                      |
| ---------------------------------------------------------- | -------------------------: | ------: | ---------------------------------------- | ------------------------------------------------------------ |
| Opt-in 2D (`playwright.visual.config.ts`, `tests/visual/`) |                          1 |      21 | 21 under `tests/visual/__screenshots__/` | `npm run test:visual` / `npm run test:visual:update`         |
| E2E visual projects (above)                                | 1 shared spec × 2 projects | 21 + 21 | 42 under `tests/e2e/visual-baselines/`   | `npm run test:e2e:visual` / `npm run test:e2e:visual:update` |

Opt-in visual is **not** wired into CI. E2E visual is CI job `visual-baseline` (**report-only**). Details: [`docs/visual-regression.md`](../visual-regression.md).

### Playtest (headless deep harnesses)

| Kind                                      |  Count | Location / how to run                                                                                                                                                        |
| ----------------------------------------- | -----: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Named npm scripts (`playtest:*`)          |  **5** | `npm run playtest:calla` / `playtest:ramrod` / `playtest:sum-dominoes` / `playtest:stars-bars` / `playtest:par-55` → `scripts/*-deep-playtest.mjs` (local; not CI)           |
| Extra harnesses under `tests/playtest/`   |  **2** | `tests/playtest/fab-a-diffy-deep.mjs`, `tests/playtest/star-track-deep-playtest.mjs` (no npm alias; run with `node` + Vite up)                                               |
| Probes under `docs/playtest/`             |  **2** | `docs/playtest/fraction-pinball-deep-playtest.mjs`, `docs/playtest/hex-deep-probe.mjs`                                                                                        |
| Report Markdown (top-level)               | **15** | `docs/playtest/*.md` (tablet sweep + per-game deep reports)                                                                                                                  |
| Artifact dirs                             | **15** | `docs/playtest/*/` (screenshots / JSON)                                                                                                                                      |

Typical local run (Vite must already be up for `node` paths). Base-URL env names are **not** unified — each harness reads the var below (defaults are localhost/`127.0.0.1:5173` when unset):

| Harness | Env var | Default host form |
| ------- | ------- | ----------------- |
| `playtest:calla` → `scripts/calla-deep-playtest.mjs` | `PLAYTEST_BASE` (`PLAYTEST_BASE_URL` alias) | `http://127.0.0.1:5173` |
| `playtest:ramrod` / `sum-dominoes` / `stars-bars` / `par-55` → `scripts/*-deep-playtest.mjs` | `PLAYTEST_BASE` | `http://127.0.0.1:5173` |
| `tests/playtest/fab-a-diffy-deep.mjs` | `PLAYTEST_BASE_URL` | `http://localhost:5173` |
| `tests/playtest/star-track-deep-playtest.mjs` | `PLAYTEST_BASE_URL` | `http://127.0.0.1:5173` |
| `docs/playtest/fraction-pinball-deep-playtest.mjs` | `PLAYTEST_BASE` | `http://localhost:5173` |
| `docs/playtest/hex-deep-probe.mjs` | `HEX_PLAYTEST_URL` | `http://127.0.0.1:5173` |

```bash
npm run dev   # separate terminal → http://127.0.0.1:5173
npm run playtest:calla
PLAYTEST_BASE=http://127.0.0.1:5173 npm run playtest:ramrod
npm run playtest:sum-dominoes
npm run playtest:stars-bars
npm run playtest:par-55
PLAYTEST_BASE_URL=http://127.0.0.1:5173 node tests/playtest/fab-a-diffy-deep.mjs
PLAYTEST_BASE_URL=http://127.0.0.1:5173 node tests/playtest/star-track-deep-playtest.mjs
HEX_PLAYTEST_URL=http://127.0.0.1:5173 node docs/playtest/hex-deep-probe.mjs
PLAYTEST_BASE=http://127.0.0.1:5173 node docs/playtest/fraction-pinball-deep-playtest.mjs
```

### Bench

| Suite                                  |                                    Files | Command                                 | Notes                                                                                               |
| -------------------------------------- | ---------------------------------------: | --------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Rules-engine microbench (all 20 games) | 1 (`tests/bench/engines-rules.bench.ts`) | `npm run bench:engines`                 | Separate Vitest config (`vitest.engines-bench.config.ts`); **not** part of `npm run test:unit` / CI |
| AI move-time / tablet Hard latency     |         2 (`tests/unit/*.bench.test.ts`) | included in `npm run test:unit` locally | Skipped when `CI=1`; do not add new AI timing asserts                                               |

Findings snapshot: [`docs/engine-bench-2026-10-08.md`](../engine-bench-2026-10-08.md).

## Pin policy (new tests)

Hard rule for drafts folding onto the tip: characterization may pin **structure and engine state**, not chrome strings, AI move choice, or AI think timing.

| Prefer                                                          | Avoid                                                        |
| --------------------------------------------------------------- | ------------------------------------------------------------ |
| `expect(state.turnPhase).toBe('…')` / legal-move set equality   | `expect(getPhaseMessage(state)).toBe('…')` / status regexes  |
| Badge / control **presence** (`toBeTruthy()`)                   | Exact player-facing copy (`'Coming Soon'`, `"You win!"`, …)  |
| Fake timers + generation handles for AI scheduling              | Asserting AI pick identity, search depth, or think deadlines |
| Hex Hard deadline **characterization** stays `450` ms real time | Changing Hex Hard `450` or adding Stars & Bars history caps  |

Report-only helper for copy pins: `npm run check:copy-pins` (see [`docs/dev/check-copy-pins.md`](./check-copy-pins.md)).

Also unchanged by this docs task: CI `permissions: contents: read` + `persist-credentials: false`; no new network in tests; ratchets only go down.

## Related wiki / CI map

- Public testing guide: [`docs/wiki/development.md`](../wiki/development.md)
- CI gate Mermaid (report-only drafts may refresh it): [`docs/dev/ci-gates-mermaid-q-mp-073.md`](./ci-gates-mermaid-q-mp-073.md)
- Gzip NEW OVER snapshot (juggle / par-55 / remainder-islands): [`docs/dev/bundle-over-2026-10-09.md`](./bundle-over-2026-10-09.md) (`npm run size:check`; allowlist policy in [`docs/bundle-budget.md`](../bundle-budget.md))
