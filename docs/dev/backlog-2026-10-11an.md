# Engineering backlog — 2026-10-11an (tip refill after post1239 cut / round-40)

**Task id:** `q-mp-090an`  
**Role:** worker (report-only)  
**Tip audited:** `cursor/mp-tip-post1239` @ `1c0f831d` (full `1c0f831d89c08341723d6eaa1de0796557678038`; tip carries merge `#1239` / post1218 fold into alpha lineage, tip-folded round-38 backlog `10al` via `#1253`, and open tip implementers for round-39 ids)  
**Depends on:** tip cut `cursor/mp-tip-post1239` @ `1c0f831d`. Round-39 backlog (`q-mp-090am` / open `#1261` on post1218, ids `q-mp-1033`…`1051`) — tip implementers `#1262`–`#1274` already cover several slices; remaining am gaps (`1036`/`1038`/`1046`/`1049`/`1050`/`1051` and any unworked siblings) — leave with `contained`. Round-38 al gaps and older tip stacks (`#1254`–`#1260` on post1218, `#1212`–`#1238` on post1183, etc.) — leave with `contained`. Tip HEAD continues to move as tip-owner folds green drafts — **rebase onto latest tip before opening worker PRs**.

## Purpose

The tip `cursor/mp-tip-post1239` @ `1c0f831d` measures unit files **3392**; Chromium e2e **25** files / **249** cases; knip unusedExports **3** (LEAVE) / unusedTypes **29** / unusedFiles **0**; dead-code Rank-2 **yes: 0** on live dry-run. Tip CI run `38107348270` (post1218 lineage carried into this tip) is green on blocking jobs; report-only `visual-baseline` still records **42 failed** screenshot comparisons (owned by round-39 `1050` — leave with `contained`). This doc lists **21 new** concrete engineering tasks (`q-mp-1052` … `q-mp-1072`) mined from the **live tip tree**, checked against prior refills through `q-mp-1051` and against the full open draft PR list (tip implementers `#1262`–`#1274`, post1218 leftovers `#1254`–`#1261`, post1183 / older stacks). It is the **only** deliverable of `q-mp-090an`.

**Honest count:** Only **21** tasks — not padded to 25. Id range starts at `q-mp-1052` per round-40 brief (`1008`–`1016` and `981`–`991` remain unused / reserved). Round-39 already claimed engine-rank contradictory pct, flake-unit `success:true` short-circuit, ratchet `--first-parent`, knip incomplete/corrupt baseline, licenses null/empty packages, mutation no-files-as-killed, coverage-map covered>total, size:check `--fail-on-new-over` docs+pin, PWA `REPORT_ONLY` comment, webkit-offline forced exit 0, knip-report exit docs, readme `foo:*` globs, ai-move-time `/workspace` path, placeholder `example.test.ts`, audit `npx tsc` docs, dead `TRACKED.curly`, visual-baseline 42 fails, canvas-dpr WebKit skip — **do not** re-queue `1033`–`1051` (leave `#1261` + open `#1262`–`#1274` + unworked am gaps with `contained`). This refill **does not** re-queue page-ready / double-rAF / artifact-dir / mountPair adoptions, npm aliases, `--help` / `--dry-run` / unknown-flag argv sweeps, empty-input / malformed-JSON guards as a family, lib main-entry guards, tip-name doc pointers, tip-stamp **count** remasures, knip unusedTypes baseline drop, Rank-3 demote theater, CI `e2e-cross-browser` named script (`800`), dismissOwl deep-playtest (`879`), deep-playtest / star-track / docs-playtest `waitForTimeout` families (`803`–`807` / `1030`/`1031`), stars-bars / nav-away **wait** clears (prior HOLD/skip — this refill’s `1070` is **only** the incomplete game-list gap), emit-identity wave5 merge-base tip retarget (tip-owner HOLD-CHECK — not queued), or anything in rounds ≤39.

**Fresh payoffs on this tip (re-measured after post1239 cut + open `#1262`–`#1274`):** **`flake-rate-e2e-loop` shallow-walks only top-level `suite.specs` so nested Playwright suites produce an empty per-test table while `stats.unexpected>0`**, **`check-emit-identity --normalize` collapses whitespace inside string/template literals (JSDoc claims outside)**, **`classifyLicense` treats `GPLv2` / `GPLv3` / bare `GPL` / `GNU GPL` as `ok` while `GPL-2.0`/`GPL-3.0` are denied**, **`validateIndexHtml` misses valid `theme-color` tags when `media` precedes `name`**, **`validateManifest` REQUIRED `display: standalone` rejects `fullscreen`/`minimal-ui` that the installability comment allows**, **`check-workflows` rejects quoted YAML `timeout-minutes: "20"`**, **`parsePrecacheManifest` drops revision-first and single-quoted Workbox entries**, **`check-copy-pins` MATCHER_RE ignores `toHaveTextContent` / `toHaveAccessibleName` (silent miss on realistic Vitest/jest-dom asserts)**, **`parseMenuCriticalRefs` ignores `./assets/…` then main `catch` forces exit 0**, CLI-help / argv unit suites pay multi-second **`spawnSync` tax** (browser-harness / deep-playtest / offline-probe / mutation-report-args / env-number), dead exports **`HOVER_GAMES`**, **`readLiveLintSnapshot`**, license pattern constants, and **`pathBucket`/`summarizeBuckets`** have zero external callers, **`check:dev-docs` still reports 10 missing-path hits** (renamed paths in older backlog docs + one intentional negative-example path), **`nav-away-sweep` fixed list omits 8 live games**, and **`engine-property-invariants`** is the slowest non-AI unit file measured locally (~6.3s).

