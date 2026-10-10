# Testing layers — live counts (2026-10-10)

**Task id:** `q-mp-540` (remeasure after `q-mp-445` / tip post898 → tip post949; supersedes stale post898 stamp **3234** / **12972** and round-18 backlog target **3270** / **13308**)  
**Measured tip:** `cursor/mp-tip-post949` @ `d6a71f95` (full SHA `d6a71f95f1c8c9eb626c6ecf4dbd415426b1f8c7`)  
**Measured on:** 2026-10-10 (UTC)  
**Parent wiki:** [`docs/wiki/development.md`](../wiki/development.md) (testing guide from #475)

Docs-only refresh of unit file / Vitest case counts for tip post949. Pin policy unchanged. No `src/` or AI/copy/rules changes. Round-18 backlog (`q-mp-540` / #995) cited **3270** / **13308** @ tip `18ee1c96`; live tip HEAD after folds through #978–#998 is **3280** / **13408**. E2E / visual / playtest / bench rows below are carried forward from the prior post898 stamp @ `b7e518b4` (not re-listed this pass).

## Duplicate check (open drafts)

| Open draft                                                                              | Overlap                                                   | Action                                                                |
| --------------------------------------------------------------------------------------- | --------------------------------------------------------- | --------------------------------------------------------------------- |
| [#929](https://github.com/fuzzywigg/math-pentathlon/pull/929) `q-mp-445` → post898      | Same pages; stamped **3234** / **12972** @ `b7e518b4`     | **contained** — leave open; this remeasure owns tip post949 counts    |
| [#955](https://github.com/fuzzywigg/math-pentathlon/pull/955) `q-mp-090p` → post914     | Backlog that listed successor count tasks                 | **contained** — leave open                                            |
| [#886](https://github.com/fuzzywigg/math-pentathlon/pull/886) `q-mp-386` → post865      | Same pages; stamped **3210** / **12768** @ `3908809d`     | **contained** — leave open                                            |
| [#841](https://github.com/fuzzywigg/math-pentathlon/pull/841) `q-mp-335` → post785      | Same pages; stamped **3182** / **12490** @ `c9b55cff`     | **contained** — leave open                                            |
| [#791](https://github.com/fuzzywigg/math-pentathlon/pull/791) `q-mp-260` → post755      | Same pages; stamped **3156** / **12279** @ `74a1596f`     | **contained** — leave open                                            |
| [#767](https://github.com/fuzzywigg/math-pentathlon/pull/767) `q-mp-235` → post748      | Same pages; stamped **3145** / **12189** @ `23926935`     | **contained** — leave open                                            |
| [#732](https://github.com/fuzzywigg/math-pentathlon/pull/732) `q-mp-199` → post728      | Same pages; stamped **3140** / **12154** @ `b5884207`     | **contained** — leave open                                            |
| [#1001](https://github.com/fuzzywigg/math-pentathlon/pull/1001) `q-mp-537` coverage-map | Suite size context (**3280**); not wiki count cells       | Orthogonal; leave open                                                |
| Wall task `q-mp-541` (successor)                                                        | Owns wall budget + AI-bench skip evidence                 | Keep ownership disjoint — this task does not edit `ci-unit-budget.md` |
| [#995](https://github.com/fuzzywigg/math-pentathlon/pull/995) backlog 10r               | Spec source for this task                                 | Leave open                                                            |
| No open draft into `cursor/mp-tip-post949` for testing-layers / wiki unit count cells   | —                                                         | This PR is the first post949 wiki unit-count remasure                 |
| Prior stamps (`q-mp-445` / post898 @ `b7e518b4`)                                        | Stale **3234** / **12972** on tip wiki                    | Superseded by this remeasure (**3280** / **13408**)                   |
| Backlog mid-fold target (`18ee1c96`)                                                    | Stale **3270** / **13308** vs tip HEAD                    | Remeasured live on post949                                            |
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

## Live counts @ `d6a71f95`

### Unit (Vitest)

| Metric                                                |        Count | Command                                                  |
| ----------------------------------------------------- | -----------: | -------------------------------------------------------- |
| Files under `tests/unit` (excl. `_tokenmaxx_archive`) |     **3280** | `npm run test:unit`                                      |
| Cases listed (`npx vitest list`)                      |    **13408** | `npm run test:unit`                                      |
| → `unit-shared` files / cases                         | 3186 / 12438 | `npx vitest run --project unit-shared`                   |
| → `unit-node` files / cases                           |     36 / 380 | `npx vitest run --project unit-node`                     |
| → `unit-isolated` files / cases                       |     58 / 590 | `npx vitest run --project unit-isolated`                 |
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

### Playtest (headless deep harnesses — no npm script)

| Kind                        |  Count | Location / how to run                                                                                                                                                        |
| --------------------------- | -----: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Runnable harnesses (`.mjs`) |  **4** | `tests/playtest/fab-a-diffy-deep.mjs`, `tests/playtest/star-track-deep-playtest.mjs`, `docs/playtest/fraction-pinball-deep-playtest.mjs`, `docs/playtest/hex-deep-probe.mjs` |
| Report Markdown (top-level) | **15** | `docs/playtest/*.md` (tablet sweep + per-game deep reports)                                                                                                                  |
| Artifact dirs               | **15** | `docs/playtest/*/` (screenshots / JSON)                                                                                                                                      |

There is **no** `package.json` playtest script. Typical local run (Vite must already be up):

```bash
npm run dev   # separate terminal → http://127.0.0.1:5173
PLAYTEST_BASE_URL=http://127.0.0.1:5173 node tests/playtest/fab-a-diffy-deep.mjs
PLAYTEST_BASE_URL=http://127.0.0.1:5173 node tests/playtest/star-track-deep-playtest.mjs
PLAYTEST_BASE_URL=http://127.0.0.1:5173 node docs/playtest/hex-deep-probe.mjs
PLAYTEST_BASE_URL=http://127.0.0.1:5173 node docs/playtest/fraction-pinball-deep-playtest.mjs
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
