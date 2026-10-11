# Engineering backlog — 2026-10-11ao (tip refill after post1239 folds / round-41)

**Task id:** `q-mp-090ao`  
**Role:** worker (report-only)  
**Tip audited:** `cursor/mp-tip-post1239` @ `59abdacc` (full `59abdacc`; tip carries round-40 backlog `10an` via `#1275` fold, tip-folded round-39/40 implementers through `#1286`, and open tip drafts still listed below)  
**Depends on:** tip cut `cursor/mp-tip-post1239` @ `59abdacc`. Round-40 backlog (`q-mp-090an` / folded `#1275`, ids `q-mp-1052`…`1072`) — tip implementers `#1262`–`#1286` already cover several slices; remaining an gaps (`1052`/`1053`/`1054`/`1056`/`1057`/`1059`/`1060`/`1067`/`1070`/`1071` and any unworked siblings) — leave with `contained`. Round-39 am gaps and older tip stacks — leave with `contained`. Tip HEAD continues to move as tip-owner folds green drafts — **rebase onto latest tip before opening worker PRs**.

## Purpose

The tip `cursor/mp-tip-post1239` @ `59abdacc` measures unit files **3393**; Chromium e2e **25** files / **249** cases; knip unusedExports **3** (LEAVE) / unusedTypes **29** / unusedFiles **0**. Tip CI run `38110702200` is green on blocking jobs; report-only `visual-baseline` still records **42 failed** screenshot comparisons (job success via `continue-on-error`; artifact `visual-baseline-report` id `11690523760`). This doc lists **20 new** concrete engineering tasks (`q-mp-1077` … `q-mp-1096`) mined from the **live tip tree**, checked against prior refills through `q-mp-1072` and against the full open draft PR list (tip implementers `#1262`–`#1286`, post1218 leftovers, post1183 / older stacks). It is the **only** deliverable of `q-mp-090ao`.

**Honest count:** Only **20** tasks — not padded to 25. Id range starts at `q-mp-1077` per round-41 brief (`1008`–`1016` and `981`–`991` remain unused / reserved). Round-40 already claimed nested flake-e2e walk, emit-identity string/template normalize, short GPL classify, theme-color media-order (folded `#1282`), PWA display contradiction, workflows timeout string, precache revision-first+single-quotes (folded `#1277`), copy-pins `toHaveTextContent`, size:check `./assets`, cli-help / env-number speedups (folded `#1278`–`#1281`/`#1283`/`#1286`), dead-export demotes (folded `#1276`/`#1279`/`#1285`), nav-away 8-game omission, engine-property wall trim, backlog path hygiene (folded `#1284`) — **do not** re-queue `1052`–`1072` (leave open tip drafts + unworked an gaps with `contained`). This refill **does not** re-queue page-ready / double-rAF / artifact-dir / mountPair adoptions, npm aliases, `--help` / `--dry-run` / unknown-flag argv sweeps, empty-input / malformed-JSON guards as a family, lib main-entry guards, tip-name doc pointers, tip-stamp **count** remasures, knip unusedTypes baseline drop, Rank-3 demote theater, more cli-help spawn speedups, CI `e2e-cross-browser` named script (`800`), dismissOwl deep-playtest (`879`), deep-playtest / star-track / docs-playtest `waitForTimeout` families, stars-bars / nav-away **wait** clears (prior HOLD/skip), emit-identity wave5 merge-base tip retarget (tip-owner HOLD-CHECK — not queued), or anything in rounds ≤40.

**Fresh payoffs on this tip (re-measured after `#1282`–`#1286` folds):** **`check-workflows` ignores list-form `on: [pull_request]` / `[pull_request_target]` so secrets and forbidden-trigger checks never fire**, **quoted YAML bools `"true"`/`"false"` fail cancel/persist-credentials checks**, **`classifyLicense` treats `AGPLv3` / `LGPLv*` / `MPLv*` / Mozilla prose / SSPL·BUSL prose / long-form `GNU General Public License v3.0` as `ok` while SPDX forms deny/review**, **`UNLICENSED OR MIT` (and similar OR forms) short-circuit to `ok` while bare `UNLICENSED` is `unknown`**, **source-available / proprietary prose (`Elastic-2.0`, PolyForm, FSL, `LicenseRef-Proprietary`, `Commercial`) classify as `ok`**, **`validateIndexHtml` misses valid `apple-touch-icon` when `href` precedes `rel`**, **`engine-coverage-rank` emits `120%` when `covered>total` and shows `0/0` beside real pct-only rows**, **`report-coverage-map` pct-only markdown writes `150.00` / `-10.00` (counts path already clamps via `1039`)**, **`check-emit-identity --normalize` collapses whitespace inside regex literals**, **`parsePrecacheManifest` drops JSON-quoted `"url"`/`"revision"` keys (bare identifier path fixed by `1058`)**, **`parseMenuCriticalRefs` drops single-quoted and `?v=` / `#fragment` asset refs**, **`check-boundaries` treats `import { type X }` as a value edge**, **`check-perf` Lighthouse `Promise.race` timeout does not kill the LH child**, **`permissions: read-all` is reported as missing permissions object**, tip CI **visual-baseline still 42 failed** (triage in `docs/dev/q-mp-055-visual-baseline-triage.md` still accurate; REGRESSION suspects hex clip / sum-dominoes deal / ramrod phone), **`mutation-ui5-owl-component` drag→click flake failed on worker CI `38029684749`**, **`docs/build-repro-2026-10-08.md` still claims `check:build` always exit 0** (unknown flag → exit **2**), and **`check-dev-doc-links` keeps markdown link titles in the resolved path**.