**Preference:** SAFE, mutually independent **scripts/** wrong-results fixes, **docs-only** accuracy, or **tests-only** wall-time hygiene. **Do not** queue another remasure of CI wall, bundle headroom, lint-bucket snapshot, copy-pins findings totals, boundaries/PWA thresholds, board-3d layout inventory, CI permissions, tip-pointer **count** stamps, open-draft triage, emit-identity inventory remasure, knip unusedTypes baseline drop, Rank-3 demote theater, dead-CSS Rank-1 rescan, or wiki **count** cells. Anything in rules / AI / scoring / legal-move paths, player-facing copy, tutorials product edits, timing, Stars & Bars history cap, Hex Hard 450ms, board-3d **src** / **mp3d e2e**, or CI permissions widening is **HOLD**. **Do not** change fake-clock semantics. **Do not** edit `*/rules.ts`.

**Lint policy for this refill:** **no** new ceiling-key clears.

## Duplicate check (do not re-queue)

| Topic family | Why skipped |
| --- | --- |
| round-39 / engine contradictory pct (`1033`) / flake-unit success:true (`1034`) / ratchet first-parent (`1035`) / knip incomplete baseline (`1036`) / licenses null packages (`1037`) / mutation no-files (`1038`) / coverage covered>total (`1039`) / size:check fail-on-new-over docs+pin (`1040`/`1041`) / PWA REPORT_ONLY (`1042`) / webkit exit 0 (`1043`) / knip-report exit docs (`1044`) / readme globs (`1045`) / ai-move-time path (`1046`) / example.test (`1047`) / npx tsc docs (`1048`) / TRACKED.curly (`1049`) / visual-baseline (`1050`) / canvas-dpr WebKit (`1051`) | open `#1261` + tip implementers `#1262`–`#1274`; am gaps still need workers — leave with `contained`; **do not** re-queue `1033`–`1051` (this refill’s `1052`/`1054`/`1059` are **only** e2e nested-suite walk / GPL legacy strings / toHaveTextContent matcher — not siblings of unit `success:true`, null-packages, or copy-pins CI docs) |
| round-38…32 / page-ready / double-rAF / artifact-dir / mountPair / npm aliases / `--help`/`--dry-run`/argv / lib main-entry / empty-input argv | prompt hard-skip + open drafts / tip folds — leave with `contained` |
| CI `e2e-cross-browser` named script (`800`) / dismissOwl deep-playtest (`879`) | tip-queued; unworked — **do not** re-queue |
| deep-playtest / star-track / docs-playtest waits `803`–`807` / `1030`/`1031` | leave prior ids; this refill does **not** add more waitForTimeout clears |
| knip unusedExports LEAVE / unusedTypes baseline drop / Rank-3 demotes / dead-code Rank-2 yes (live **0**) / unusedFiles **0** | no SAFE deletes of knip product exports; remasure theater skipped; dead **script** export demotes below are distinct |
| tip-name pointers (`1027`/`1032` / open `#1255`) | prompt hard-skip — AGENTS still names `post1218` while tip is `post1239`; leave tip-owner / prior ids |
| emit-identity wave5 merge-base tip retarget | tip-owner HOLD-CHECK — not queued; this refill’s `1053` is **only** string-safe `--normalize` |
| AI determinism / quality shard wall times | **HOLD** — AI harness; do not fake-clock or change search |
| AI-timing / Hex Hard 450ms / history-cap / rules.ts / copy / scoring / CI permissions / eqeqeq in `fiar/rules.ts` | hard-rule HOLD |

Also skipped: Merom / Sullivan / data-center / grants / nonprofit; `pappas-infrastructure`; meromhouse agents; any CI `permissions` widening. No `memory/` files.

## Stale queue re-check (live tip `1c0f831d`)

| Id | Title (short) | Verdict | Evidence @ `1c0f831d` |
| --- | --- | --- | --- |
| `q-mp-090am` / `#1261` | round-39 backlog | **open on post1218** | Leave with `contained`; this refill starts at `1052`. |
| `#1262`–`#1274` | am implementers on tip post1239 | **open / tip-folding** | Leave with `contained`. |
| `#1254`–`#1260` | al implementers on post1218 | **open / tip-folding** | Leave with `contained`. |
| `q-mp-1036`/`1038`/`1046`/`1049`/`1050`/`1051` | am gaps still valid | **still-valid; need workers** | leave prior ids; do not sibling. |
| `q-mp-800` | CI cross-browser named script | **tip-queued; unworked** | Live `ci.yml` still bare `test:e2e -- --project=firefox --project=webkit` — **do not** re-queue. |
| `q-mp-879` | dismissOwl deep-playtest adopters | **still-valid; no open PR** | Leave prior id. |
| Dead-code Rank-2 yes | live dry-run | **0 yes** | No SAFE product delete ticket; script export demotes only. |
| Tip CI `38107348270` | blocking green; visual 42 failed | **report-only drift** | Owned by `1050` — leave with `contained`. |

## Shared-file conflict flags

| Shared file | Conflicting new ids |
| --- | --- |
| `scripts/flake-rate-e2e-loop.mjs` | `1052` only; serialize with open `#1270`/`1034` (corrupt-JSON loader / unit ok — nested walk still missing) |
| `scripts/check-emit-identity.mjs` | `1053` only |
| `scripts/report-licenses.mjs` (+ `.d.mts` if export surface changes) | `1054` + `1067` — serialize; leave open `#1271`/`1037` null-packages alone |
| `scripts/lib/pwa-manifest-contract.mjs` | `1055` + `1056` — serialize; leave open `#1262`/`1042` check-pwa-manifest comment alone |
| `scripts/check-workflows.mjs` | `1057` only |
| `scripts/check-build.mjs` | `1058` only |
| `scripts/check-copy-pins.mjs` | `1059` only; leave open `#1259`/`1028`/`1029` CI docs+pin alone |
| `scripts/check-bundle-budgets.mjs` | `1060` only; leave al `1020` budgets schema + open `#1267`/`1040`/`1041` docs alone |
| `tests/unit/browser-harness-cli-help.test.ts` | `1061` only |
| `tests/unit/deep-playtest-cli-help.test.ts` | `1062` only |
| `tests/unit/offline-probe-cli-help.test.ts` | `1063` only |
| `tests/unit/mutation-report-args.test.ts` | `1064` only; leave open `#1232`/`967` empty-argv + `#1235`/`975` main-entry alone |
| `scripts/render-perf-mode.mjs` | `1065` only |
| `scripts/report-ratchet-history.mjs` | `1066` only; serialize with open `#1266`/`1035` `--first-parent` (+ am `1049` TRACKED.curly) |
| `scripts/report-lint-buckets.mjs` | `1068` only; leave al `1022` ceilings `{}` alone |
| `tests/unit/env-number.test.ts` | `1069` only; leave open `#1228`/`958` main-entry alone |
| `scripts/nav-away-sweep.mjs` | `1070` only; do **not** clear nav-away waits (prior HOLD/skip) |
| `tests/unit/engine-property-invariants.test.ts` (+ helper) | `1071` only |
| Older `docs/dev/backlog-2026-10-10a*.md` path fixes | `1072` only |

