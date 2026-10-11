# Engineering backlog — 2026-10-11ar (tip refill after poste740 folds / round-44)

**Task id:** `q-mp-090ar`  
**Role:** worker (report-only)  
**Tip audited:** `cursor/mp-tip-poste740` @ `5e39694b` (full `5e39694b1fde0f01c3e13fdb8a8381727097035a`; tip cut from `alpha` @ `e740d0b6` after `#1288`; tip-owner fold `#1304` carries living tip pointers; tip HEAD folded round-42 backlog `#1310` / `q-mp-090ap`, round-43 backlog `#1319` / `q-mp-090aq`, and implementers through `#1318`)  
**Depends on:** tip `cursor/mp-tip-poste740` @ `5e39694b`. Round-43 backlog (`q-mp-090aq` / folded `#1319`, ids `q-mp-1122`…`1137`) — leave open tip drafts `#1298`–`#1318` and unworked aq/ap/ao gaps with `contained`. Concurrent writer branch `cursor/backlog-2026-10-11aq-2cd6` matches tip-folded aq doc (re-checked; no delta). Tip HEAD continues to move as tip-owner folds green drafts — **rebase onto latest tip before opening worker PRs**.

## Purpose

The tip `cursor/mp-tip-poste740` @ `5e39694b` measures unit files **3402**; Chromium e2e **25** files / **249** cases; knip unusedExports **3** (LEAVE) / unusedTypes **29** / unusedFiles **0**. This doc lists **17 new** concrete engineering tasks (`q-mp-1147` … `q-mp-1163`) mined from the **live tip tree after `#1311`–`#1319` folds**, checked against prior refills through `q-mp-1137` and against the full open draft PR list (poste740 `#1298`–`#1319`, post01f5 leftovers, post1239 / older stacks). It is the **only** deliverable of `q-mp-090ar`.

**Honest count:** Only **17** tasks — not padded to 25. Id range starts at `q-mp-1147` per round-44 brief (`1138`–`1146` remain unused / reserved; `1115`–`1121`, `1073`–`1076`, `1008`–`1016`, `981`–`991` remain unused / reserved). Round-43 already claimed scalar/string `on:`, job-level permissions, YAML-array cache-dependency-path, precache spaced JSON-quoted keys + integrity, Affero/LGPL/EUPL/OSL/LICENCE/CPAL license prose, menu `src`/`href` word boundary, engine pct-only clamp, copy-pins jest-dom matchers, offsetWidth restore, ap backlog self-hits, check-copy-pins.md exit docs — **do not** re-queue `1122`–`1137` (leave with `contained`). This refill **does not** re-queue page-ready / double-rAF / artifact-dir / mountPair adoptions, npm aliases, `--help` / `--dry-run` / unknown-flag argv sweeps, empty-input / malformed-JSON guards as a family, lib main-entry guards, tip-name doc pointers, tip-stamp **count** remasures, knip unusedTypes baseline drop, Rank-3 demote theater, more cli-help spawn speedups, AI harness speed theater, license-classifier siblings beyond aq, pwa-manifest-contract tweaks, check-workflows bool parsing, CI `e2e-cross-browser` named script (`800`), dismissOwl deep-playtest (`879`), deep-playtest / star-track / docs-playtest `waitForTimeout` families, stars-bars / nav-away **wait** clears (prior HOLD/skip), emit-identity wave5 merge-base tip retarget (tip-owner HOLD-CHECK — not queued), or anything in rounds ≤43.

**Fresh payoffs on this tip (re-measured @ `5e39694b` after `#1311`–`#1319` folds):** **`check-workflows` Playwright cache pin requires the literal substring `hashFiles('package-lock.json')` so double-quoted `hashFiles("package-lock.json")` and `hashFiles('**/package-lock.json')` false-fail**, **`parsePrecacheManifest` still drops Workbox entries that include a trailing `size` field** (integrity owned by aq `1126`), **`parseMenuCriticalRefs` still misses single-quoted and uppercase `SRC`/`HREF` while `data-src` false-positives remain owned by aq `1132`**, **`stripMdLinkTitle` still leaves CommonMark parenthetical titles `path.md (title)` intact** (quoted titles fixed by folded `1095`), **`readReporterJson` returns `ok: true` for JSON `null` / arrays so flake-rate loops crash or under-count**, **`summarizeKnip(null)` still throws** (non-array `issues` fixed by folded `1106`), **`validateBaselineMetrics` accepts negative / fractional unused counts**, **`classifyVitestRunResult` maps `Found 0 test files` / `filter matched no files` to `killed`**, **`check-copy-pins --fail` still prints `Report-only: exit 0` and JSON `reportOnly: true` while exiting 1**, and **script headers for copy-pins still claim always exit 0**.