**Visual-baseline diagnose (tip CI `38110702200`, job success / suite red):** Still **42 failed** (21 desktop + 21 phone). Matches `q-mp-055` triage: pre-restore PNGs vs restored UI. Highest-risk **REGRESSION (suspect)** from that triage — hex board clip, sum-dominoes opening deal/hand, ramrod phone — remain the eyeball-first set. Artifact: https://github.com/fuzzywigg/math-pentathlon/actions/runs/38110702200/artifacts/11690523760. **Any PNG refresh or product layout fix is HOLD-CHECK** and stays owned by round-39 `1050` (leave with `contained`); this refill’s `1093` is **diagnose-only** triage-doc refresh against post1239 evidence.

**Preference:** SAFE, mutually independent **scripts/** wrong-results fixes, **docs-only** accuracy, or **tests-only** flake hygiene. **Do not** queue another remasure of CI wall, bundle headroom, lint-bucket snapshot, copy-pins findings totals, boundaries/PWA thresholds, board-3d layout inventory, CI permissions, tip-pointer **count** stamps, open-draft triage, emit-identity inventory remasure, knip unusedTypes baseline drop, Rank-3 demote theater, dead-CSS Rank-1 rescan, wiki **count** cells, or more cli-help spawn speedups. Anything in rules / AI / scoring / legal-move paths, player-facing copy, tutorials product edits, timing, Stars & Bars history cap, Hex Hard 450ms, board-3d **src** / **mp3d e2e**, or CI permissions widening is **HOLD**. **Do not** change fake-clock semantics. **Do not** edit `*/rules.ts`.

**Lint policy for this refill:** **no** new ceiling-key clears.

## Duplicate check (do not re-queue)

| Topic family | Why skipped |
| --- | --- |
| round-40 / nested flake-e2e (`1052`) / emit string normalize (`1053`) / short GPL (`1054`) / theme-color (`1055` folded) / PWA display (`1056`) / timeout-minutes string (`1057`) / precache revision-first (`1058` folded) / copy-pins matchers (`1059`) / size `./assets` (`1060`) / cli-help+env speed (`1061`–`1064`/`1069` folded) / dead exports (`1065`–`1068` folded) / nav-away games (`1070`) / engine-property trim (`1071`) / backlog paths (`1072` folded) | open tip drafts + folded implementers; an gaps still need workers — leave with `contained`; **do not** re-queue `1052`–`1072` (this refill’s `1086`/`1087`/`1088`/`1079` are **only** regex-literal normalize / JSON precache keys / quote+query menu refs / legacy copyleft **beyond** short GPL — not siblings of those tickets) |
| round-39…32 / page-ready / double-rAF / artifact-dir / mountPair / npm aliases / `--help`/`--dry-run`/argv / lib main-entry / empty-input argv / cli-help spawn theater | prompt hard-skip + open drafts / tip folds — leave with `contained` |
| CI `e2e-cross-browser` named script (`800`) / dismissOwl deep-playtest (`879`) | tip-queued; unworked — **do not** re-queue |
| deep-playtest / star-track / docs-playtest waits | leave prior ids |
| visual-baseline PNG refresh / stabilize (`1050`) | leave with `contained`; this refill’s `1093` is diagnose-only |
| canvas-dpr WebKit skip (`1051`) | leave prior id |
| knip unusedExports LEAVE / unusedTypes baseline drop / Rank-3 demotes / dead-code Rank-2 yes (live **0**) / unusedFiles **0** | no SAFE deletes of knip product exports; remasure theater skipped |
| tip-name pointers | prompt hard-skip — live AGENTS already names `post1239` |
| emit-identity wave5 merge-base tip retarget | tip-owner HOLD-CHECK — not queued; this refill’s `1086` is **only** regex-literal WS |
| AI determinism / quality shard wall times | **HOLD** — AI harness; do not fake-clock or change search |
| AI-timing / Hex Hard 450ms / history-cap / rules.ts / copy / scoring / CI permissions / eqeqeq in `fiar/rules.ts` | hard-rule HOLD |

Also skipped: Merom / Sullivan / data-center / grants / nonprofit; `pappas-infrastructure`; meromhouse agents; any CI `permissions` widening. No `memory/` files.

## Stale queue re-check (live tip `59abdacc`)

| Id | Title (short) | Verdict | Evidence @ `59abdacc` |
| --- | --- | --- | --- |
| `q-mp-090an` / `#1275` | round-40 backlog | **folded into tip** | This refill starts at `1077`. |
| `#1262`–`#1286` | am/an implementers on tip post1239 | **open and/or tip-folded** | Leave with `contained`. |
| `q-mp-1052`/`1053`/`1054`/`1056`/`1057`/`1059`/`1060`/`1067`/`1070`/`1071` | an gaps still valid | **still-valid; need workers** | leave prior ids; do not sibling. |
| `q-mp-1050` | visual-baseline refresh/stabilize | **still-valid; no open PNG refresh PR** | Leave prior id; `1093` diagnose-only. |
| `q-mp-800` | CI cross-browser named script | **tip-queued; unworked** | Live `ci.yml` still bare `test:e2e -- --project=firefox --project=webkit` — **do not** re-queue. |
| `q-mp-879` | dismissOwl deep-playtest adopters | **still-valid; no open PR** | Leave prior id. |
| Dead-code Rank-2 yes | live dry-run | **0 yes** | No SAFE product delete ticket. |
| Tip CI `38110702200` | blocking green; visual 42 failed | **report-only drift** | Owned by `1050` for fix; diagnosed in purpose + `1093`. |

## Shared-file conflict flags