**Parallel-friendly:** `1052`, `1053`, `1057`, `1058`, `1059`, `1061`, `1062`, `1063`, `1064`, `1065`, `1069`, `1070`, `1071`, `1072`. Serialize `1054`→`1067`; serialize `1055`→`1056`; serialize `1052` lightly with `#1270`; serialize `1066` lightly with `#1266`; serialize `1060` lightly with al `1020` / `#1267`.

## Live tip measurements (evidence snapshot @ `1c0f831d`)

```text
$ git rev-parse HEAD
  1c0f831d89c08341723d6eaa1de0796557678038

$ git branch --show-current
  cursor/mp-tip-post1239

$ find tests/unit \( -name '*.test.ts' -o -name '*.spec.ts' \) ! -path '*/_tokenmaxx_archive/*' | wc -l
  3392

$ npm run test:e2e:chromium -- --list
  Total: 249 tests in 25 files

$ npm run report:knip -- --json
  unusedExports: 3  unusedTypes: 29  unusedFiles: 0
  (NOTICE unusedTypes 36→29 shrink vs committed baseline 36 — baseline write NOT queued)

$ npm run report:dead-code -- --dry-run
  Safe-to-remove yes: 0; review/no: 53

$ # flake-rate-e2e nested Playwright JSON (synthetic matching real reporter shape)
  shallow suite.specs count → 0
  recursive walk specs → 2 (1 failed / 1 passed); stats.unexpected=1

$ node --input-type=module -e 'import { stripCommentsAndCollapseWhitespace } from "./scripts/check-emit-identity.mjs"; …'
  "hello  world" vs "hello world" → equalRaw=false, equalAfterNormalize=true

$ node --input-type=module -e 'import { classifyLicense } from "./scripts/report-licenses.mjs"; …'
  GPLv2=>ok  GPLv3=>ok  GPL=>ok  GNU GPL=>ok  GPL-2.0=>denied  GPL-3.0=>denied

$ validateIndexHtml media-before-name vs name-first
  name-first → no theme-color errors
  media-first → missing theme-color light/dark

$ validateManifest display=fullscreen|minimal-ui
  → manifest.display: expected "standalone" (installability branch never reached for those values)

$ auditWorkflow timeout-minutes: "20" (string)
  → job j: missing positive timeout-minutes
  numeric 20 → []

$ parsePrecacheManifest
  url-first double-quote → [{url,revision}]
  revision-first → []
  single-quotes → []

$ MATCHER_RE on .toHaveTextContent('Coming Soon') → false
  .toBe / .toContain → true

$ parseMenuCriticalRefs('./assets/…') → []; absolute '/assets/…' → [css,js]
  measureMenuCriticalPath throw → main catch sets exitCode 0

$ CI=1 npx vitest run tests/unit/browser-harness-cli-help.test.ts
  Duration 3.84s (tests 3.60s) — 18 tests

$ CI=1 npx vitest run tests/unit/deep-playtest-cli-help.test.ts
  Duration 2.97s (tests 2.71s) — 13 tests

$ CI=1 npx vitest run tests/unit/offline-probe-cli-help.test.ts
  Duration 2.02s (tests 1.80s) — 9 tests

$ CI=1 npx vitest run tests/unit/mutation-report-args.test.ts
  Duration 3.11s (tests 2.88s) — 33 tests

$ CI=1 npx vitest run tests/unit/env-number.test.ts
  Duration 2.44s (tests 2.17s) — 15 tests

$ CI=1 npx vitest run tests/unit/engine-property-invariants.test.ts
  Duration 6.28s (tests 5.72s) — 32 tests

$ npm run check:dev-docs
  problems: 10 missing-path (backlog docs only; includes one intentional negative-example path)

$ nav-away-sweep GAMES.length=12; src/games dirs=20
  missingFromSweep: fiar, hex-a-gone, kings-quadraphages, kwatro-sinko, pent-em-in, prime-gold, queens-guards, star-track

$ Open drafts into cursor/mp-tip-post1239 at audit: #1262–#1274 (12)
$ Open drafts into cursor/mp-tip-post1218 at audit: #1254–#1261 (8) including round-39 backlog #1261
$ Tip→alpha fold open: #1265 (q-mp-026x)
```

Baselines also captured under `/opt/cursor/artifacts/q-mp-090an-baselines.log`.

## New tasks