**Preference:** SAFE, mutually independent **scripts/** wrong-results fixes, **docs-only** accuracy, or **tests-only** flake hygiene. **Do not** queue another remasure of CI wall, bundle headroom, lint-bucket snapshot, copy-pins findings totals, boundaries/PWA thresholds, board-3d layout inventory, CI permissions, tip-pointer **count** stamps, open-draft triage, emit-identity inventory remasure, knip unusedTypes baseline drop, Rank-3 demote theater, dead-CSS Rank-1 rescan, wiki **count** cells, more cli-help spawn speedups, or more license-classifier / pwa-manifest-contract / workflows-bool theater. Anything in rules / AI / scoring / legal-move paths, player-facing copy, tutorials product edits, timing, Stars & Bars history cap, Hex Hard 450ms, board-3d **src** / **mp3d e2e**, or CI permissions widening is **HOLD**. **Do not** change fake-clock semantics. **Do not** edit `*/rules.ts`.

**Lint policy for this refill:** **no** new ceiling-key clears.

## Duplicate check (do not re-queue)

| Topic family                                                                                                                                                                                                                                                                                                                                                          | Why skipped                                                                                                                                                                                                                                                                                              |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| round-43 / scalar `on:` (`1122`) / job permissions (`1123`) / cache-array (`1124`) / precache spaced JSON (`1125`) / integrity (`1126`) / Affero·LGPL·EUPL·OSL·LICENCE·CPAL (`1127`–`1131`) / menu word-boundary (`1132`) / engine pct clamp (`1133`) / copy-pins matchers (`1134`) / offsetWidth (`1135`) / ap self-hits (`1136`) / check-copy-pins.md exit (`1137`) | tip-folded `#1319` + unworked aq gaps — leave with `contained`; **do not** re-queue `1122`–`1137` (this refill’s `1148`/`1149`/`1150`… are **only** Workbox `size`, single-quote / case-insensitive attrs, paren md titles — not siblings of integrity, word-boundary false positives, or license prose) |
| round-42…32 / page-ready / double-rAF / artifact-dir / mountPair / npm aliases / `--help`/`--dry-run`/argv / lib main-entry / empty-input argv / cli-help spawn theater                                                                                                                                                                                               | prompt hard-skip + open drafts / tip folds — leave with `contained`                                                                                                                                                                                                                                      |
| license-classifier / pwa-manifest-contract / check-workflows bool parsing                                                                                                                                                                                                                                                                                             | prompt hard-skip for this round                                                                                                                                                                                                                                                                          |
| CI `e2e-cross-browser` named script (`800`) / dismissOwl deep-playtest (`879`)                                                                                                                                                                                                                                                                                        | tip-queued; unworked — **do not** re-queue                                                                                                                                                                                                                                                               |
| deep-playtest / star-track / docs-playtest waits                                                                                                                                                                                                                                                                                                                      | leave prior ids                                                                                                                                                                                                                                                                                          |
| visual-baseline PNG refresh (`1050`) / diagnose (`1093`/`1113`)                                                                                                                                                                                                                                                                                                       | leave with `contained`                                                                                                                                                                                                                                                                                   |
| nested flake-e2e (`1052`) / emit string/regex normalize (`1053`/`1086`) / menu quote+query (`1088`) / boundaries inline type (`1089`) / permissions read-all (`1091`) / owl flake (`1092`) / `./assets` size (`1060`) / proprietary license (`1081`)                                                                                                                  | leave prior ids / open drafts                                                                                                                                                                                                                                                                            |
| knip unusedExports LEAVE / unusedTypes baseline drop / Rank-3 demotes / dead-code Rank-2 yes (live **0**) / unusedFiles **0**                                                                                                                                                                                                                                         | no SAFE deletes of knip product exports; remasure theater skipped                                                                                                                                                                                                                                        |
| tip-name pointers                                                                                                                                                                                                                                                                                                                                                     | already on tip (`AGENTS.md` / wiki → `poste740`) via `#1304` bootstrap                                                                                                                                                                                                                                   |
| emit-identity wave5 merge-base tip retarget / emit export demote (`1110`)                                                                                                                                                                                                                                                                                             | tip-owner HOLD-CHECK / prior id — not queued                                                                                                                                                                                                                                                             |
| AI determinism / quality shard wall times / queens fuzz further trim                                                                                                                                                                                                                                                                                                  | **HOLD** — AI harness; do not fake-clock or change search                                                                                                                                                                                                                                                |
| AI-timing / Hex Hard 450ms / history-cap / rules.ts / copy / scoring / CI permissions / eqeqeq in `fiar/rules.ts`                                                                                                                                                                                                                                                     | hard-rule HOLD                                                                                                                                                                                                                                                                                           |
| wiki / testing-layers **count** remasure                                                                                                                                                                                                                                                                                                                              | prompt hard-skip tip-stamp theater                                                                                                                                                                                                                                                                       |

Also skipped: Merom / Sullivan / data-center / grants / nonprofit; `pappas-infrastructure`; meromhouse agents; any CI `permissions` widening. No `memory/` files.

## Stale queue re-check (live tip `5e39694b`)