| Shared file | Conflicting new ids |
| --- | --- |
| `scripts/check-workflows.mjs` | `1077` + `1078` + `1091` — serialize; leave open `#1175`/`885` unknown-flag + an `1057` timeout-string alone |
| `scripts/report-licenses.mjs` (+ `.d.mts` if patterns change) | `1079` + `1080` + `1081` — serialize; leave open `#1271`/`1037` null-packages + an `1054` short GPL alone |
| `scripts/lib/pwa-manifest-contract.mjs` | `1082` only; leave folded `#1282`/`1055` theme-color + an `1056` display alone |
| `scripts/engine-coverage-rank.mjs` | `1083` + `1084` — serialize; leave folded `#1272`/`1033` contradictory pct alone |
| `scripts/report-coverage-map.mjs` | `1085` only; leave folded `#1273`/`1039` covered>total clamp alone |
| `scripts/check-emit-identity.mjs` | `1086` only; leave an `1053` string/template alone |
| `scripts/check-build.mjs` | `1087` only; leave folded `#1277`/`1058` revision-first alone |
| `scripts/check-bundle-budgets.mjs` | `1088` only; serialize with an `1060` `./assets` + soft-exit |
| `scripts/check-boundaries.mjs` | `1089` only |
| `scripts/check-perf.mjs` | `1090` only |
| `tests/unit/mutation-ui5-owl-component.test.ts` | `1092` only |
| `docs/dev/q-mp-055-visual-baseline-triage.md` | `1093` only; leave `1050` PNG refresh alone |
| `docs/build-repro-2026-10-08.md` | `1094` only |
| `scripts/check-dev-doc-links.mjs` | `1095` only; leave folded `#1284`/`1072` path hygiene alone |
| `tests/unit/burn-wave27-seat-handoff-core.test.ts` | `1096` only |

**Parallel-friendly:** `1082`, `1085`, `1086`, `1087`, `1089`, `1090`, `1092`, `1093`, `1094`, `1095`, `1096`. Serialize `1077`→`1078`→`1091`; serialize `1079`→`1080`→`1081`; serialize `1083`→`1084`; serialize `1088` lightly with an `1060`.

## Live tip measurements (evidence snapshot @ `59abdacc`)

```text
$ git rev-parse HEAD
  59abdacc (tip; worker branch rebases here)

$ git branch --show-current
  cursor/mp-tip-post1239 (audited) / cursor/backlog-2026-10-11ao-c24a (this PR)

$ find tests/unit \( -name '*.test.ts' -o -name '*.spec.ts' \) ! -path '*/_tokenmaxx_archive/*' | wc -l
  3393

$ npm run test:e2e:chromium -- --list
  Total: 249 tests in 25 files

$ npm run report:knip -- --json
  unusedExports: 3  unusedTypes: 29  unusedFiles: 0
  (NOTICE unusedTypes 36→29 shrink vs committed baseline 36 — baseline write NOT queued)

$ # check-workflows list-form on + secrets
  on: [pull_request] + secrets.NPM_TOKEN → hasPR=false, audit=[]
  on.pull_request mapping + same secrets → secrets violation

$ # quoted YAML bools
  cancel-in-progress: "true" → must be true
  persist-credentials: "false" → must set persist-credentials: false

$ classifyLicense
  AGPLv3=>ok  AGPL-3.0=>denied
  LGPLv2.1=>ok  LGPL-2.1=>copyleft_or_review
  GNU General Public License v3.0=>ok  GPL-3.0=>denied
  UNLICENSED=>unknown  UNLICENSED OR MIT=>ok
  Elastic-2.0=>ok  Server Side Public License=>ok  SSPL=>denied

$ validateIndexHtml apple-touch-icon href-before-rel
  rel-first → ok (with brand values)
  href-before-rel → missing apple-touch-icon /icons/icon-180.png
  (theme-color media-first fixed by folded 1055)

$ resolveMetric({covered:12,total:10,pct:80}) → {pct:120,…}
$ pct-only rank row → "88.50 0/0"

$ report-coverage-map pct-only markdown
  | `src/games/hex` | 150.00 | -10.00 | 1 |

$ emit-identity normalize regex
  /a  b/ vs /a b/ → equalRaw=false, equalAfterNormalize=true

$ parsePrecacheManifest
  {url:"/a.js",revision:"1"} → 1 entry
  {"url":"/a.js","revision":"1"} → []

$ parseMenuCriticalRefs
  src="/assets/a.js" → [assets/a.js]
  src='/assets/a.js' → []
  src="/assets/a.js?v=1" → []

$ check-boundaries inline type
  import { type Foo } from "./foo" → value:true, typeOnly:false
  import type { Foo } from "./foo" → typeOnly:true

$ Tip CI 38110702200 visual-baseline: 42 failed (report-only job success)
  artifact visual-baseline-report id 11690523760

$ Worker CI 38029684749 unit: mutation-ui5-owl-component
  "after drag, character click skip clears didDrag so next click animates"
  AssertionError: expected false to be true (owl-clicked)

$ docs/build-repro-2026-10-08.md L47: "always exit 0"
  node scripts/check-build.mjs --wat → Unknown flag; EXIT 2

$ Open drafts into cursor/mp-tip-post1239 at audit: #1262–#1286 (many tip-folded; leave with contained)
$ Tip→alpha fold open: #1265 (q-mp-026x)
```

Baselines also captured under `/opt/cursor/artifacts/q-mp-090ao-baselines.log` and `/opt/cursor/artifacts/q-mp-090ao-reprobe-tip.log`.

## New tasks