### q-mp-1052 · Scripts: `flake-rate-e2e-loop` recurse nested Playwright `suites` (no empty per-test table)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1239`)
- **depends-on:** none (serialize lightly with open `#1270`/`1034` on the same file — that PR only swaps JSON loader / does **not** deep-walk)
- **series:** script-tooling
- **verdict:** **SAFE** — wrong aggregation on realistic Playwright JSON (`JSONReportSuite.suites?`); not a new corrupt-JSON / `--help` ticket
- **CI / package.json callers:** `package.json` → `flake:e2e`; **not** a blocking CI job (local flake loop)
- **target files:** `scripts/flake-rate-e2e-loop.mjs` (`ingest`); hermetic unit with nested fixture (prefer fake reporter JSON, no real Playwright spawn)
- **measured baseline:** Nested synthetic report with top-level `specs: []` and child `suites[].specs` (1 failed / 1 passed) → current shallow loop tracks **0** specs while `stats.unexpected=1`. Live Chromium JSON for `tests/e2e/smoke.spec.ts` has the same nested shape.
- **acceptance criteria:** Recursive walk of `suite.suites` records every spec; failingTests / per-test table non-empty when nested failures exist; top-level-only reports unchanged; corrupt/missing JSON path left to `1024`/`1034`.
- **verification commands:** `CI=1 npx vitest run tests/unit/flake-rate-loop*.test.ts` ; `rg -n 'suites|ingest' scripts/flake-rate-e2e-loop.mjs`
- **conflict notes:** distinct from unit-loop `success:true` (`1034`) and corrupt JSON (`1024`).

### q-mp-1053 · Scripts: `check-emit-identity --normalize` must not collapse whitespace inside strings/templates

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1239`)
- **depends-on:** none
- **series:** script-tooling
- **verdict:** **SAFE** — false emit-identity on valid TS with different string contents; JSDoc already promises outside-literal collapse
- **CI / package.json callers:** `package.json` → `check:emit-identity`; **not** a blocking CI job (local / AI type-only proof helper)
- **target files:** `scripts/check-emit-identity.mjs` (`stripCommentsAndCollapseWhitespace`); unit cases for `"a  b"` vs `"a b"` and template literals
- **measured baseline:** `stripCommentsAndCollapseWhitespace('export const s = "hello  world";')` equals normalize of `"hello world"` → **true** while raw differs. Comment at L138–140 claims collapse is outside string/template literals.
- **acceptance criteria:** `--normalize` still collapses insignificant WS outside literals; different string/template contents remain `differ`; default (non-normalize) byte compare unchanged; no AI product file edits.
- **verification commands:** `CI=1 npx vitest run tests/unit/check-emit-identity*.test.ts` (or new hermetic); `node --input-type=module -e 'import { stripCommentsAndCollapseWhitespace } from "./scripts/check-emit-identity.mjs"; …'`
- **conflict notes:** not emit-identity wave5 merge-base retarget (tip-owner HOLD-CHECK).

### q-mp-1054 · Scripts: `classifyLicense` deny legacy `GPLv2` / `GPLv3` / bare `GPL` / `GNU GPL`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1239`)
- **depends-on:** none (serialize with `1067`; leave open `#1271`/`1037` null/empty packages alone)
- **series:** script-tooling
- **verdict:** **SAFE** — wrong SBOM class on realistic legacy npm license strings; not a malformed-lock / empty-packages ticket
- **CI / package.json callers:** `package.json` → `report:licenses`; **not** a blocking CI job
- **target files:** `scripts/report-licenses.mjs` (`DENIED_LICENSE_PATTERNS` / `classifyLicense`); extend `tests/unit/report-licenses-helpers.test.ts` (or sibling)
- **measured baseline:** `GPLv2`/`GPLv3`/`GPL`/`GNU GPL` → `ok`; `GPL-2.0`/`GPL-3.0` → `denied`; `AGPL-3.0` → `denied`; `LGPL-2.1` → `copyleft_or_review`.
- **acceptance criteria:** Legacy GPL spellings classify as `denied` (or documented equivalent deny bucket); SPDX `GPL-2.0`/`GPL-3.0` unchanged; MIT/Apache stay `ok`; no lockfile rewrite in this ticket.
- **verification commands:** `CI=1 npx vitest run tests/unit/report-licenses*.test.ts` ; `node --input-type=module -e 'import { classifyLicense } from "./scripts/report-licenses.mjs"; …'`
- **conflict notes:** distinct from `#1271`/`1037` (null/empty `packages`) and `#1256`/`1026` (malformed lock UX).

### q-mp-1055 · Scripts: `validateIndexHtml` accept `theme-color` when `media` precedes `name`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1239`)
- **depends-on:** none (serialize with `1056`; leave open `#1262`/`1042` alone)
- **series:** script-tooling
- **verdict:** **SAFE** — false negative on valid HTML attribute order
- **CI / package.json callers:** `package.json` → `check:pwa-manifest`; `.github/workflows/ci.yml` → `build` job → `npm run check:pwa-manifest` (report-only)
- **target files:** `scripts/lib/pwa-manifest-contract.mjs` (`validateIndexHtml` theme-color regexes); unit cases for attribute orders
- **measured baseline:** Same colors/meta with `name` first → no theme-color errors; `media="(prefers-color-scheme: …)"` before `name="theme-color"` → `missing theme-color` light/dark. Live `index.html` stays green either way after fix.
- **acceptance criteria:** All attribute orders that include correct `name` + `content` + `media` pass; wrong colors still fail; live `index.html` + existing PWA tests green.
- **verification commands:** `CI=1 npx vitest run tests/unit/*pwa-manifest*.test.ts` ; `npm run check:pwa-manifest` (with `dist/` present)
- **conflict notes:** not `REPORT_ONLY` comment (`1042`).