| Id                                              | Title (short)                     | Verdict                                 | Evidence @ `5e39694b`                                                                            |
| ----------------------------------------------- | --------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `q-mp-090aq` / `#1319`                          | round-43 backlog                  | **tip-folded**                          | This refill starts at `1147`.                                                                    |
| `#1311`–`#1318`                                 | ap SAFE implementers              | **tip-folded**                          | Leave with `contained`.                                                                          |
| `q-mp-1122`…`1137`                              | aq gaps still valid               | **still-valid; need workers**           | leave prior ids; do not sibling.                                                                 |
| `q-mp-1097`…`1114` (except folded implementers) | ap residual gaps                  | **still-valid**                         | leave prior ids.                                                                                 |
| `q-mp-1081`/`1088`/`1089`/`1091`/`1092`/`1093`  | ao HOLD-CHECK gaps                | **still-valid**                         | leave prior ids.                                                                                 |
| `q-mp-1050`                                     | visual-baseline refresh/stabilize | **still-valid; no open PNG refresh PR** | Leave prior id; `1113` diagnose-only.                                                            |
| `q-mp-800`                                      | CI cross-browser named script     | **tip-queued; unworked**                | Live `ci.yml` still bare `test:e2e -- --project=firefox --project=webkit` — **do not** re-queue. |
| `q-mp-879`                                      | dismissOwl deep-playtest adopters | **still-valid; no open PR**             | Leave prior id.                                                                                  |
| Dead-code Rank-2 yes                            | live dry-run                      | **0 yes** (prior)                       | No SAFE product delete ticket.                                                                   |
| offsetWidth A/B                                 | burn-wave40 → probe FAIL          | **still-valid; owned by `1135`**        | leave with `contained`.                                                                          |

## Shared-file conflict flags

| Shared file                                                           | Conflicting new ids                                                               |
| --------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `scripts/check-workflows.mjs`                                         | `1147` + `1148` — serialize; leave aq `1122`–`1124` + ap `1097` + ao `1091` alone |
| `scripts/check-build.mjs`                                             | `1149` only; leave aq `1125`/`1126` + ap `1098`/`1099`/`1111` alone               |
| `scripts/check-bundle-budgets.mjs`                                    | `1150` + `1151` — serialize; leave aq `1132` + ao `1088` alone                    |
| `scripts/check-dev-doc-links.mjs`                                     | `1152` only; leave folded `#1307`/`1095` alone                                    |
| `scripts/lib/read-reporter-json.mjs` (+ flake-rate callers if needed) | `1153` only                                                                       |
| `scripts/report-knip.mjs`                                             | `1154` + `1155` — serialize; leave folded `#1311`/`1106` alone                    |
| `scripts/lib/mutation-report-vitest-status.mjs`                       | `1156` only; leave an `1038` alone                                                |
| `scripts/check-copy-pins.mjs`                                         | `1157` + `1158` — serialize; leave aq `1134`/`1137` alone                         |
| `scripts/check-workflows.mjs` (timeout / concurrency edges)           | `1159` + `1160` — serialize after `1147`/`1148`; tip-owner skim                   |
| `scripts/engine-coverage-rank.mjs`                                    | `1161` only; leave aq `1133` + folded `#1302` alone                               |
| `docs/dev/backlog-2026-10-11aq.md` (stale note only if needed)        | none — do not edit aq                                                             |
| `docs/dev/check-copy-pins.md`                                         | leave aq `1137` alone; this refill fixes script banner/JSON instead               |

**Parallel-friendly:** `1147`, `1149`, `1150`, `1152`, `1153`, `1154`, `1156`, `1157`, `1161`, `1162`, `1163`. Serialize `1147`→`1148`; serialize `1150`→`1151`; serialize `1154`→`1155`; serialize `1157`→`1158`; serialize `1159`→`1160`.

## Live tip measurements (evidence snapshot @ `5e39694b`)

```text
$ git rev-parse HEAD
  5e39694b1fde0f01c3e13fdb8a8381727097035a

$ git branch --show-current
  cursor/mp-tip-poste740 (audited) / cursor/backlog-2026-10-11ar-21c9 (this PR)

$ find tests/unit \( -name '*.test.ts' -o -name '*.spec.ts' \) ! -path '*/_tokenmaxx_archive/*' | wc -l
  3402

$ npm run test:e2e:chromium -- --list
  Total: 249 tests in 25 files

$ npm run report:knip -- --json
  unusedExports: 3  unusedTypes: 29  unusedFiles: 0
  (NOTICE unusedTypes 36→29 shrink vs committed baseline 36 — baseline write NOT queued)

$ # Playwright cache key forms
  hashFiles('package-lock.json') → clean
  hashFiles("package-lock.json") → Playwright cache violation
  hashFiles('**/package-lock.json') → Playwright cache violation

$ parsePrecacheManifest
  {url:"/a.js",revision:"1"} → 1 entry
  {url:"/a.js",revision:"1",size:12} → []
  {url:"/a.js",revision:"1",integrity:null} → []  (owned by aq 1126)

$ parseMenuCriticalRefs
  <script src="/assets/x.js"> → [assets/x.js]
  <script src='/assets/x.js'> → []
  <script SRC="/assets/x.js"> → []
  <div data-src="/assets/x.js"> → [assets/x.js]  (owned by aq 1132)

$ stripMdLinkTitle
  path.md "title" → path.md  (folded 1095)
  path.md (title) → path.md (title)  (still broken)

$ readReporterJson("null") → { ok: true, data: null }
  flake-rate-e2e ingest then crashes on data.suites
$ readReporterJson("[]") → { ok: true, data: [] }

$ summarizeKnip(null) → throw Cannot read properties of null (reading 'files')
$ summarizeKnip({ issues: {} }) → zeros (folded 1106)

$ validateBaselineMetrics({ unusedFiles: -1, … }) → ok: true
$ validateBaselineMetrics({ unusedFiles: 0.5, … }) → ok: true

$ classifyVitestRunResult
  "No test files found" → error  (1038)
  "Found 0 test files" → killed
  "filter matched no files" → killed

$ check-copy-pins --fail (192 findings)
  prints "Report-only: exit 0" then exit 1
  --fail --json → reportOnly: true, findingCount: 192, exit 1

$ timeout-minutes: true → accepted (Number(true)===1)
$ concurrency: "group-name" → missing top-level concurrency group

$ resolveMetric({ pct: 150 }) → { pct: 150, … }  (owned by aq 1133)
$ formatCounts(0, 0) → "0/0" beside istanbul total===0 → 100%

$ offsetWidth A/B (unit-shared, --no-file-parallelism --maxWorkers=1)
  probe alone → PASS
  burn-wave40 then probe → FAIL — leave aq 1135

$ npm run check:dev-docs → problems: 4
  af + ap intentional no-such-game / titled path / missing checker-doc path
  (owned by aq 1136 / ap 1114 / ap 1109 — leave)

$ npm run check:workflows → OK — 2 file(s): ci.yml, deploy.yml

$ Open drafts into cursor/mp-tip-poste740 at audit: #1298–#1319 (several tip-folded; drafts still open)
$ Tip→alpha fold open: #1304 (q-mp-026x)
$ Concurrent aq branch docs/dev/backlog-2026-10-11aq.md: identical to tip (no delta)
```