### q-mp-1077 · Scripts: `check-workflows` honor list-form `on: [pull_request]` / `[pull_request_target]`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1239`)
- **depends-on:** none (serialize with `1078`/`1091`; leave an `1057` timeout-string alone)
- **series:** script-tooling
- **verdict:** **SAFE** — security false-negative on valid GHA shorthand; not a timeout-string / unknown-flag ticket
- **CI / package.json callers:** `package.json` → `check:workflows`; **not** referenced in `.github/workflows/ci.yml` (local / contributor gate; workflow-contract unit tests)
- **target files:** `scripts/check-workflows.mjs` (`hasPullRequestTrigger` / forbidden-trigger walk); hermetic unit with list-form + quoted list fixtures
- **measured baseline:** `on: [pull_request]` + `secrets.NPM_TOKEN` → `hasPR=false`, audit `[]`. Mapping `on.pull_request` → secrets violation. `on: [pull_request_target]` similarly misses the forbidden-trigger check.
- **acceptance criteria:** Array / sequence `on` forms treated like mapping keys for PR + forbidden triggers; mapping form unchanged; live workflows stay clean.
- **verification commands:** `npm run check:workflows` ; `CI=1 npx vitest run tests/unit/check-workflows*.test.ts` (or new hermetic)
- **conflict notes:** distinct from `1057` (timeout-minutes string) and `#1175`/`885` (unknown flags).

### q-mp-1078 · Scripts: `check-workflows` accept quoted YAML bools for cancel / persist-credentials

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1239`)
- **depends-on:** `1077` lightly (same module)
- **series:** script-tooling
- **verdict:** **SAFE** — YAML coercion gap; js-yaml keeps `"true"`/`"false"` as strings
- **CI / package.json callers:** `package.json` → `check:workflows`; **not** in `ci.yml`
- **target files:** `scripts/check-workflows.mjs` (cancel-in-progress + persist-credentials checks); unit fixtures
- **measured baseline:** `cancel-in-progress: "true"` → `must be true`; `persist-credentials: "false"` → checkout violation; unquoted bools → clean.
- **acceptance criteria:** Truthy/falsey YAML bool **or** `"true"`/`"false"` (case-sensitive common spellings) accepted; non-bool strings still fail; live workflows stay clean.
- **verification commands:** `npm run check:workflows` ; `CI=1 npx vitest run tests/unit/check-workflows*.test.ts`
- **conflict notes:** serialize after `1077`; leave `1057` alone.

### q-mp-1079 · Scripts: `classifyLicense` deny/review legacy copyleft prose beyond short GPL

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1239`)
- **depends-on:** none (serialize with `1080`/`1081`; leave an `1054` short GPL + open `#1271`/`1037` alone)
- **series:** script-tooling
- **verdict:** **SAFE** — wrong SBOM class on realistic legacy npm license strings
- **CI / package.json callers:** `package.json` → `report:licenses`; **not** a blocking CI job
- **target files:** `scripts/report-licenses.mjs` (`DENIED_*` / `COPYLEFT_*` patterns); extend `tests/unit/report-licenses-helpers.test.ts`
- **measured baseline:** `AGPLv3`→`ok` (vs `AGPL-3.0` denied); `LGPLv2.1`/`LGPLv3`→`ok` (vs `LGPL-2.1` copyleft_or_review); `MPLv2` / `Mozilla Public License 2.0`→`ok` (vs `MPL-2.0` copyleft_or_review); `Server Side Public License` / `Business Source License 1.1`→`ok` (vs `SSPL`/`BUSL-1.1` denied); `GNU General Public License v3.0`/`v2.0`→`ok` (vs `GPL-3.0` denied). Short `GPLv2`/`GPLv3`/`GPL`/`GNU GPL` owned by `1054` — coordinate or land after.
- **acceptance criteria:** Listed legacy/prose forms classify into the same deny/copyleft bucket as their SPDX counterparts; MIT/Apache stay `ok`; no lockfile rewrite.
- **verification commands:** `CI=1 npx vitest run tests/unit/report-licenses*.test.ts` ; `node --input-type=module -e 'import { classifyLicense } from "./scripts/report-licenses.mjs"; …'`
- **conflict notes:** distinct from `1054` short GPL tokens and `#1271` null packages.

### q-mp-1080 · Scripts: `classifyLicense` must not treat `UNLICENSED OR MIT` (etc.) as `ok`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1239`)
- **depends-on:** `1079` lightly (same module)
- **series:** script-tooling
- **verdict:** **SAFE** — OR-expression unknown/proprietary tokens currently ignored when another token looks permissive
- **CI / package.json callers:** `package.json` → `report:licenses`
- **target files:** `scripts/report-licenses.mjs` (`UNKNOWN_LICENSE_PATTERNS` / classify order); helpers unit tests
- **measured baseline:** `UNLICENSED`→`unknown`; `UNLICENSED OR MIT` / `MIT OR UNLICENSED` / `PROPRIETARY OR MIT` / `NONE OR Apache-2.0` / `UNKNOWN OR MIT`→**`ok`**.
- **acceptance criteria:** Dual/OR licenses that include unknown/proprietary/none tokens do **not** classify as `ok` (unknown or copyleft_or_review per tip-owner-approved rule); pure `MIT` stays `ok`; bare `UNLICENSED` stays `unknown`.
- **verification commands:** `CI=1 npx vitest run tests/unit/report-licenses*.test.ts`
- **conflict notes:** serialize after `1079`; not proprietary-prose policy (`1081`).