### q-mp-1056 · Scripts: resolve `validateManifest` display contradiction (`standalone` REQUIRED vs installability set)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1239`)
- **depends-on:** `1055` lightly (same module); tip-owner skim
- **series:** script-tooling
- **verdict:** **HOLD-CHECK** — product installability policy vs brand pin; either drop dead fullscreen/minimal-ui branch or relax REQUIRED
- **CI / package.json callers:** `package.json` → `check:pwa-manifest`; `.github/workflows/ci.yml` → `build` → `npm run check:pwa-manifest` (report-only)
- **target files:** `scripts/lib/pwa-manifest-contract.mjs` (`REQUIRED_MANIFEST.display` + installability check); tests/docs that pin `standalone`
- **measured baseline:** Comment L115 allows `standalone|fullscreen|minimal-ui`, but `REQUIRED_MANIFEST.display === 'standalone'` emits `expected "standalone"` for `fullscreen`/`minimal-ui` before the broader check runs. `browser` hits both errors.
- **acceptance criteria:** One coherent rule: either (a) brand requires `standalone` only and dead branch/docs are removed, or (b) REQUIRED accepts the full installability set; tests/docs match; live manifest unchanged unless tip-owner asks.
- **verification commands:** `CI=1 npx vitest run tests/unit/*pwa-manifest*.test.ts` ; `rg -n 'display|standalone|fullscreen|minimal-ui' scripts/lib/pwa-manifest-contract.mjs`
- **conflict notes:** tip-owner skim (installability policy).
- **screen:** HOLD-CHECK — product PWA display policy.

### q-mp-1057 · Scripts: `check-workflows` accept numeric-string `timeout-minutes`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1239`)
- **depends-on:** none
- **series:** script-tooling
- **verdict:** **SAFE** — valid YAML coercion gap; not an empty/malformed workflow ticket
- **CI / package.json callers:** `package.json` → `check:workflows`; **not** referenced in `.github/workflows/ci.yml` (local / contributor gate)
- **target files:** `scripts/check-workflows.mjs` (timeout check); fixture/unit with `"20"`
- **measured baseline:** `job['timeout-minutes'] = '20'` → `missing positive timeout-minutes`; numeric `20` → clean.
- **acceptance criteria:** `Number(value) > 0` (finite) accepted whether number or numeric string; non-numeric / ≤0 still fail; live workflows stay clean.
- **verification commands:** `npm run check:workflows` ; `CI=1 npx vitest run tests/unit/check-workflows*.test.ts` (or new hermetic)
- **conflict notes:** leave `#1216`/`943` unknown-flag / `#1168` families alone.

### q-mp-1058 · Scripts: `parsePrecacheManifest` accept revision-first + single-quoted entries

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1239`)
- **depends-on:** none (leave ak `999` SKIP-missing build alone)
- **series:** script-tooling
- **verdict:** **SAFE** — silent undercount of precache entries on valid Workbox-like literals
- **CI / package.json callers:** `package.json` → `check:build`; **not** a blocking CI job (local build reproducibility helper)
- **target files:** `scripts/check-build.mjs` (`parsePrecacheManifest`); expand helpers unit tests
- **measured baseline:** `{ url: "/a.js", revision: "1" }` → 1 entry; `{ revision: "1", url: "/a.js" }` → **[]**; single-quoted → **[]**; `revision: null` url-first still works.
- **acceptance criteria:** Parser accepts either key order and `'` / `"` quotes; null revision still supported; live `dist` SW path unchanged when present.
- **verification commands:** `CI=1 npx vitest run tests/unit/check-build*.test.ts` ; `node --input-type=module -e 'import { parsePrecacheManifest } from "./scripts/check-build.mjs"; …'`
- **conflict notes:** distinct from SKIP-missing (`999`).

### q-mp-1059 · Scripts: `check-copy-pins` MATCHER_RE include `toHaveTextContent` (+ related text matchers)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1239`)
- **depends-on:** none (leave open `#1259`/`1028`/`1029` CI docs+pin alone)
- **series:** script-tooling
- **verdict:** **SAFE** — false negative on realistic Vitest/jest-dom asserts; report-only CI soft step accuracy
- **CI / package.json callers:** `package.json` → `check:copy-pins`; `.github/workflows/ci.yml` → `lint` job → `npm run check:copy-pins -- --fail` (soft / report-only posture per docs)
- **target files:** `scripts/check-copy-pins.mjs` (`MATCHER_RE` / extractExpectUnit); `--self-test` positive case
- **measured baseline:** `.toBe('Coming Soon')` / `.toContain(…)` match; `.toHaveTextContent('Coming Soon')` / `.toHaveAccessibleName('x')` → **false** (expect unit not extracted → silent miss).
- **acceptance criteria:** At least `toHaveTextContent` (and preferably `toHaveAccessibleName` / `toHaveText`) extracted like `toBe`; `--self-test` covers a positive; no new copy pins on player-facing strings in this ticket.
- **verification commands:** `npm run check:copy-pins -- --self-test` ; `npm run check:copy-pins` ; `rg -n 'MATCHER_RE|toHaveTextContent' scripts/check-copy-pins.mjs`
- **conflict notes:** not CI copy-pins docs (`1028`/`1029`).

### q-mp-1060 · Scripts: `size:check` parse relative `./assets` menu refs (and don’t soft-exit 0 on “no refs”)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1239`)
- **depends-on:** none (leave al `1020` budgets schema + open `#1267`/`1040`/`1041` + ak `996` broken-menu html alone)
- **series:** script-tooling
- **verdict:** **HOLD-CHECK** — soft CI `size:check` exit semantics; tip-owner should skim before changing catch→0 behavior
- **CI / package.json callers:** `package.json` → `size:check`; `.github/workflows/ci.yml` → `build` → `npm run size:check -- --fail-on-new-over` (`continue-on-error: true`)
- **target files:** `scripts/check-bundle-budgets.mjs` (`parseMenuCriticalRefs` + main `catch`); optional docs note in `docs/bundle-budget.md`
- **measured baseline:** Absolute `/assets/…` → refs found; relative `./assets/…` → `[]` → `No menu JS/CSS refs found` throw → catch prints `(report-only: exiting 0)` → exit **0**. Vite `base: '/'` emits absolute today.
- **acceptance criteria:** Relative and absolute asset hrefs parse; “no refs” is usage/schema exit **2** (not swallowed 0); valid `dist/` + budgets path unchanged; no budget number edits.
- **verification commands:** `node --input-type=module -e 'import { parseMenuCriticalRefs } from "./scripts/check-bundle-budgets.mjs"; …'` ; `npm run size:check` (good dist)
- **conflict notes:** tip-owner review (soft CI step); distinct from empty budgets schema (`1020`) and broken-menu html (`996`).
- **screen:** HOLD-CHECK — CI soft gate exit semantics.