Baselines also captured under `/opt/cursor/artifacts/q-mp-090ar-baselines.log` and `/opt/cursor/artifacts/q-mp-090ar-offset-ab.log`.

## New tasks

### q-mp-1147 · Scripts: `check-workflows` accept double-quoted `hashFiles("package-lock.json")` for Playwright cache

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-poste740`)
- **depends-on:** tip-owner skim lightly; serialize with `1148`; leave aq `1122`–`1124` alone
- **series:** script-tooling
- **verdict:** **SAFE** — false-fail on realistic GHA expression quoting; live `ci.yml` uses single quotes today
- **CI / package.json callers:** `package.json` → `check:workflows`; **not** in `ci.yml`
- **target files:** `scripts/check-workflows.mjs` (Playwright cache key check); unit fixtures in `tests/unit/workflow-contract.test.ts`
- **measured baseline:** key `${{ hashFiles('package-lock.json') }}` → clean; key `${{ hashFiles("package-lock.json") }}` → Playwright cache violation.
- **acceptance criteria:** Double-quoted `hashFiles("package-lock.json")` (optionally with `runner.os` prefix) satisfies the Playwright cache pin the same as single-quoted form; live workflows stay clean; keys without package-lock hash still fail.
- **verification commands:** `npm run check:workflows` ; `CI=1 npx vitest run tests/unit/workflow-contract.test.ts`
- **conflict notes:** not scalar `on:` (`1122`), job permissions (`1123`), cache-dependency-path array (`1124`), or YAML bools (`1097` / avoid list).
- **screen:** SAFE.

### q-mp-1148 · Scripts: `check-workflows` accept `hashFiles('**/package-lock.json')` Playwright cache keys

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-poste740`)
- **depends-on:** `1147` lightly (same check); leave aq workflow ids alone
- **series:** script-tooling
- **verdict:** **SAFE** — common Actions glob form still locks to the npm lockfile
- **CI / package.json callers:** `package.json` → `check:workflows`
- **target files:** `scripts/check-workflows.mjs`; unit fixtures
- **measured baseline:** `${{ hashFiles('**/package-lock.json') }}` → Playwright cache violation; exact `'package-lock.json'` → clean.
- **acceptance criteria:** `**/package-lock.json` (single- or double-quoted) counts as a lockfile-keyed Playwright cache; unrelated hashFiles targets still fail; live workflows green.
- **verification commands:** `npm run check:workflows` ; `CI=1 npx vitest run tests/unit/workflow-contract.test.ts`
- **conflict notes:** serialize after `1147`.
- **screen:** SAFE.