### q-mp-1081 · Scripts: decide deny/review policy for source-available + proprietary prose

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1239`)
- **depends-on:** `1079`/`1080`; tip-owner skim
- **series:** script-tooling
- **verdict:** **HOLD-CHECK** — deny-list policy (not a parser crash)
- **CI / package.json callers:** `package.json` → `report:licenses`
- **target files:** `scripts/report-licenses.mjs` (+ short docs note if policy documented); helpers tests
- **measured baseline:** `Elastic-2.0` / `PolyForm-Shield-1.0.0` / `FSL-1.1-MIT` / `Parity-7.0.0` / `Prosperity-3.0.0` / `LicenseRef-Proprietary` / `Commercial` / `All Rights Reserved` → **`ok`** while `BUSL`/`SSPL` → denied.
- **acceptance criteria:** Tip-owner chooses deny vs copyleft_or_review vs documented leave-ok for each family; patterns + tests + one-line docs match; no silent `ok` for chosen deny set.
- **verification commands:** `CI=1 npx vitest run tests/unit/report-licenses*.test.ts`
- **conflict notes:** tip-owner skim (SBOM policy).
- **screen:** HOLD-CHECK — license deny-list product policy.

### q-mp-1082 · Scripts: `validateIndexHtml` accept `apple-touch-icon` when `href` precedes `rel`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1239`)
- **depends-on:** none (leave folded `#1282`/`1055` theme-color + an `1056` display alone)
- **series:** script-tooling
- **verdict:** **SAFE** — false negative on valid HTML attribute order
- **CI / package.json callers:** `package.json` → `check:pwa-manifest`; `.github/workflows/ci.yml` → `build` job → `npm run check:pwa-manifest` (report-only)
- **target files:** `scripts/lib/pwa-manifest-contract.mjs` (`validateIndexHtml` apple-touch-icon regex); unit cases
- **measured baseline:** Brand-correct tags with `rel` then `href` → ok; `href` before `rel` → `missing apple-touch-icon /icons/icon-180.png`. (theme-color media-first already fixed by folded `1055`.)
- **acceptance criteria:** Either attribute order with correct href passes; wrong href still fails; live `index.html` + PWA tests green.
- **verification commands:** `CI=1 npx vitest run tests/unit/*pwa-manifest*.test.ts` ; `npm run check:pwa-manifest` (with `dist/` present)
- **conflict notes:** not theme-color (`1055`) or display REQUIRED (`1056`).

### q-mp-1083 · Scripts: `engine-coverage-rank` clamp `covered > total` (no >100% rank)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1239`)
- **depends-on:** none (serialize with `1084`; leave folded `#1272`/`1033` alone)
- **series:** script-tooling
- **verdict:** **SAFE** — wrong rank display; coverage-map already clamps counts (`1039`)
- **CI / package.json callers:** `package.json` → `report:engine-coverage-rank`; **not** a blocking CI job
- **target files:** `scripts/engine-coverage-rank.mjs` (`resolveMetric`); helpers unit tests
- **measured baseline:** `resolveMetric({covered:12,total:10,pct:80})` → `{pct:120,covered:12,total:10}` after `1033` derive-from-counts.
- **acceptance criteria:** Display/rank pct clamped to ≤100 when covered>total (or covered clamped to total before derive); contradictory-pct preference from `1033` preserved; pct-only path left to `1084`.
- **verification commands:** `CI=1 npx vitest run tests/unit/*engine-coverage*.test.ts` ; `node --input-type=module -e 'import { resolveMetric } from "./scripts/engine-coverage-rank.mjs"; …'`
- **conflict notes:** distinct from `1033` (stale pct preference) and `1039` (coverage-map table).