### q-mp-1061 · Tests: speed `browser-harness-cli-help` by preferring in-process parse/usage

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 test-hygiene
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1239`)
- **depends-on:** none
- **series:** test-speed
- **verdict:** **SAFE** — wall-time cut only; keep 1–2 spawn smokes if needed; **not** a new `--help`/argv product sweep
- **CI / package.json callers:** exercised by `npm run test:unit` / CI `unit` job (file under `tests/unit`)
- **target files:** `tests/unit/browser-harness-cli-help.test.ts` (+ import parse/usage helpers from harness CLIs)
- **measured baseline:** Local `CI=1` → **3.84s** Duration / **3.60s** tests (18 cases, mostly `spawnSync` of 5 scripts × help/unknown).
- **acceptance criteria:** Same assertions; Duration **<1.5s** locally under `CI=1` (or ≥2× faster than baseline); no script behavior change required beyond exporting pure parse/usage if missing.
- **verification commands:** `CI=1 npx vitest run tests/unit/browser-harness-cli-help.test.ts`
- **conflict notes:** do not expand into new unknown-flag theater.

### q-mp-1062 · Tests: speed `deep-playtest-cli-help` by preferring in-process parse/usage

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 test-hygiene
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1239`)
- **depends-on:** none
- **series:** test-speed
- **verdict:** **SAFE** — wall-time cut only; not deep-playtest wait swaps (`803`–`807`)
- **CI / package.json callers:** `npm run test:unit` / CI `unit`
- **target files:** `tests/unit/deep-playtest-cli-help.test.ts`
- **measured baseline:** Local `CI=1` → **2.97s** Duration / **2.71s** tests (13 cases).
- **acceptance criteria:** Same coverage; Duration **<1.2s** locally under `CI=1` (or ≥2× faster); no harness gameplay edits.
- **verification commands:** `CI=1 npx vitest run tests/unit/deep-playtest-cli-help.test.ts`
- **conflict notes:** leave wait-clear ids alone.

### q-mp-1063 · Tests: speed `offline-probe-cli-help` by preferring in-process parse/usage

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 test-hygiene
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1239`)
- **depends-on:** none (leave open `#1274`/`1043` exit-code fix alone)
- **series:** test-speed
- **verdict:** **SAFE** — wall-time cut only; not probe `waitForTimeout` clears / exit-code product
- **CI / package.json callers:** `npm run test:unit` / CI `unit`
- **target files:** `tests/unit/offline-probe-cli-help.test.ts`
- **measured baseline:** Local `CI=1` → **2.02s** Duration / **1.80s** tests (9 cases).
- **acceptance criteria:** Same coverage; Duration **<0.8s** locally under `CI=1` (or ≥2× faster).
- **verification commands:** `CI=1 npx vitest run tests/unit/offline-probe-cli-help.test.ts`
- **conflict notes:** distinct from `#1274`/`1043`.

### q-mp-1064 · Tests: speed `mutation-report-args` by moving argv rejects in-process

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 test-hygiene
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1239`)
- **depends-on:** none (leave `#1232`/`967` empty-argv + `#1235`/`975` main-entry alone)
- **series:** test-speed
- **verdict:** **SAFE** — wall-time cut; keep thin spawn smoke for main-entry/`--help` if needed
- **CI / package.json callers:** `npm run test:unit` / CI `unit`
- **target files:** `tests/unit/mutation-report-args.test.ts` (+ `parseMutationReportArgs` usage)
- **measured baseline:** Local `CI=1` → **3.11s** Duration / **2.88s** tests (33 cases; multiple `spawnSync` sites).
- **acceptance criteria:** Argv reject cases call parser in-process; Duration **<1.5s** locally under `CI=1` (or ≥2× faster); product empty-argv behavior left to `967`.
- **verification commands:** `CI=1 npx vitest run tests/unit/mutation-report-args.test.ts`
- **conflict notes:** not empty-argv / main-entry product tickets.