### q-mp-1149 · Scripts: `parsePrecacheManifest` ignore optional Workbox `size` field

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-poste740`)
- **depends-on:** serialize with aq `1126` if both open; leave ap `1098`/`1099` alone
- **series:** script-tooling
- **verdict:** **SAFE** — Workbox may emit `size` beside `url`/`revision`; dropping the entry is a false precache miss
- **CI / package.json callers:** `package.json` → `check:build` / `size:check` path via `scripts/check-build.mjs` helpers; unit tests
- **target files:** `scripts/check-build.mjs` (`parsePrecacheManifest`); unit fixtures
- **measured baseline:** `{url:"/a.js",revision:"1"}` → 1 entry; `{url:"/a.js",revision:"1",size:12}` → `[]`. Integrity trailing field still `[]` (owned by `1126`).
- **acceptance criteria:** Optional `size` (number or null) does not drop an otherwise valid precache object; integrity remains aq `1126`; tight url/revision path unchanged.
- **verification commands:** `CI=1 npx vitest run tests/unit/check-build-precache*.test.ts tests/unit/*precache*.test.ts` ; `npm run check:build` when `dist/` present (or unit-only if no dist)
- **conflict notes:** not spaced JSON keys (`1125`) or integrity (`1126`).
- **screen:** SAFE.

### q-mp-1150 · Scripts: `parseMenuCriticalRefs` accept single-quoted `src` / `href`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-poste740`)
- **depends-on:** serialize with `1151` and aq `1132`
- **series:** script-tooling
- **verdict:** **SAFE** — HTML allow single quotes; menu critical path undercounts otherwise
- **CI / package.json callers:** `package.json` → `size:check` (`scripts/check-bundle-budgets.mjs`)
- **target files:** `scripts/check-bundle-budgets.mjs` (`parseMenuCriticalRefs`); unit fixtures
- **measured baseline:** `<script src="/assets/x.js">` → `[assets/x.js]`; `<script src='/assets/x.js'>` → `[]`; `<link href='/assets/x.css'>` → `[]`.
- **acceptance criteria:** Single-quoted `/assets|vendor/….(js|css)` refs collected; double-quoted path unchanged; `data-src` false positives remain aq `1132`.
- **verification commands:** `CI=1 npx vitest run tests/unit/bundle-budget-check.test.ts`
- **conflict notes:** not word-boundary (`1132`); serialize before/with `1151`.
- **screen:** SAFE.

### q-mp-1151 · Scripts: `parseMenuCriticalRefs` accept case-insensitive `SRC` / `HREF`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-poste740`)
- **depends-on:** `1150` lightly; serialize with aq `1132`
- **series:** script-tooling
- **verdict:** **SAFE** — HTML attribute names are case-insensitive
- **CI / package.json callers:** `package.json` → `size:check`
- **target files:** `scripts/check-bundle-budgets.mjs` (`parseMenuCriticalRefs`); unit fixtures
- **measured baseline:** `<script SRC="/assets/x.js">` → `[]`; `<link HREF="/assets/x.css">` → `[]`.
- **acceptance criteria:** Uppercase / mixed-case `src`/`href` match; word-boundary still required so `data-src` stays aq `1132`.
- **verification commands:** `CI=1 npx vitest run tests/unit/bundle-budget-check.test.ts`
- **conflict notes:** serialize after `1150`.
- **screen:** SAFE.

### q-mp-1152 · Scripts: `stripMdLinkTitle` strip CommonMark parenthetical titles

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-poste740`)
- **depends-on:** leave folded `#1307` / `1095` alone
- **series:** script-tooling
- **verdict:** **SAFE** — CommonMark allows `link.md (title)`; unresolved path becomes a false broken-md-link
- **CI / package.json callers:** `package.json` → `check:dev-docs`
- **target files:** `scripts/check-dev-doc-links.mjs` (`stripMdLinkTitle`); unit fixtures
- **measured baseline:** `path.md "title"` → `path.md`; `path.md (title)` → `path.md (title)`.
- **acceptance criteria:** Space + `(…)` title suffix stripped like quoted titles; bare paths / fragments unchanged; live `check:dev-docs` does not regress (ap self-hits remain `1136`).
- **verification commands:** `npm run check:dev-docs` ; `CI=1 npx vitest run tests/unit/*dev-doc*.test.ts`
- **conflict notes:** not quoted-title work (`1095`).
- **screen:** SAFE.

### q-mp-1153 · Scripts: `readReporterJson` reject JSON `null` / non-object roots

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-poste740`)
- **depends-on:** none
- **series:** script-tooling
- **verdict:** **SAFE** — prevents flake-rate-e2e/unit ingest crashes / silent under-count on realistic bad artifacts
- **CI / package.json callers:** used by `scripts/flake-rate-e2e-loop.mjs` + `scripts/flake-rate-unit-loop.mjs` (not CI-gating)
- **target files:** `scripts/lib/read-reporter-json.mjs`; unit fixtures; optionally harden ingest call sites if still needed
- **measured baseline:** `null` → `{ ok: true, data: null }` then e2e ingest crashes on `data.suites`; `[]` → `{ ok: true, data: [] }`.
- **acceptance criteria:** JSON `null`, arrays, and non-object roots return `{ ok: false, error: … }`; object reports unchanged; flake loops record error instead of throwing.
- **verification commands:** `CI=1 npx vitest run tests/unit/*read-reporter*.test.ts tests/unit/*flake-rate*.test.ts`
- **conflict notes:** leave nested-suite walk (`1052`) alone.
- **screen:** SAFE.

### q-mp-1154 · Scripts: `summarizeKnip` must not throw on null / undefined knip root

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-poste740`)
- **depends-on:** leave folded `#1311` / `1106` alone; serialize with `1155`
- **series:** script-tooling
- **verdict:** **SAFE** — exported helper must be total; non-array `issues` already handled
- **CI / package.json callers:** `package.json` → `report:knip`
- **target files:** `scripts/report-knip.mjs` (`summarizeKnip`); unit fixtures
- **measured baseline:** `summarizeKnip({ issues: {} })` → zeros; `summarizeKnip(null)` → throws `Cannot read properties of null (reading 'files')`.
- **acceptance criteria:** `null` / `undefined` / non-object knip roots yield zero metrics (or structured empty) without throw; array / object `issues` paths unchanged.
- **verification commands:** `CI=1 npx vitest run tests/unit/*knip*.test.ts` ; `npm run report:knip`
- **conflict notes:** not non-array `issues` (`1106`).
- **screen:** SAFE.

### q-mp-1155 · Scripts: `validateBaselineMetrics` reject negative / non-integer counts

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-poste740`)
- **depends-on:** `1154` lightly; leave an `1036` incomplete/corrupt schema alone
- **series:** script-tooling
- **verdict:** **SAFE** — hand-edited baseline with `-1` / `0.5` must not pass schema
- **CI / package.json callers:** `package.json` → `report:knip`
- **target files:** `scripts/report-knip.mjs` (`validateBaselineMetrics`); unit fixtures
- **measured baseline:** complete metrics with `unusedFiles: -1` → `ok: true`; `unusedFiles: 0.5` → `ok: true`; missing keys still fail (`1036`).
- **acceptance criteria:** Each metric must be a finite **integer ≥ 0**; negatives / fractions → schema failure; live baseline still validates.
- **verification commands:** `CI=1 npx vitest run tests/unit/*knip*.test.ts` ; `npm run report:knip`
- **conflict notes:** serialize after `1154`; not incomplete-key work (`1036`).
- **screen:** SAFE.

### q-mp-1156 · Scripts: `classifyVitestRunResult` treat additional no-test phrases as `error`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-poste740`)
- **depends-on:** leave an `1038` (“No test files found”) alone
- **series:** script-tooling
- **verdict:** **SAFE** — filter-miss must not score as mutant kill
- **CI / package.json callers:** `scripts/mutation-report.mjs` via `scripts/lib/mutation-report-vitest-status.mjs` (report-only)
- **target files:** `scripts/lib/mutation-report-vitest-status.mjs`; unit fixtures
- **measured baseline:** `No test files found` → `error`; `Found 0 test files` → `killed`; `filter matched no files` → `killed`.
- **acceptance criteria:** Listed filter-miss phrases classify as `error` (not `killed`); real assertion failures stay `killed`; timeout path unchanged.
- **verification commands:** `CI=1 npx vitest run tests/unit/mutation-report-vitest-status.test.ts`
- **conflict notes:** extend `1038` patterns; do not change mutation scoring policy beyond filter-miss.
- **screen:** SAFE.

### q-mp-1157 · Scripts: `check-copy-pins` stop printing report-only exit 0 when `--fail` exits 1

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-poste740`)
- **depends-on:** serialize with `1158`; leave aq `1134`/`1137` alone
- **series:** script-tooling
- **verdict:** **SAFE** — banner / JSON disagree with live exit code
- **CI / package.json callers:** `package.json` → `check:copy-pins` (report-only in CI soft step)
- **target files:** `scripts/check-copy-pins.mjs` (human summary line + JSON `reportOnly` field)
- **measured baseline:** with findings, `--fail` prints `Report-only: exit 0` then exits **1**; `--fail --json` sets `reportOnly: true` with `findingCount: 192`.
- **acceptance criteria:** When `--fail` is set, summary/JSON must not claim report-only exit 0 / `reportOnly: true` if findings force exit 1; default (no `--fail`) unchanged.
- **verification commands:** `node scripts/check-copy-pins.mjs --fail >/tmp/out; echo $?` ; `node scripts/check-copy-pins.mjs --fail --json > /tmp/j.json; echo $?`
- **conflict notes:** not MATCHER_RE (`1134`) or docs/dev markdown (`1137`).
- **screen:** SAFE.

### q-mp-1158 · Docs: `scripts/check-copy-pins.mjs` header stop claiming always exit 0

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-poste740`)
- **depends-on:** `1157` lightly; leave aq `1137` (`docs/dev/check-copy-pins.md`) alone
- **series:** docs-accuracy
- **verdict:** **SAFE** — header contradicts `--fail` / unknown-flag exits
- **CI / package.json callers:** n/a (comment only)
- **target files:** `scripts/check-copy-pins.mjs` (file header near “always exit 0”)
- **measured baseline:** Header L10: `Default: scan tests/, print findings, always exit 0`. Live: default → 0; `--fail` + findings → **1**; `--wat` → **2**.
- **acceptance criteria:** Banner matches live exit semantics; no matcher/scan logic change.
- **verification commands:** `rg -n 'always exit 0|exit 2|--fail' scripts/check-copy-pins.mjs` ; `node scripts/check-copy-pins.mjs --wat; echo $?`
- **conflict notes:** distinct from `docs/dev/check-copy-pins.md` (`1137`).
- **screen:** SAFE.

### q-mp-1159 · Scripts: `check-workflows` reject boolean `timeout-minutes: true`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-poste740`)
- **depends-on:** tip-owner skim; serialize after `1147`/`1148`; leave an `1057` numeric-string alone
- **series:** script-tooling
- **verdict:** **HOLD-CHECK** — `Number(true) === 1` currently accepts a nonsensical timeout
- **CI / package.json callers:** `package.json` → `check:workflows`
- **target files:** `scripts/check-workflows.mjs` (timeout parse); unit fixtures
- **measured baseline:** `timeout-minutes: true` → no timeout violation; `timeout-minutes: 5` / `"5"` → clean; `0` / `"abc"` → missing positive timeout.
- **acceptance criteria:** Native booleans are rejected; positive finite numbers and numeric strings still pass; live workflows green.
- **verification commands:** `npm run check:workflows` ; `CI=1 npx vitest run tests/unit/workflow-contract.test.ts`
- **conflict notes:** not YAML yes/on bools for cancel/persist (`1097` — avoid list); not numeric-string accept (`1057`).
- **screen:** HOLD-CHECK — timeout coercion policy.

### q-mp-1160 · Scripts: `check-workflows` document or accept string-form `concurrency:`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-poste740`)
- **depends-on:** tip-owner skim (cancel-in-progress default); serialize after `1159`
- **series:** script-tooling
- **verdict:** **HOLD-CHECK** — GHA allows `concurrency: group-name` string shorthand; auditor requires mapping + `cancel-in-progress: true`
- **CI / package.json callers:** `package.json` → `check:workflows`
- **target files:** `scripts/check-workflows.mjs` and/or unit docs/fixtures clarifying intentional reject vs accept-with-implied-cancel
- **measured baseline:** `concurrency: "g"` → `missing top-level concurrency group`; mapping with `cancel-in-progress: true` → clean.
- **acceptance criteria:** Tip-owner chooses: (a) keep reject but make the error message explicit about string shorthand, or (b) accept string form only if cancel semantics match tip policy; live workflows green either way.
- **verification commands:** `npm run check:workflows` ; `CI=1 npx vitest run tests/unit/workflow-contract.test.ts`
- **conflict notes:** serialize after `1159`; not bool parsing (`1097`).
- **screen:** HOLD-CHECK — concurrency contract scope.

### q-mp-1161 · Scripts: `formatCounts` avoid `0/0` when pct derives from empty totals

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-poste740`)
- **depends-on:** leave aq `1133` pct clamp + folded `#1302`/`1083`/`1084` alone
- **series:** script-tooling
- **verdict:** **HOLD-CHECK** — `resolveMetric` documents `total===0 → 100` (istanbul); rank table still prints `0/0` beside 100%
- **CI / package.json callers:** `package.json` helpers / engine coverage rank script (report-only)
- **target files:** `scripts/engine-coverage-rank.mjs` (`formatCounts` / rank output); unit fixtures
- **measured baseline:** `resolveMetric({ covered: 0, total: 0 })` → `{ pct: 100, covered: 0, total: 0 }`; `formatCounts(0,0)` → `0/0`.
- **acceptance criteria:** Tip-owner-approved display for empty totals (e.g. `—` or `0/0` with pct `—`) without inventing coverage; pct-only clamp remains `1133`.
- **verification commands:** `CI=1 npx vitest run tests/unit/*engine-coverage-rank*.test.ts`
- **conflict notes:** not pct-only clamp (`1133`) or covered>total clamp (`1083`).
- **screen:** HOLD-CHECK — display vs istanbul 0/0 convention.

### q-mp-1162 · Docs: `scripts/check-dev-doc-links.mjs` header note unknown flags currently ignored

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-poste740`)
- **depends-on:** none; **do not** implement `--help`/unknown-flag argv (exhausted family)
- **series:** docs-accuracy
- **verdict:** **SAFE** — header claims “Always exits 0” without saying `--help`/`--wat` still run a full scan
- **CI / package.json callers:** n/a (comment only)
- **target files:** `scripts/check-dev-doc-links.mjs` (file header)
- **measured baseline:** `node scripts/check-dev-doc-links.mjs --help` runs full scan, exit 0; `--wat` same. Header: `Always exits 0 (report-only)`.
- **acceptance criteria:** Header states report-only scan always exit 0 and that CLI help/unknown-flag gating is out of scope / not implemented — **no** argv behavior change in this ticket.
- **verification commands:** `rg -n 'Always exits 0|--help|unknown' scripts/check-dev-doc-links.mjs` ; `node scripts/check-dev-doc-links.mjs --help >/tmp/o; echo $?`
- **conflict notes:** docs-only; argv implementation is prompt-skipped theater.
- **screen:** SAFE.

### q-mp-1163 · Docs: label intentional negative examples still failing `check:dev-docs` after tip folds

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-poste740`)
- **depends-on:** prefer aq `1136` for ap self-hits; this ticket only if `1136`/`1114` leave af/ap examples still noisy — **narrow to whatever remains after those land**
- **series:** docs-accuracy
- **verdict:** **SAFE** — report-only hygiene; do not invent missing files
- **CI / package.json callers:** `package.json` → `check:dev-docs`
- **target files:** whichever of `docs/dev/backlog-2026-10-10af.md` / `docs/dev/backlog-2026-10-11ap.md` still self-hit after `1136`/`1114` (re-measure before editing)
- **measured baseline @ `5e39694b`:** `check:dev-docs` problems **4** — af no-such-game; ap no-such-game; ap missing checker-doc path (same path cited in ap `1114`); ap titled path.md example. Owned primarily by `1114`/`1136` — **implement this id only for residual gaps those tickets do not cover**.
- **acceptance criteria:** Residual intentional examples are fenced/labeled so `check:dev-docs` is clean or documents skip; no product copy changes.
- **verification commands:** `npm run check:dev-docs`
- **conflict notes:** leave `1136`/`1114`/`1109` as primary owners; take only leftovers.
- **screen:** SAFE.

## Verdict summary

| Id          | Verdict        | Title (short)                                             |
| ----------- | -------------- | --------------------------------------------------------- |
| `q-mp-1147` | **SAFE**       | check-workflows: double-quoted hashFiles Playwright cache |
| `q-mp-1148` | **SAFE**       | check-workflows: `**/package-lock.json` hashFiles form    |
| `q-mp-1149` | **SAFE**       | parsePrecacheManifest: optional Workbox `size`            |
| `q-mp-1150` | **SAFE**       | parseMenuCriticalRefs: single-quoted src/href             |
| `q-mp-1151` | **SAFE**       | parseMenuCriticalRefs: case-insensitive SRC/HREF          |
| `q-mp-1152` | **SAFE**       | stripMdLinkTitle: parenthetical `(title)`                 |
| `q-mp-1153` | **SAFE**       | readReporterJson: reject null / non-object roots          |
| `q-mp-1154` | **SAFE**       | summarizeKnip: null root must not throw                   |
| `q-mp-1155` | **SAFE**       | validateBaselineMetrics: reject neg / non-integer         |
| `q-mp-1156` | **SAFE**       | classifyVitestRunResult: more no-test phrases → error     |
| `q-mp-1157` | **SAFE**       | check-copy-pins: --fail banner/JSON honesty               |
| `q-mp-1158` | **SAFE**       | check-copy-pins.mjs header exit semantics                 |
| `q-mp-1159` | **HOLD-CHECK** | check-workflows: reject timeout-minutes boolean true      |
| `q-mp-1160` | **HOLD-CHECK** | check-workflows: string-form concurrency policy           |
| `q-mp-1161` | **HOLD-CHECK** | engine-coverage-rank: formatCounts 0/0 display            |
| `q-mp-1162` | **SAFE**       | check-dev-doc-links header: argv not implemented          |
| `q-mp-1163` | **SAFE**       | docs: residual check:dev-docs negative-example hygiene    |

**Screened HOLD-CHECK (3):** `1159`, `1160`, `1161` — tip-owner should skim before fold (timeout coercion; concurrency string shorthand; istanbul 0/0 display).  
**No HOLD** product tickets queued (AI shard speedups / board-3d / rules / copy left out of scope).

## Out of scope / not used here

Already claimed / undrafted / HOLD / no headroom / prompt-skipped families: void/nnnull/nullish successors, eqeqeq product clear (`fiar/rules.ts` HOLD), lint-buckets eqeqeq probe, optional-chain product clears, knip demote / unusedTypes baseline drop, wiki **count** remasure, tip-name pointers (done on tip), UI coverage rounds, soft-fail characterizations, mutation-audit **waves**, board-3d **src** / **mp3d e2e** wait clears, harness shards, demo coverage, page-ready / double-rAF / artifact-dir / mountPair / npm aliases / `--help`/`--dry-run`/argv / empty-input / lib main-entry / cli-help spawn speedups (rounds 34–43), license-classifier siblings, pwa-manifest-contract tweaks, check-workflows bool parsing, deep-playtest `waitForTimeout`, overnight mountPair/router batches, round-31…43 tickets through `q-mp-1137`, CI `e2e-cross-browser` yaml named script (`800`), dismissOwl deep-playtest (`879`), stars-bars / nav-away mid-AI / memory-leak / runtime-perf / webkit-offline / probe-offline **wait** clears (prior HOLD/skip), emit-identity wave5 merge-base tip retarget (tip-owner HOLD-CHECK), Queens & Guards product, AI timing / Hex Hard 450ms / Stars & Bars history cap, AI determinism/quality shard wall-time cuts (HOLD), queens fuzz further wall trim (AI harness), dead-code Rank-2 yes deletes (live **0**), `cancelFabAiRequests` knip LEAVE (AI HOLD), visual-baseline PNG refresh (`1050`), canvas-dpr WebKit skip policy (`1051`), menu quote/query (`1088`), boundaries inline type (`1089`), permissions read-all (`1091`), owl flake (`1092`), ao/ap/aq visual triage + offsetWidth (`1093`/`1113`/`1135`), proprietary/source-available license policy (`1081`), YAML 1.1 yes/on (`1097`), precache trailing/spaced-bare/JSON/integrity (`1098`/`1099`/`1125`/`1126`), Affero/LGPL/EUPL/OSL/LICENCE/CPAL (`1127`–`1131`), Custom/CPL/EPL/CDDL (`1102`–`1105`), summarizeKnip non-array issues (`1106`), state-roundtrip speed (`1108`), engine pct clamp (`1133`), copy-pins matchers (`1134`), ap backlog self-hits (`1136`).

**Could not honestly fill to 25** without filler (more `--help`/`--dry-run`/argv/empty-input theater, cli-help spawn speedups, mountPair adoptions, npm aliases, tip-name pointer stamps, knip baseline remasure, Rank-3 demote theater, AI harness speed theater, license-classifier / pwa-manifest-contract / workflows-bool theater, wiki count cells, or HOLD board-3d/mp3d wait clears). Stopped at **17**.