### q-mp-1084 · Scripts: `engine-coverage-rank` pct-only rows must not invent `0/0` counts

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1239`)
- **depends-on:** `1083` lightly (same module)
- **series:** script-tooling
- **verdict:** **SAFE** — misleading rank table on realistic istanbul pct-only summaries
- **CI / package.json callers:** `package.json` → `report:engine-coverage-rank`
- **target files:** `scripts/engine-coverage-rank.mjs` (`resolveMetric` pct-only branch + formatter)
- **measured baseline:** Pct-only `{lines:{pct:88.5},branches:{pct:70},…}` → rank line `88.50 0/0 70.00 0/0`.
- **acceptance criteria:** Pct-only rows show unknown/blank counts (not `0/0`) while keeping numeric pct; count rows unchanged; no fake covered/total invented.
- **verification commands:** `CI=1 npx vitest run tests/unit/*engine-coverage*.test.ts`
- **conflict notes:** serialize after `1083`; not `1018` missing-pct reject.

### q-mp-1085 · Scripts: `report-coverage-map` clamp pct-only values to \[0, 100\]

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1239`)
- **depends-on:** none (leave folded `#1273`/`1039` covered>total alone)
- **series:** script-tooling
- **verdict:** **SAFE** — markdown table can show `150.00` / `-10.00` on pct-only rows; SVG heat already clamps
- **CI / package.json callers:** `package.json` → `report:coverage-map`; **not** a blocking CI job
- **target files:** `scripts/report-coverage-map.mjs` (`metricFromPct` / finalize / markdown render); unit cases
- **measured baseline:** Pct-only `lines.pct=150` / `branches.pct=-10` → markdown `| src/games/hex | 150.00 | -10.00 | 1 |`. Counts path already clamps via `1039`.
- **acceptance criteria:** Pct-only display pct ∈ \[0,100\]; counts path unchanged; SVG + markdown agree; `--dry-run` behavior unchanged.
- **verification commands:** `CI=1 npx vitest run tests/unit/*coverage-map*.test.ts`
- **conflict notes:** distinct from `1039` (covered>total) and `1017` (pct-only fake 100%).

### q-mp-1086 · Scripts: `check-emit-identity --normalize` must not collapse whitespace inside regex literals

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1239`)
- **depends-on:** none (leave an `1053` string/template alone)
- **series:** script-tooling
- **verdict:** **SAFE** — false emit-identity on valid TS with different regex bodies
- **CI / package.json callers:** `package.json` → `check:emit-identity`; **not** a blocking CI job
- **target files:** `scripts/check-emit-identity.mjs` (`stripCommentsAndCollapseWhitespace`); unit cases for `/a  b/` vs `/a b/`
- **measured baseline:** `equalRaw=false` but `equalAfterNormalize=true` for `const r=/a  b/g;` vs `const r=/a b/g;`. JSDoc claims collapse outside string/template; implementation is global `[ \t]+`.
- **acceptance criteria:** `--normalize` still collapses insignificant WS outside string/template/**regex** literals; different regex bodies remain `differ`; default byte compare unchanged; no AI product file edits.
- **verification commands:** `CI=1 npx vitest run tests/unit/check-emit-identity*.test.ts` ; `node --input-type=module -e 'import { stripCommentsAndCollapseWhitespace } from "./scripts/check-emit-identity.mjs"; …'`
- **conflict notes:** distinct from `1053` (string/template only).

### q-mp-1087 · Scripts: `parsePrecacheManifest` accept JSON-quoted `"url"` / `"revision"` keys

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1239`)
- **depends-on:** none (leave folded `#1277`/`1058` revision-first + single-quote values alone)
- **series:** script-tooling
- **verdict:** **SAFE** — silent undercount on serialized Workbox JSON manifests
- **CI / package.json callers:** `package.json` → `check:build`; **not** a blocking CI job
- **target files:** `scripts/check-build.mjs` (`parsePrecacheManifest`); expand helpers unit tests
- **measured baseline:** Bare `{url: "/a.js", revision: "1"}` → 1 entry (and revision-first after `1058`); `{"url":"/a.js","revision":"1"}` → **`[]`**.
- **acceptance criteria:** JSON-quoted keys parse; bare identifier path + `1058` behaviors preserved; null revision still supported.
- **verification commands:** `CI=1 npx vitest run tests/unit/check-build*.test.ts` ; `node --input-type=module -e 'import { parsePrecacheManifest } from "./scripts/check-build.mjs"; …'`
- **conflict notes:** distinct from `1058` (key order + value quote style).

### q-mp-1088 · Scripts: `parseMenuCriticalRefs` accept single-quoted + query/hash asset URLs

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1239`)
- **depends-on:** tip-owner skim; serialize with an `1060`
- **series:** script-tooling
- **verdict:** **HOLD-CHECK** — soft CI `size:check` / `check:perf` path accuracy; empty refs interact with catch→0
- **CI / package.json callers:** `package.json` → `size:check`; `.github/workflows/ci.yml` → `build` → `npm run size:check -- --fail-on-new-over` (`continue-on-error: true`); also used by `check:perf` locally
- **target files:** `scripts/check-bundle-budgets.mjs` (`parseMenuCriticalRefs`); optional `docs/bundle-budget.md` note
- **measured baseline:** `src="/assets/a.js"` → refs; `src='/assets/a.js'` → `[]`; `src="/assets/a.js?v=1"` → `[]`; hash fragment → `[]`. Relative `./assets` owned by `1060`.
- **acceptance criteria:** Single quotes + optional `?query` / `#hash` still yield the asset path; absolute + relative (`1060`) coexist; no budget number edits; soft-exit-on-no-refs left to `1060` unless tip-owner folds both.
- **verification commands:** `node --input-type=module -e 'import { parseMenuCriticalRefs } from "./scripts/check-bundle-budgets.mjs"; …'` ; `npm run size:check` (good dist)
- **conflict notes:** tip-owner review; serialize with `1060`.
- **screen:** HOLD-CHECK — soft size:check / check:perf menu-ref accuracy.

### q-mp-1089 · Scripts: `check-boundaries` treat `import { type X }` / `export { type X }` as type-only

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1239`)
- **depends-on:** tip-owner skim (SCC / ignoreTypeOnly semantics)
- **series:** script-tooling
- **verdict:** **HOLD-CHECK** — affects `verify` / CI lint `check:boundaries` graph; live tree mostly mixed imports today
- **CI / package.json callers:** `package.json` → `check:boundaries`; `package.json` → `verify`; `.github/workflows/ci.yml` → `lint` → `npm run verify`
- **target files:** `scripts/check-boundaries.mjs` (`collectImports` / `refineTypeOnly`); hermetic unit with pure inline-type fixtures
- **measured baseline:** Statement `import type { Foo }` → typeOnly; inline `import { type Foo }` → **value:true, typeOnly:false**. Live `src/` has many mixed `{ type X, valueY }` (correctly value) and **0** pure inline-type-only imports today — latent false value edges when pure form appears.
- **acceptance criteria:** Pure `import { type X }` / `export { type X }` count as type-only under `ignoreTypeOnly`; mixed value+type specifier stays value; live `npm run check:boundaries` stays green.
- **verification commands:** `npm run check:boundaries` ; `CI=1 npx vitest run tests/unit/*boundaries*.test.ts` (or new hermetic)
- **conflict notes:** tip-owner skim (boundary graph).
- **screen:** HOLD-CHECK — CI verify boundary semantics.

### q-mp-1090 · Scripts: `check-perf` kill Lighthouse child on `PERF_LH_TIMEOUT_MS` race

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1239`)
- **depends-on:** none
- **series:** script-tooling
- **verdict:** **SAFE** — orphan `npx lighthouse` / Chrome after timeout; preview kill already exists in `finally`
- **CI / package.json callers:** `package.json` → `check:perf`; **not** a blocking CI job
- **target files:** `scripts/check-perf.mjs` (`runLighthouse` / `runCmd`); unit or documented manual probe
- **measured baseline:** `Promise.race([runCmd(args), timeout→{stderr:'lighthouse timeout'}])` does not retain/kill the spawned child; only `previewProc` is killed in `finally`.
- **acceptance criteria:** On timeout, LH/Chrome child is signaled (SIGTERM then SIGKILL if needed); successful LH path unchanged; missing `dist/` usage-error path unchanged.
- **verification commands:** `rg -n 'Promise.race|kill|LH_TIMEOUT' scripts/check-perf.mjs` ; optional `PERF_LH_TIMEOUT_MS=1` smoke after build (no new `--help` theater)
- **conflict notes:** not missing-dist exit (`875`) / broken-menu (`997`).

### q-mp-1091 · Scripts: resolve `permissions: read-all` vs “missing permissions object”

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1239`)
- **depends-on:** `1077`/`1078`; tip-owner skim
- **series:** script-tooling
- **verdict:** **HOLD-CHECK** — valid GHA shorthand vs repo least-privilege (`contents: read`) pin
- **CI / package.json callers:** `package.json` → `check:workflows`; **not** in `ci.yml`
- **target files:** `scripts/check-workflows.mjs` (permissions object check); docs/unit clarifying intent
- **measured baseline:** `permissions: read-all` → `missing top-level permissions: (default contents: read required)` because checker requires an object.
- **acceptance criteria:** Either (a) accept `read-all`/`write-all` as present permissions **and** still enforce least-privilege separately, or (b) keep reject but emit a precise message (“shorthand not allowed; use contents: read”); live workflows unchanged.
- **verification commands:** `npm run check:workflows` ; unit fixture for `read-all`
- **conflict notes:** tip-owner skim; do **not** widen CI `permissions:` in `.github/workflows/ci.yml`.
- **screen:** HOLD-CHECK — workflow permissions policy.

### q-mp-1092 · Tests: stabilize `mutation-ui5-owl-component` drag→click flake

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 test-hygiene
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1239`)
- **depends-on:** tip-owner skim (owl UI timing; tests-only)
- **series:** flake-hygiene
- **verdict:** **HOLD-CHECK** — flake in owl-component unit; do not change player-facing copy / product drag thresholds without skim
- **CI / package.json callers:** `npm run test:unit` / CI `unit` job
- **target files:** `tests/unit/mutation-ui5-owl-component.test.ts` (and helpers only if needed)
- **measured baseline:** Worker CI run `38029684749` (mutation-audit UI wave 13): FAIL `after drag, character click skip clears didDrag so next click animates` — `expected false to be true` at `owl-clicked` assert (~L164). Locally usually green (~25–600ms).
- **acceptance criteria:** Test is deterministic under `CI=1` (fake timers / explicit flush); no product `owl-component.ts` behavior change unless tip-owner approves a real bugfix; suite green locally + documents the race.
- **verification commands:** `CI=1 npx vitest run tests/unit/mutation-ui5-owl-component.test.ts` (repeat ≥3)
- **conflict notes:** not canvas-dpr WebKit (`1051`); not owl product copy.
- **screen:** HOLD-CHECK — owl UI flake / possible product timing.

### q-mp-1093 · Docs: refresh visual-baseline triage against tip post1239 CI (diagnose only)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 docs-accuracy
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1239`)
- **depends-on:** tip-owner / Andrew for any later PNG refresh (`1050`)
- **series:** visual-diagnose
- **verdict:** **HOLD-CHECK** — diagnose-only; **do not** run `test:e2e:visual:update` or edit baselines/product UI in this ticket
- **CI / package.json callers:** `package.json` → `test:e2e:visual`; `.github/workflows/ci.yml` → report-only job `visual-baseline` (`continue-on-error`)
- **target files:** `docs/dev/q-mp-055-visual-baseline-triage.md` (add tip post1239 evidence block: run `38110702200`, artifact `11690523760`, confirm still **42 failed**)
- **measured baseline:** Tip CI `38110702200` visual-baseline: **42 failed** (full desktop+phone openings); job conclusion success; warning “visual-baseline diffs detected”. Prior triage (`q-mp-055`) classification (EXPECTED restore / REGRESSION suspects hex, sum-dominoes, ramrod phone) still matches failure set.
- **acceptance criteria:** Triage doc cites current tip CI run + artifact; restates REGRESSION-first eyeball order; explicitly defers PNG refresh/stabilize to `1050`; **no** snapshot update, **no** `src/` edits.
- **verification commands:** `rg -n '38110702200|42 failed|1050' docs/dev/q-mp-055-visual-baseline-triage.md` ; do **not** require local visual suite for this docs ticket
- **conflict notes:** leave `1050` as the fix owner.
- **screen:** HOLD-CHECK — visual baseline ownership (diagnose only).

### q-mp-1094 · Docs: `docs/build-repro-2026-10-08.md` stop claiming `check:build` always exit 0

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs-accuracy
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1239`)
- **depends-on:** none (leave ak `999` SKIP-missing build exit semantics alone)
- **series:** docs-accuracy
- **verdict:** **SAFE** — docs-only wording
- **CI / package.json callers:** n/a (docs); script is `package.json` → `check:build` (local)
- **target files:** `docs/build-repro-2026-10-08.md` (cheat line near “always exit 0”)
- **measured baseline:** L47 still says `npm run check:build … always exit 0`. Live `node scripts/check-build.mjs --wat` → Unknown flag, exit **2**.
- **acceptance criteria:** Doc matches live exit semantics (usage/unknown → non-zero; successful report-only path as implemented); no tip-name / count-cell edits; no `999` SKIP-missing behavior change in this ticket.
- **verification commands:** `rg -n 'check:build|always exit 0|exit 2' docs/build-repro-2026-10-08.md scripts/check-build.mjs` ; `node scripts/check-build.mjs --wat ; echo $?`
- **conflict notes:** not knip/PWA/`npx tsc` doc tickets.

### q-mp-1095 · Scripts: `check-dev-doc-links` strip markdown link titles before resolve

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1239`)
- **depends-on:** none (leave folded `#1284`/`1072` renamed-path hygiene alone)
- **series:** script-tooling
- **verdict:** **SAFE** — latent false broken-md-link for a titled markdown href (`path.md` plus optional `"title"` / `'title'`); **0** titled links in live docs today
- **CI / package.json callers:** `package.json` → `check:dev-docs`; **not** a blocking CI job
- **target files:** `scripts/check-dev-doc-links.mjs` (`resolveMdLink`); hermetic unit / `--self-test` if present
- **measured baseline:** `resolveMdLink` uses `href.split('#')[0].split('?')[0]` only — `"../dev/foo.md \"title\""` remains in the path segment → false missing file when titles appear.
- **acceptance criteria:** Optional `"title"` / `'title'` after the path is stripped; hash/query still handled; live `npm run check:dev-docs` does not regress; no backlog path inventing.
- **verification commands:** `npm run check:dev-docs` ; hermetic unit for titled href
- **conflict notes:** not `1072` renamed backlog paths.

### q-mp-1096 · Tests: profile/trim `burn-wave27-seat-handoff-core` wall (~2s)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 test-hygiene
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1239`)
- **depends-on:** none
- **series:** test-speed
- **verdict:** **SAFE** — wall-time only; not AI / cli-help / engine-property / state-roundtrip families
- **CI / package.json callers:** `npm run test:unit` / CI `unit`
- **target files:** `tests/unit/burn-wave27-seat-handoff-core.test.ts`
- **measured baseline:** Local `CI=1 npx vitest run tests/unit/burn-wave27-seat-handoff-core.test.ts` → **Duration ~2.01s** (20 tests; transform+import dominate ~1.1s of wall).
- **acceptance criteria:** Keep coverage; Duration **<1.2s** locally under `CI=1` (or ≥1.5× faster) via leaner mounts / shared setup — **no** product seat-handoff behavior change; no fake-clock of AI timing.
- **verification commands:** `CI=1 npx vitest run tests/unit/burn-wave27-seat-handoff-core.test.ts`
- **conflict notes:** not AI shard speedups; not cli-help theater.

## Verdict summary

| Id | Verdict | Title (short) |
| --- | --- | --- |
| `q-mp-1077` | **SAFE** | check-workflows: list-form `on: [pull_request]` |
| `q-mp-1078` | **SAFE** | check-workflows: quoted YAML bools |
| `q-mp-1079` | **SAFE** | classifyLicense: legacy copyleft prose beyond short GPL |
| `q-mp-1080` | **SAFE** | classifyLicense: `UNLICENSED OR MIT` short-circuit |
| `q-mp-1081` | **HOLD-CHECK** | license policy: source-available + proprietary prose |
| `q-mp-1082` | **SAFE** | validateIndexHtml: apple-touch-icon href-before-rel |
| `q-mp-1083` | **SAFE** | engine-coverage-rank: clamp covered>total |
| `q-mp-1084` | **SAFE** | engine-coverage-rank: pct-only not `0/0` |
| `q-mp-1085` | **SAFE** | coverage-map: clamp pct-only to \[0,100\] |
| `q-mp-1086` | **SAFE** | emit-identity `--normalize`: regex-literal-safe |
| `q-mp-1087` | **SAFE** | parsePrecacheManifest: JSON-quoted keys |
| `q-mp-1088` | **HOLD-CHECK** | parseMenuCriticalRefs: quotes + query/hash |
| `q-mp-1089` | **HOLD-CHECK** | check-boundaries: inline `type` modifiers |
| `q-mp-1090` | **SAFE** | check-perf: kill LH child on timeout |
| `q-mp-1091` | **HOLD-CHECK** | check-workflows: `permissions: read-all` |
| `q-mp-1092` | **HOLD-CHECK** | mutation-ui5-owl-component drag flake |
| `q-mp-1093` | **HOLD-CHECK** | visual-baseline triage refresh (diagnose only) |
| `q-mp-1094` | **SAFE** | build-repro docs: check:build exit wording |
| `q-mp-1095` | **SAFE** | check-dev-doc-links: strip md link titles |
| `q-mp-1096` | **SAFE** | speed burn-wave27-seat-handoff-core |

**Screened HOLD-CHECK (6):** `1081`, `1088`, `1089`, `1091`, `1092`, `1093` — tip-owner should skim before fold (license policy; soft size:check refs; boundary graph; permissions shorthand; owl flake; visual diagnose).  
**No HOLD** product tickets queued (AI shard speedups / board-3d / rules / copy left out of scope).

## Out of scope / not used here

Already claimed / undrafted / HOLD / no headroom / prompt-skipped families: void/nnnull/nullish successors, eqeqeq product clear (`fiar/rules.ts` HOLD), lint-buckets eqeqeq probe, optional-chain product clears, knip demote / unusedTypes baseline drop, wiki **count** remasure, tip-name pointers, UI coverage rounds, soft-fail characterizations, mutation-audit **waves**, board-3d **src** / **mp3d e2e** wait clears, harness shards, demo coverage, page-ready / double-rAF / artifact-dir / mountPair / npm aliases / `--help`/`--dry-run`/argv / empty-input / lib main-entry / cli-help spawn speedups (rounds 34–40), deep-playtest `waitForTimeout`, overnight mountPair/router batches, round-31…40 tickets through `q-mp-1072`, CI `e2e-cross-browser` yaml named script (`800`), dismissOwl deep-playtest (`879`), stars-bars / nav-away mid-AI / memory-leak / runtime-perf / webkit-offline / probe-offline **wait** clears (prior HOLD/skip), emit-identity wave5 merge-base tip retarget (tip-owner HOLD-CHECK), Queens & Guards product, AI timing / Hex Hard 450ms / Stars & Bars history cap, AI determinism/quality shard wall-time cuts (HOLD), dead-code Rank-2 yes deletes (live **0**), `cancelFabAiRequests` knip LEAVE (AI HOLD), visual-baseline PNG refresh (`1050`), canvas-dpr WebKit skip policy (`1051`), short GPL classify (`1054`), theme-color media-order (`1055` folded), precache revision-first (`1058` folded).

**Could not honestly fill to 25** without filler (more `--help`/`--dry-run`/argv/empty-input theater, cli-help spawn speedups, mountPair adoptions, npm aliases, tip-name pointer stamps, knip baseline remasure, Rank-3 demote theater, AI harness speed theater, or HOLD board-3d/mp3d wait clears). Stopped at **20**.