### q-mp-1065 · Scripts: demote dead export `HOVER_GAMES` (zero external callers)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 cleanup
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1239`)
- **depends-on:** none
- **series:** dead-export
- **verdict:** **SAFE** — export-only surface; keep internal `const` usage
- **CI / package.json callers:** `package.json` → `perf:render` (script consumers; export unused)
- **target files:** `scripts/render-perf-mode.mjs`
- **measured baseline:** `rg HOVER_GAMES` → only defining file (`const` + `export { HOVER_GAMES }`); zero tests/importers.
- **acceptance criteria:** No external export (or explicitly documented intentional public API with a unit); internal hover-game set still works; render-perf unit tests green.
- **verification commands:** `rg -n 'HOVER_GAMES' --glob '!node_modules'` ; `CI=1 npx vitest run tests/unit/*render-perf*.test.ts`
- **conflict notes:** not `TRACKED.curly` (`1049`).

### q-mp-1066 · Scripts: demote dead export `readLiveLintSnapshot` (zero external callers)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 cleanup
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1239`)
- **depends-on:** none (serialize lightly with open `#1266`/`1035` on same file)
- **series:** dead-export
- **verdict:** **SAFE** — export-only surface; keep internal call from `writeReport`
- **CI / package.json callers:** `package.json` → `report:ratchet-history` (if present) / direct `node scripts/report-ratchet-history.mjs`; **not** a blocking CI job
- **target files:** `scripts/report-ratchet-history.mjs`
- **measured baseline:** `rg readLiveLintSnapshot` → defining file only (export + internal use).
- **acceptance criteria:** Function becomes module-private (or gains a hermetic unit if kept exported); `#1266` first-parent behavior preserved when both land.
- **verification commands:** `rg -n 'readLiveLintSnapshot' --glob '!node_modules'` ; `CI=1 npx vitest run tests/unit/report-ratchet-history*.test.ts`
- **conflict notes:** serialize with `#1266`; leave `1049` TRACKED.curly alone.

### q-mp-1067 · Scripts: demote unused license pattern / `matchesAny` exports

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 cleanup
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1239`)
- **depends-on:** `1054` (same module) — land after or with it
- **series:** dead-export
- **verdict:** **SAFE** — export-only; helpers tests use `classifyLicense` only
- **CI / package.json callers:** `package.json` → `report:licenses`
- **target files:** `scripts/report-licenses.mjs` + `scripts/report-licenses.d.mts`
- **measured baseline:** `DENIED_LICENSE_PATTERNS` / `COPYLEFT_OR_REVIEW_PATTERNS` / `UNKNOWN_LICENSE_PATTERNS` / `matchesAny` — no external importers outside `.d.mts` declarations.
- **acceptance criteria:** Demote to non-export (update `.d.mts`); `classifyLicense` behavior unchanged (including `1054` if folded); unit suite green.
- **verification commands:** `CI=1 npx vitest run tests/unit/report-licenses*.test.ts` ; `rg -n 'DENIED_LICENSE_PATTERNS|matchesAny' --glob '!node_modules'`
- **conflict notes:** serialize after `#1271`/`1037` + `1054`.

### q-mp-1068 · Scripts: demote or unit-cover `pathBucket` / `summarizeBuckets`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 cleanup
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1239`)
- **depends-on:** none (leave al `1022` ceilings `{}` alone)
- **series:** dead-export
- **verdict:** **SAFE** — either demote exports or add hermetic units if keeping public
- **CI / package.json callers:** `package.json` → `report:lint-buckets`; **not** a blocking CI job
- **target files:** `scripts/report-lint-buckets.mjs`; optional new unit file
- **measured baseline:** Exports used only inside `main`; parse-args unit tests do not import them.
- **acceptance criteria:** No orphan public exports **or** documented + tested API; bucket math unchanged; `npm run report:lint-buckets` still runs.
- **verification commands:** `rg -n 'pathBucket|summarizeBuckets' --glob '!node_modules'` ; `npm run report:lint-buckets` (or `--help` if present without expanding argv theater)
- **conflict notes:** not ceilings `{}` TypeError (`1022`).

### q-mp-1069 · Tests: speed `env-number` by cutting playtest `spawnSync` probes

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 test-hygiene
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1239`)
- **depends-on:** none (leave open `#1228`/`958` main-entry alone)
- **series:** test-speed
- **verdict:** **SAFE** — wall-time cut via static/import checks where QUICK already avoids launch
- **CI / package.json callers:** `npm run test:unit` / CI `unit`
- **target files:** `tests/unit/env-number.test.ts`
- **measured baseline:** Local `CI=1` → **2.44s** Duration / **2.17s** tests (15 cases; spawns memory/runtime/playtest scripts).
- **acceptance criteria:** Duration **<1.0s** locally under `CI=1` (or ≥2× faster); keep one spawn smoke if main-entry contract requires it; no env semantics change for harnesses.
- **verification commands:** `CI=1 npx vitest run tests/unit/env-number.test.ts`
- **conflict notes:** not main-entry adoption (`958`).

### q-mp-1070 · Scripts: `nav-away-sweep` — expand or document intentional 8-game omission

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1239`)
- **depends-on:** tip-owner skim
- **series:** harness-coverage
- **verdict:** **HOLD-CHECK** — may include board-3d / heavier games; do **not** clear nav-away fixed waits (prior HOLD/skip)
- **CI / package.json callers:** **none** in CI (local audit script; `926` may add `audit:nav-away` — leave that id)
- **target files:** `scripts/nav-away-sweep.mjs` (+ short docs note if list stays partial)
- **measured baseline:** Fixed `GAMES` length **12**; live `src/games` dirs **20**; missing: `fiar`, `hex-a-gone`, `kings-quadraphages`, `kwatro-sinko`, `pent-em-in`, `prime-gold`, `queens-guards`, `star-track`. Header calls it a “fixed game list” without explaining omissions.
- **acceptance criteria:** Either (a) add missing non-HOLD games with tip-owner OK, or (b) document intentional omissions (e.g. 3D / mp3d) in USAGE/docs; **no** `waitForTimeout` clear in this ticket; no `src/` edits.
- **verification commands:** `rg -n 'const GAMES|waitForTimeout' scripts/nav-away-sweep.mjs` ; `ls src/games`
- **conflict notes:** tip-owner skim; leave wait-clear HOLD list alone; leave npm alias `926` alone.
- **screen:** HOLD-CHECK — harness game coverage / possible board-3d inclusion.

### q-mp-1071 · Tests: profile/trim `engine-property-invariants` wall (non-AI)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 test-hygiene
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1239`)
- **depends-on:** tip-owner skim before reducing seeds/plies
- **series:** test-speed
- **verdict:** **HOLD-CHECK** — touches engine/legal-move property surface (not AI timing); tip-owner should approve any seed/ply trim
- **CI / package.json callers:** `npm run test:unit` / CI `unit`
- **target files:** `tests/unit/engine-property-invariants.test.ts`, `tests/unit/helpers/engine-property-invariants.ts`
- **measured baseline:** Local `CI=1` → **6.28s** Duration / **5.72s** tests (32 cases). Tip CI unit log previously ~**12.4s** for this file. Not AI determinism shards.
- **acceptance criteria:** Keep property guarantees; any seed/ply/sample trim needs tip-owner note in PR; Duration target **<4s** locally under `CI=1` without weakening asserts; no `*/rules.ts` product edits.
- **verification commands:** `CI=1 npx vitest run tests/unit/engine-property-invariants.test.ts`
- **conflict notes:** not `state-roundtrip-fuzz` (`830`); not AI shards.
- **screen:** HOLD-CHECK — engine property coverage density.

### q-mp-1072 · Docs: fix renamed paths in older backlog docs so `check:dev-docs` is clean

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs-accuracy
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1239`)
- **depends-on:** none
- **series:** docs-accuracy
- **verdict:** **SAFE** — docs-only backlog hygiene; leave the intentional negative-example game path alone
- **CI / package.json callers:** `package.json` → `check:dev-docs`; **not** a blocking CI job (report-only)
- **target files:** `docs/dev/backlog-2026-10-10ac.md`, `docs/dev/backlog-2026-10-10ae.md`, `docs/dev/backlog-2026-10-10al.md` (and any sibling hits `check:dev-docs` lists)
- **measured baseline:** `npm run check:dev-docs` → **10** missing-path, all under docs/dev/backlog-*. Real renames (stale → live): lint-ratchet-probe script → `scripts/check-lint-ratchet.mjs`; mobile-viewport-smoke e2e → `tests/e2e/mobile-touch-smoke.spec.ts`; calla board module → `src/games/calla/board-ui.ts`; plus hex-ui / kings board-ui / ai-determinism monolith path drift. One hit is an intentional negative-example game path — **keep**.
- **acceptance criteria:** `check:dev-docs` problems **0** except intentional negative examples; no tip-name pointer edits; no product path inventing.
- **verification commands:** `npm run check:dev-docs`
- **conflict notes:** round-39 noted these and skipped — re-queueing now as concrete docs hygiene after tip cut; not tip-name pointers.

## Verdict summary

| Id | Verdict | Title (short) |
| --- | --- | --- |
| `q-mp-1052` | **SAFE** | flake-rate-e2e: recurse nested Playwright suites |
| `q-mp-1053` | **SAFE** | emit-identity `--normalize`: string/template-safe WS collapse |
| `q-mp-1054` | **SAFE** | classifyLicense: deny GPLv2/GPLv3/GPL/GNU GPL |
| `q-mp-1055` | **SAFE** | validateIndexHtml: theme-color media-before-name |
| `q-mp-1056` | **HOLD-CHECK** | validateManifest: display REQUIRED vs installability set |
| `q-mp-1057` | **SAFE** | check-workflows: accept numeric-string timeout-minutes |
| `q-mp-1058` | **SAFE** | parsePrecacheManifest: revision-first + single quotes |
| `q-mp-1059` | **SAFE** | check-copy-pins: MATCHER_RE + toHaveTextContent |
| `q-mp-1060` | **HOLD-CHECK** | size:check: relative ./assets refs + no soft-exit on no-refs |
| `q-mp-1061` | **SAFE** | speed browser-harness-cli-help (in-process) |
| `q-mp-1062` | **SAFE** | speed deep-playtest-cli-help (in-process) |
| `q-mp-1063` | **SAFE** | speed offline-probe-cli-help (in-process) |
| `q-mp-1064` | **SAFE** | speed mutation-report-args (in-process) |
| `q-mp-1065` | **SAFE** | demote dead export HOVER_GAMES |
| `q-mp-1066` | **SAFE** | demote dead export readLiveLintSnapshot |
| `q-mp-1067` | **SAFE** | demote unused license pattern exports |
| `q-mp-1068` | **SAFE** | demote or unit-cover pathBucket/summarizeBuckets |
| `q-mp-1069` | **SAFE** | speed env-number (cut spawnSync) |
| `q-mp-1070` | **HOLD-CHECK** | nav-away-sweep: expand or document 8-game omission |
| `q-mp-1071` | **HOLD-CHECK** | engine-property-invariants wall trim |
| `q-mp-1072` | **SAFE** | backlog docs renamed-path hygiene for check:dev-docs |

**Screened HOLD-CHECK (4):** `1056`, `1060`, `1070`, `1071` — tip-owner should skim before fold (PWA display policy; soft size:check exit; harness game list; engine property density).  
**No HOLD** product tickets queued (AI shard speedups measured but left out of scope).

## Out of scope / not used here

Already claimed / undrafted / HOLD / no headroom / prompt-skipped families: void/nnnull/nullish successors, eqeqeq product clear (`fiar/rules.ts` HOLD), lint-buckets eqeqeq probe (`792`), optional-chain product clears, knip demote / unusedTypes baseline drop, wiki **count** remasure, tip-name pointers (`1027`/`1032` / open `#1255`), UI coverage rounds, soft-fail characterizations, mutation-audit **waves**, board-3d **src** / **mp3d e2e** wait clears, harness shards, demo coverage, `*types*` residuals, page-ready / double-rAF / artifact-dir / mountPair / npm aliases / `--help`/`--dry-run`/argv / empty-input / lib main-entry (rounds 34–39), deep-playtest `waitForTimeout` (`803`–`807` / `1030`/`1031`), overnight mountPair/router batches, round-31…39 tickets through `q-mp-1051`, CI `e2e-cross-browser` yaml named script (`800`), dismissOwl deep-playtest (`879`), stars-bars / nav-away mid-AI / memory-leak / runtime-perf / webkit-offline / probe-offline **wait** clears (prior HOLD/skip), emit-identity wave5 merge-base tip retarget (tip-owner HOLD-CHECK), Queens & Guards product, AI timing / Hex Hard 450ms / Stars & Bars history cap, AI determinism/quality shard wall-time cuts (HOLD), dead-code Rank-2 yes deletes (live **0**), `cancelFabAiRequests` knip LEAVE (AI HOLD), visual-baseline refresh (`1050`), canvas-dpr WebKit skip policy (`1051`).

**Could not honestly fill to 25** without filler (more `--help`/`--dry-run`/argv/empty-input theater, mountPair adoptions, npm aliases, tip-name pointer stamps, knip baseline remasure, Rank-3 demote theater, AI harness speed theater, or HOLD board-3d/mp3d wait clears). Stopped at **21**.
