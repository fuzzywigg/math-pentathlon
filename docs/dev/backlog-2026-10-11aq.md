# Engineering backlog — 2026-10-11aq (tip refill after poste740 folds / round-43)

**Task id:** `q-mp-090aq`  
**Role:** worker (report-only)  
**Tip audited:** `cursor/mp-tip-poste740` @ `9aba0ac3` (full `9aba0ac33f1d57e43b7483c9aa4a962b16d055ab`; tip cut from `alpha` @ `e740d0b6` after `#1288`; tip-owner fold `#1304` carries living tip pointers + round-41 implementers; tip HEAD also folded round-42 backlog `#1310` / `q-mp-090ap`)  
**Depends on:** tip `cursor/mp-tip-poste740` @ `9aba0ac3`. Round-42 backlog (`q-mp-090ap` / folded `#1310`, ids `q-mp-1097`…`1114`) — tip open implementer `#1311` (`1106`); remaining ap gaps (`1097`–`1105`/`1107`–`1114`) and ao HOLD-CHECK gaps (`1081`/`1088`/`1089`/`1091`/`1092`/`1093`) — leave with `contained`. Round-41/40 leftovers on older tip bases — leave with `contained`. Tip HEAD continues to move as tip-owner folds green drafts — **rebase onto latest tip before opening worker PRs**.

## Purpose

The tip `cursor/mp-tip-poste740` @ `9aba0ac3` measures unit files **3399**; Chromium e2e **25** files / **249** cases; knip unusedExports **3** (LEAVE) / unusedTypes **29** / unusedFiles **0**. Alpha CI run `38114521587` (post-`#1288`) is green on blocking jobs; report-only `visual-baseline` still records **42 failed** screenshot comparisons (job success via `continue-on-error`; owned by prior `1050`/`1113` — leave with `contained`). This doc lists **16 new** concrete engineering tasks (`q-mp-1122` … `q-mp-1137`) mined from the **live tip tree after `#1298`–`#1310` folds**, checked against prior refills through `q-mp-1114` and against the full open draft PR list (poste740 `#1298`–`#1311`, post01f5 leftovers, post1239 / older stacks). It is the **only** deliverable of `q-mp-090aq`.

**Honest count:** Only **16** tasks — not padded to 25. Id range starts at `q-mp-1122` per round-43 brief (`1115`–`1121` remain unused / reserved; `1073`–`1076`, `1008`–`1016`, `981`–`991` remain unused / reserved). Round-42 already claimed workflows YAML 1.1 yes/on, precache trailing/spaced-bare, apple-mobile content-before-name, theme hex case, license Custom/CPL/EPL/CDDL(+MS-RL), summarizeKnip non-array issues, render-perf demotes, state-roundtrip speed, ao titled-link cleanup, emit-identity export surface, check-build banner, engine-property sibling, visual triage stamp, af no-such-game label — **do not** re-queue `1097`–`1114` (leave open tip draft `#1311` + unworked ap gaps with `contained`). This refill **does not** re-queue page-ready / double-rAF / artifact-dir / mountPair adoptions, npm aliases, `--help` / `--dry-run` / unknown-flag argv sweeps, empty-input / malformed-JSON guards as a family, lib main-entry guards, tip-name doc pointers, tip-stamp **count** remasures, knip unusedTypes baseline drop, Rank-3 demote theater, more cli-help spawn speedups, AI harness speed theater, CI `e2e-cross-browser` named script (`800`), dismissOwl deep-playtest (`879`), deep-playtest / star-track / docs-playtest `waitForTimeout` families, stars-bars / nav-away **wait** clears (prior HOLD/skip), emit-identity wave5 merge-base tip retarget (tip-owner HOLD-CHECK — not queued), or anything in rounds ≤42.

**Fresh payoffs on this tip (re-measured @ `9aba0ac3` after `#1298`–`#1310` folds):** **`check-workflows` still treats scalar / quoted-string `on: pull_request` / `on: pull_request_target` as non-triggers so secrets + forbidden-trigger checks never fire** (list-form fixed by folded `1077`), **job-level `permissions: { contents: write }` is ignored while only top-level `doc.permissions` is audited**, **YAML-array `cache-dependency-path: [package-lock.json]` false-fails setup-node pin**, **`parsePrecacheManifest` drops spaced JSON-quoted keys and Workbox `integrity` fields** (tight JSON keys / bare trailing-comma / spaced-bare still owned by folded/`1098`/`1099`), **`classifyLicense` treats Affero / LGPL / EUPL / OSL long prose and British `SEE LICENCE IN …` / CPAL prose as `ok` while SPDX siblings deny/review/unknown**, **`parseMenuCriticalRefs` matches `data-src` / `ng-src` / `xsrc` as real `src` (no attribute word boundary)**, **`engine-coverage-rank` pct-only path still emits `150%` / `-5%` (counts path + coverage-map already clamped)**, **`check-copy-pins` MATCHER_RE still misses `toBeInTheDocument` / `toHaveAttribute` / `toHaveValue` / `toHaveAccessibleDescription`**, **`HTMLElement.prototype.offsetWidth|Height` stubs leak across `unit-shared` isolate:false files** (proven A/B: burn-wave40 → probe FAIL), **`check:dev-docs` reports 5 problems including three self-hits in `backlog-2026-10-11ap.md`**, and **`docs/dev/check-copy-pins.md` still claims tip scan always exit 0 while `--fail` / unknown flags differ**.

**Preference:** SAFE, mutually independent **scripts/** wrong-results fixes, **docs-only** accuracy, or **tests-only** flake hygiene. **Do not** queue another remasure of CI wall, bundle headroom, lint-bucket snapshot, copy-pins findings totals, boundaries/PWA thresholds, board-3d layout inventory, CI permissions, tip-pointer **count** stamps, open-draft triage, emit-identity inventory remasure, knip unusedTypes baseline drop, Rank-3 demote theater, dead-CSS Rank-1 rescan, wiki **count** cells, or more cli-help spawn speedups. Anything in rules / AI / scoring / legal-move paths, player-facing copy, tutorials product edits, timing, Stars & Bars history cap, Hex Hard 450ms, board-3d **src** / **mp3d e2e**, or CI permissions widening is **HOLD**. **Do not** change fake-clock semantics. **Do not** edit `*/rules.ts`.

**Lint policy for this refill:** **no** new ceiling-key clears.

## Duplicate check (do not re-queue)

| Topic family | Why skipped |
| --- | --- |
| round-42 / yes-on cancel+persist (`1097`) / precache trailing+spaced-bare (`1098`/`1099`) / apple content-before-name (`1100`) / theme hex (`1101`) / Custom·CPL·EPL·CDDL (`1102`–`1105`) / summarizeKnip (`1106` open `#1311`) / render-perf demote (`1107`) / state-roundtrip (`1108`) / ao path.md (`1109`) / emit exports (`1110`) / check-build banner (`1111`) / engine-property sibling (`1112`) / visual triage (`1113`) / af no-such-game (`1114`) | tip-folded `#1310` + open `#1311` + unworked ap gaps — leave with `contained`; **do not** re-queue `1097`–`1114` (this refill’s `1122`/`1125`/`1126`/`1127`… are **only** scalar `on:` / spaced **JSON-quoted** keys / integrity / Affero·LGPL·EUPL·OSL·LICENCE·CPAL prose — not siblings of list-form `on`, bare spaced keys, or Custom/CPL/EPL) |
| round-41…32 / page-ready / double-rAF / artifact-dir / mountPair / npm aliases / `--help`/`--dry-run`/argv / lib main-entry / empty-input argv / cli-help spawn theater | prompt hard-skip + open drafts / tip folds — leave with `contained` |
| CI `e2e-cross-browser` named script (`800`) / dismissOwl deep-playtest (`879`) | tip-queued; unworked — **do not** re-queue |
| deep-playtest / star-track / docs-playtest waits | leave prior ids |
| visual-baseline PNG refresh (`1050`) / diagnose (`1093`/`1113`) | leave with `contained` |
| nested flake-e2e (`1052`) / emit string/regex normalize (`1053`/`1086`) / menu quote+query (`1088`) / boundaries inline type (`1089`) / permissions read-all (`1091`) / owl flake (`1092`) / `./assets` size (`1060`) / proprietary license (`1081`) | leave prior ids / open drafts |
| knip unusedExports LEAVE / unusedTypes baseline drop / Rank-3 demotes / dead-code Rank-2 yes (live **0**) / unusedFiles **0** | no SAFE deletes of knip product exports; remasure theater skipped |
| tip-name pointers | already on tip (`AGENTS.md` / wiki → `poste740`) via `#1304` bootstrap |
| emit-identity wave5 merge-base tip retarget | tip-owner HOLD-CHECK — not queued |
| AI determinism / quality shard wall times | **HOLD** — AI harness; do not fake-clock or change search |
| AI-timing / Hex Hard 450ms / history-cap / rules.ts / copy / scoring / CI permissions / eqeqeq in `fiar/rules.ts` | hard-rule HOLD |
| wiki / testing-layers **count** remasure | prompt hard-skip tip-stamp theater |

Also skipped: Merom / Sullivan / data-center / grants / nonprofit; `pappas-infrastructure`; meromhouse agents; any CI `permissions` widening. No `memory/` files.

## Stale queue re-check (live tip `9aba0ac3`)

| Id | Title (short) | Verdict | Evidence @ `9aba0ac3` |
| --- | --- | --- | --- |
| `q-mp-090ap` / `#1310` | round-42 backlog | **tip-folded** | This refill starts at `1122`. |
| `#1298`–`#1309` | ao SAFE implementers | **tip-folded** | Leave with `contained`. |
| `#1311` / `q-mp-1106` | summarizeKnip non-array | **open on tip** | Leave with `contained`; do not sibling. |
| `q-mp-1097`…`1105`/`1107`…`1114` | ap gaps still valid | **still-valid; need workers** | leave prior ids; do not sibling. |
| `q-mp-1081`/`1088`/`1089`/`1091`/`1092`/`1093` | ao HOLD-CHECK gaps | **still-valid** | leave prior ids. |
| `q-mp-1050` | visual-baseline refresh/stabilize | **still-valid; no open PNG refresh PR** | Leave prior id; `1113` diagnose-only. |
| `q-mp-800` | CI cross-browser named script | **tip-queued; unworked** | Live `ci.yml` still bare `test:e2e -- --project=firefox --project=webkit` — **do not** re-queue. |
| `q-mp-879` | dismissOwl deep-playtest adopters | **still-valid; no open PR** | Leave prior id. |
| Dead-code Rank-2 yes | live dry-run | **0 yes** (prior) | No SAFE product delete ticket; script export demotes already queued (`1107`/`1110`). |
| Alpha CI `38114521587` | blocking green; visual 42 failed | **report-only drift** | Owned by `1050` for fix; diagnosed in prior `1113`. |

## Shared-file conflict flags

| Shared file | Conflicting new ids |
| --- | --- |
| `scripts/check-workflows.mjs` | `1122` + `1123` + `1124` — serialize; leave ap `1097` yes/on + ao `1091` read-all + folded `#1298` alone |
| `scripts/check-build.mjs` | `1125` + `1126` — serialize; leave ap `1098`/`1099`/`1111` alone |
| `scripts/report-licenses.mjs` (+ `.d.mts` if patterns change) | `1127` + `1128` + `1129` + `1130` + `1131` — serialize; leave ap `1102`–`1105` + ao `1081` alone |
| `scripts/check-bundle-budgets.mjs` | `1132` only; leave ao `1088` quote/query + an `1060` `./assets` alone |
| `scripts/engine-coverage-rank.mjs` | `1133` only; leave folded `#1302`/`1083`/`1084` alone |
| `scripts/check-copy-pins.mjs` | `1134` only; leave an `1059` toHaveTextContent alone |
| `tests/unit/burn-wave40-tutorial-tap-cue-side.test.ts` (+ engine-coverage-round-13/14/15) | `1135` only |
| `docs/dev/backlog-2026-10-11ap.md` | `1136` only; leave ap `1109`/`1114` alone |
| `docs/dev/check-copy-pins.md` | `1137` only |

**Parallel-friendly:** `1122`, `1125`, `1127`, `1132`, `1133`, `1134`, `1135`, `1136`, `1137`. Serialize `1122`→`1123`→`1124`; serialize `1125`→`1126`; serialize `1127`→`1128`→`1129`→`1130`→`1131`.

## Live tip measurements (evidence snapshot @ `9aba0ac3`)

```text
$ git rev-parse HEAD
  9aba0ac33f1d57e43b7483c9aa4a962b16d055ab

$ git branch --show-current
  cursor/mp-tip-poste740 (audited) / cursor/backlog-2026-10-11aq-2cd6 (this PR)

$ find tests/unit \( -name '*.test.ts' -o -name '*.spec.ts' \) ! -path '*/_tokenmaxx_archive/*' | wc -l
  3399

$ npm run test:e2e:chromium -- --list
  Total: 249 tests in 25 files

$ npm run report:knip -- --json
  unusedExports: 3  unusedTypes: 29  unusedFiles: 0
  (NOTICE unusedTypes 36→29 shrink vs committed baseline 36 — baseline write NOT queued)

$ # workflows scalar / string-form on
  onIncludesEvent("pull_request","pull_request") → false
  on: pull_request + secrets.* → audit []
  on: pull_request_target → audit []  (forbidden never fires)
  on: [pull_request] → secrets violation (folded 1077)

$ # job-level permissions
  top-level contents:read + job permissions contents:write → audit []

$ # cache-dependency-path YAML array
  cache-dependency-path: [package-lock.json] → false fail setup-node pin
  cache-dependency-path: package-lock.json → clean

$ parsePrecacheManifest
  {"url":"/a.js","revision":"1"} → 1 entry (folded 1087)
  { "url" : "/a.js" , "revision" : "1" } → []
  {url: "/a.js", revision: "1", integrity: null} → []
  {url: "/a.js", revision: "1"} → 1 entry

$ classifyLicense
  GNU Affero General Public License v3.0 => ok  (AGPL-3.0 => denied)
  GNU Lesser General Public License v3.0 => ok  (LGPL-3.0 => copyleft_or_review)
  European Union Public License 1.2 => ok  (EUPL-1.2 => copyleft_or_review)
  Open Software License 3.0 => ok  (OSL-3.0 => copyleft_or_review)
  SEE LICENCE IN COPYING => ok  (SEE LICENSE IN COPYING => unknown)
  Common Public Attribution License 1.0 => ok  (CPAL-1.0 => denied)
  Custom / CPL / EPL prose / CDDL prose => ok (owned by ap 1102–1105 — leave)

$ parseMenuCriticalRefs
  <script src="/assets/x.js"> → [assets/x.js]
  <div data-src="/assets/x.js"> → [assets/x.js]  (false positive)
  <img ng-src="/assets/x.js"> → [assets/x.js]  (false positive)

$ resolveMetric({ pct: 150 }) → { pct: 150, … }
$ resolveMetric({ pct: -5 }) → { pct: -5, … }
$ resolveMetric({ covered: 12, total: 10, pct: 80 }) → clamped (folded 1083)

$ MATCHER_RE
  toHaveTextContent("Coming Soon") → MATCH (an 1059)
  toBeInTheDocument() / toHaveAttribute(...) / toHaveValue(...) /
    toHaveAccessibleDescription(...) → MISS

$ offsetWidth leak (unit-shared, --no-file-parallelism --maxWorkers=1)
  probe alone → PASS
  burn-wave40-tutorial-tap-cue-side then probe → FAIL (getter still mentions tutorial-tooltip)
  NO_RESTORE also: engine-coverage-round-13/14/15-burn-1008.test.ts

$ npm run check:dev-docs → problems: 5
  missing-path af intentional no-such-game example (1114)
  broken-md-link ao titled path.md example (1109)
  missing-path ap intentional no-such-game example (NEW self-hit)
  missing-path ap check-dev-doc-links doc path (NEW — file absent)
  broken-md-link ap titled path.md example (NEW self-hit)

$ docs/dev/check-copy-pins.md: "always exit 0"
  node scripts/check-copy-pins.mjs --help → exit 0 (usage)
  --wat → Unknown flags exit 2
  default tip scan → report-only exit 0; --fail opt-in exit 1

$ CI=1 npx vitest run tests/unit/state-roundtrip-fuzz.test.ts
  Duration ~14.8s — leave ap 1108

$ Alpha CI 38114521587 visual-baseline: 42 failed (report-only job success) — leave 1050/1113

$ Open drafts into cursor/mp-tip-poste740 at audit: #1298–#1311 (#1310 tip-folded; #1311 open)
$ Tip→alpha fold open: #1304 (q-mp-026x)
```

Baselines also captured under `/opt/cursor/artifacts/q-mp-090aq-baselines.log` and `/opt/cursor/artifacts/proto-leak-ab.log`.

## New tasks

### q-mp-1122 · Scripts: `check-workflows` treat scalar / string-form `on:` as event triggers

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-poste740`)
- **depends-on:** tip-owner skim (security contract); serialize with `1123`/`1124`; leave folded `#1298`/`1077` + ap `1097` + ao `1091` alone
- **series:** script-tooling
- **verdict:** **HOLD-CHECK** — secrets / forbidden-trigger false negatives on realistic scalar `on: pull_request` / `on: pull_request_target` (and YAML `"pull_request"` string)
- **CI / package.json callers:** `package.json` → `check:workflows`; **not** in `ci.yml`
- **target files:** `scripts/check-workflows.mjs` (`onIncludesEvent` / `hasPullRequestTrigger` / `auditWorkflow`); unit fixtures
- **measured baseline:** `onIncludesEvent("pull_request","pull_request")` → **false**; scalar `on: pull_request` + `secrets.*` → **`[]`**; scalar `on: pull_request_target` → **`[]`**; list-form `on: [pull_request]` already audited (folded `1077`).
- **acceptance criteria:** Scalar and quoted-string event names participate in PR/secrets/forbidden-trigger checks the same as mapping / list-form; live workflows stay clean; non-event junk still ignored.
- **verification commands:** `npm run check:workflows` ; `CI=1 npx vitest run tests/unit/workflow-contract.test.ts`
- **conflict notes:** not list-form `on` (`1077`), yes/on bools (`1097`), or `permissions: read-all` (`1091`).
- **screen:** HOLD-CHECK — workflow security contract.

### q-mp-1123 · Scripts: `check-workflows` audit job-level `permissions` writes

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-poste740`)
- **depends-on:** `1122` lightly (same module); tip-owner skim; leave ao `1091` alone
- **series:** script-tooling
- **verdict:** **HOLD-CHECK** — least-privilege gap; only top-level `doc.permissions` is inspected today
- **CI / package.json callers:** `package.json` → `check:workflows`
- **target files:** `scripts/check-workflows.mjs` (`auditWorkflow` job loop); unit fixtures
- **measured baseline:** top-level `contents: read` + job `permissions: { contents: write, id-token: write }` → **`[]`**.
- **acceptance criteria:** Job-scoped write / non-allowlisted permissions report violations (tip-owner-approved allowlist parity with top-level); read-only job perms stay clean; live workflows green.
- **verification commands:** `npm run check:workflows` ; `CI=1 npx vitest run tests/unit/workflow-contract.test.ts`
- **conflict notes:** serialize after `1122`; not shorthand `read-all` (`1091`).
- **screen:** HOLD-CHECK — permissions hardening scope.

### q-mp-1124 · Scripts: `check-workflows` accept YAML-array `cache-dependency-path`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-poste740`)
- **depends-on:** `1123` lightly
- **series:** script-tooling
- **verdict:** **SAFE** — false fail on valid GHA array form
- **CI / package.json callers:** `package.json` → `check:workflows`
- **target files:** `scripts/check-workflows.mjs` (setup-node cache-dependency-path check); unit fixtures
- **measured baseline:** `cache-dependency-path: package-lock.json` → clean; `cache-dependency-path: [package-lock.json]` → **must set cache: npm and cache-dependency-path: package-lock.json**.
- **acceptance criteria:** Array (and newline-split string) containing `package-lock.json` accepted; missing / wrong path still fails; live workflows clean.
- **verification commands:** `npm run check:workflows` ; `CI=1 npx vitest run tests/unit/workflow-contract.test.ts`
- **conflict notes:** serialize after `1123`.

### q-mp-1125 · Scripts: `parsePrecacheManifest` accept whitespace around JSON-quoted keys

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-poste740`)
- **depends-on:** none (serialize with `1126`; leave ap `1098`/`1099` + folded `#1303`/`1087` alone)
- **series:** script-tooling
- **verdict:** **SAFE** — silent undercount when formatters pad JSON object keys
- **CI / package.json callers:** `package.json` → `check:build`; **not** a blocking CI job
- **target files:** `scripts/check-build.mjs` (`parsePrecacheManifest`); helpers unit tests
- **measured baseline:** `{"url":"/a.js","revision":"1"}` → 1 entry; `{ "url" : "/a.js" , "revision" : "1" }` → **`[]`**.
- **acceptance criteria:** Optional WS around JSON-quoted `url`/`revision` keys and colons parses; folded `1087` + ap `1098`/`1099` behaviors preserved.
- **verification commands:** `CI=1 npx vitest run tests/unit/check-build*.test.ts` ; `node --input-type=module -e 'import { parsePrecacheManifest } from "./scripts/check-build.mjs"; …'`
- **conflict notes:** distinct from bare spaced keys (`1099`) and trailing commas (`1098`).

### q-mp-1126 · Scripts: `parsePrecacheManifest` ignore optional Workbox `integrity` field

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-poste740`)
- **depends-on:** `1125` lightly (same regex)
- **series:** script-tooling
- **verdict:** **SAFE** — silent undercount for official `PrecacheEntry.integrity`
- **CI / package.json callers:** `package.json` → `check:build`
- **target files:** `scripts/check-build.mjs` (`parsePrecacheManifest`); helpers unit tests
- **measured baseline:** `{url: "/a.js", revision: "1"}` → 1 entry; `{url: "/a.js", revision: "1", integrity: null}` → **`[]`**.
- **acceptance criteria:** Optional `integrity` (null/string) after url/revision does not drop the entry; url/revision still required; trailing-comma / JSON-key behaviors coexist.
- **verification commands:** `CI=1 npx vitest run tests/unit/check-build*.test.ts`
- **conflict notes:** serialize after `1125`.

### q-mp-1127 · Scripts: `classifyLicense` deny Affero / GNU Affero prose

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-poste740`)
- **depends-on:** none (serialize with `1128`–`1131`; leave ap `1102`–`1105` + ao `1081` + folded `#1306`/`1079` alone)
- **series:** script-tooling
- **verdict:** **SAFE** — clear deny-list miss vs `AGPL-*` / folded `AGPLv3`
- **CI / package.json callers:** `package.json` → `report:licenses`; **not** a blocking CI job
- **target files:** `scripts/report-licenses.mjs` (`DENIED_LICENSE_PATTERNS`); helpers unit tests
- **measured baseline:** `GNU Affero General Public License v3.0` / `Affero General Public License` → **`ok`**; `AGPL-3.0` → `denied`.
- **acceptance criteria:** Listed Affero prose → `denied`; MIT stays `ok`; HC-guard on lockfile class counts.
- **verification commands:** `CI=1 npx vitest run tests/unit/report-licenses*.test.ts` ; lockfile classify before/after count diff
- **conflict notes:** not short `AGPLv3` (`1079`) or proprietary (`1081`).

### q-mp-1128 · Scripts: `classifyLicense` review GNU Lesser / Library GPL prose

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-poste740`)
- **depends-on:** `1127` lightly
- **series:** script-tooling
- **verdict:** **SAFE** — prose `ok` while `LGPL-*` / folded `LGPLv*` are `copyleft_or_review`
- **CI / package.json callers:** `package.json` → `report:licenses`
- **target files:** `scripts/report-licenses.mjs` (`COPYLEFT_OR_REVIEW_PATTERNS`); helpers tests
- **measured baseline:** `GNU Lesser General Public License v3.0` / `GNU Library General Public License` → **`ok`**; `LGPL-3.0` → `copyleft_or_review`.
- **acceptance criteria:** Listed LGPL/Library prose → `copyleft_or_review`; MIT stays `ok`; HC-guard on lockfile.
- **verification commands:** `CI=1 npx vitest run tests/unit/report-licenses*.test.ts`
- **conflict notes:** serialize after `1127`; not `LGPLv*` token (`1079`).

### q-mp-1129 · Scripts: `classifyLicense` review EUPL / OSL prose forms

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-poste740`)
- **depends-on:** `1128` lightly
- **series:** script-tooling
- **verdict:** **SAFE** — SPDX already `copyleft_or_review`; prose currently `ok`
- **CI / package.json callers:** `package.json` → `report:licenses`
- **target files:** `scripts/report-licenses.mjs`; helpers tests
- **measured baseline:** `European Union Public License 1.2` / `Open Software License 3.0` → **`ok`**; `EUPL-1.2` / `OSL-3.0` → `copyleft_or_review`.
- **acceptance criteria:** Listed EUPL + OSL prose → `copyleft_or_review`; HC-guard on lockfile.
- **verification commands:** `CI=1 npx vitest run tests/unit/report-licenses*.test.ts`
- **conflict notes:** serialize after `1128`.

### q-mp-1130 · Scripts: `classifyLicense` treat British `SEE LICENCE IN …` as unknown

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-poste740`)
- **depends-on:** `1129` lightly
- **series:** script-tooling
- **verdict:** **SAFE** — spelling variant of existing `SEE LICENSE` unknown pattern
- **CI / package.json callers:** `package.json` → `report:licenses`
- **target files:** `scripts/report-licenses.mjs` (`UNKNOWN_LICENSE_PATTERNS`); helpers tests
- **measured baseline:** `SEE LICENCE IN COPYING` → **`ok`**; `SEE LICENSE IN COPYING` → `unknown`.
- **acceptance criteria:** `SEE LICENCE…` (and case variants) → `unknown`; American spelling unchanged; HC-guard on lockfile.
- **verification commands:** `CI=1 npx vitest run tests/unit/report-licenses*.test.ts`
- **conflict notes:** serialize after `1129`; not `Custom` (`1102`).

### q-mp-1131 · Scripts: `classifyLicense` deny Common Public Attribution License prose

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-poste740`)
- **depends-on:** `1130` lightly
- **series:** script-tooling
- **verdict:** **SAFE** — `CPAL-1.0` already denied; prose currently `ok`
- **CI / package.json callers:** `package.json` → `report:licenses`
- **target files:** `scripts/report-licenses.mjs` (`DENIED_LICENSE_PATTERNS`); helpers tests
- **measured baseline:** `Common Public Attribution License 1.0` / `Common Public Attribution License Version 1.0` → **`ok`**; `CPAL-1.0` → `denied`.
- **acceptance criteria:** Listed CPAL prose → `denied`; MIT stays `ok`; HC-guard on lockfile.
- **verification commands:** `CI=1 npx vitest run tests/unit/report-licenses*.test.ts`
- **conflict notes:** serialize after `1130`; not CPL / Common Public License (`1103`).

### q-mp-1132 · Scripts: `parseMenuCriticalRefs` require `src`/`href` attribute word boundary

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-poste740`)
- **depends-on:** none (leave ao `1088` + an `1060` alone)
- **series:** script-tooling
- **verdict:** **SAFE** — false-positive inflation of menu-critical asset totals
- **CI / package.json callers:** `package.json` → `size:check` / menu-critical path used by perf helpers; soft CI
- **target files:** `scripts/check-bundle-budgets.mjs` (`parseMenuCriticalRefs`); unit cases
- **measured baseline:** `<script src="/assets/x.js">` → `[assets/x.js]`; `<div data-src="/assets/x.js">` / `<img ng-src=…>` / `xsrc=` → **also** `[assets/x.js]`.
- **acceptance criteria:** Only real `src`/`href` attributes match; `data-src`/`ng-src`/`xsrc` ignored; folded/queued quote+query/`./assets` behaviors unchanged when those land.
- **verification commands:** `CI=1 npx vitest run tests/unit/*bundle-budget* tests/unit/*menu-critical* 2>/dev/null; CI=1 npx vitest run tests/unit/check-bundle*.test.ts` (or hermetic new case)
- **conflict notes:** not single-quote/query (`1088`) or `./assets` (`1060`).

### q-mp-1133 · Scripts: `engine-coverage-rank` clamp pct-only values to \[0,100\]

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-poste740`)
- **depends-on:** none (leave folded `#1302`/`1083`/`1084` + `#1301`/`1085` alone)
- **series:** script-tooling
- **verdict:** **SAFE** — display/rank parity with `report-coverage-map` pct clamp
- **CI / package.json callers:** `package.json` → `report:engine-coverage-rank` (or named engine-coverage-rank script); **not** blocking CI
- **target files:** `scripts/engine-coverage-rank.mjs` (`resolveMetric` pct-only branch); unit cases
- **measured baseline:** `resolveMetric({ pct: 150 })` → `{ pct: 150, … }`; `resolveMetric({ pct: -5 })` → `{ pct: -5, … }`; counts path already clamps (`1083`).
- **acceptance criteria:** Pct-only finite values clamped to \[0,100\]; non-finite still rejected/zeroed per existing rules; covered>total + no-`0/0` behaviors preserved.
- **verification commands:** `CI=1 npx vitest run tests/unit/*engine-coverage-rank*.test.ts` ; node one-liner on `resolveMetric`
- **conflict notes:** not covered>total (`1083`), pct-only `0/0` (`1084`), or coverage-map clamp (`1085`).

### q-mp-1134 · Scripts: `check-copy-pins` MATCHER_RE cover common jest-dom matchers

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-poste740`)
- **depends-on:** none (leave an `1059` alone)
- **series:** script-tooling
- **verdict:** **SAFE** — silent miss on realistic Vitest/jest-dom asserts (report-only)
- **CI / package.json callers:** `package.json` → `check:copy-pins`; CI soft `check:copy-pins -- --fail`
- **target files:** `scripts/check-copy-pins.mjs` (`MATCHER_RE` / `extractExpectUnit`); self-test / unit cases
- **measured baseline:** `toHaveTextContent` / `toHaveAccessibleName` match (an `1059`); `toBeInTheDocument` / `toHaveAttribute` / `toHaveValue` / `toHaveAccessibleDescription` → **MISS** → no finding.
- **acceptance criteria:** Listed matchers participate in Coming Soon / copy-pin extraction; negatives unchanged; default report-only exit 0.
- **verification commands:** `npm run check:copy-pins -- --self-test` ; `CI=1 npx vitest run tests/unit/check-copy-pins*.test.ts`
- **conflict notes:** not `toHaveTextContent` ticket (`1059`).

### q-mp-1135 · Tests: restore `HTMLElement.prototype.offsetWidth|Height` after tutorial stubs

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 test-hygiene
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-poste740`)
- **depends-on:** none
- **series:** test-flake
- **verdict:** **SAFE** — tests-only; proven cross-file pollution under `unit-shared` `isolate:false`
- **CI / package.json callers:** `npm run test:unit` / CI `unit`
- **target files:** `tests/unit/burn-wave40-tutorial-tap-cue-side.test.ts`; `tests/unit/engine-coverage-round-13-burn-1008.test.ts`; `tests/unit/engine-coverage-round-14-burn-1008.test.ts`; `tests/unit/engine-coverage-round-15-burn-1008.test.ts` (all NO_RESTORE today). Prefer `afterEach` `delete` or restore saved descriptors (mirror `tutorial.test.ts` / `q-mp-632-…`).
- **measured baseline:** A/B with `--project=unit-shared --no-file-parallelism --maxWorkers=1`: probe alone PASS; `burn-wave40-tutorial-tap-cue-side` then probe FAIL (`getter` still contains `tutorial-tooltip`). Log: `/opt/cursor/artifacts/proto-leak-ab.log`.
- **acceptance criteria:** After each listed file, prototype descriptors are restored/deleted; same A/B order PASS; no product tutorial/UI changes; owl flake (`1092`) left alone.
- **verification commands:** `CI=1 npx vitest run --project=unit-shared --no-file-parallelism --maxWorkers=1 tests/unit/burn-wave40-tutorial-tap-cue-side.test.ts tests/unit/<probe-or-neighbor>.test.ts` ; full `CI=1 npx vitest run` on touched files
- **conflict notes:** not owl drag flake (`1092`).

### q-mp-1136 · Docs: remove `backlog-2026-10-11ap.md` self-inflicted `check:dev-docs` hits

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs-accuracy
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-poste740`)
- **depends-on:** none (leave ap `1109`/`1114` alone)
- **series:** docs-accuracy
- **verdict:** **SAFE** — docs-only; stops round-42 backlog from adding three checker problems
- **CI / package.json callers:** `package.json` → `check:dev-docs` (report-only)
- **target files:** `docs/dev/backlog-2026-10-11ap.md` (live markdown links / bare paths to the titled path.md example, the intentional no-such-game rules path, and the absent check-dev-doc-links doc path)
- **measured baseline:** `npm run check:dev-docs` → **problems: 5** including three hits in `backlog-2026-10-11ap.md` (missing-path ×2 + broken-md-link ×1). Ao titled path.md (`1109`) + af intentional no-such-game (`1114`) remain separate.
- **acceptance criteria:** Fence/code-span examples so ap contributes **0** checker problems; do not invent the absent check-dev-doc-links doc unless tip-owner wants a real doc (prefer code-span); `check:dev-docs` problem count drops by 3; no tip-name / count-cell edits.
- **verification commands:** `npm run check:dev-docs` ; `rg -n 'path\\.md|no-such-game|check-dev-doc-links' docs/dev/backlog-2026-10-11ap.md`
- **conflict notes:** not ao cleanup (`1109`) or af label (`1114`).

### q-mp-1137 · Docs: `check-copy-pins.md` stop claiming tip scan always exit 0

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs-accuracy
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-poste740`)
- **depends-on:** none
- **series:** docs-accuracy
- **verdict:** **SAFE** — docs-only; matches live CLI exit semantics
- **CI / package.json callers:** n/a (docs); script is `package.json` → `check:copy-pins`
- **target files:** `docs/dev/check-copy-pins.md` (lines claiming “always exit 0” / tip scan exit 0 without mentioning `--fail` / unknown-flag **2**)
- **measured baseline:** Doc says tip scan always exit 0. Live: default report-only → 0; `--fail` opt-in → 1 when findings; unknown flags → **2** (usage text).
- **acceptance criteria:** Doc states default report-only exit 0, `--fail` → 1 on findings, unknown flags → 2; no script logic change.
- **verification commands:** `rg -n 'always exit 0|exit 0|exit 2|--fail' docs/dev/check-copy-pins.md` ; `node scripts/check-copy-pins.mjs --wat ; echo $?`
- **conflict notes:** not MATCHER_RE expansion (`1134` / `1059`).

## Verdict summary

| Id | Verdict | Title (short) |
| --- | --- | --- |
| `q-mp-1122` | **HOLD-CHECK** | check-workflows: scalar/string `on:` triggers |
| `q-mp-1123` | **HOLD-CHECK** | check-workflows: job-level permissions writes |
| `q-mp-1124` | **SAFE** | check-workflows: YAML-array cache-dependency-path |
| `q-mp-1125` | **SAFE** | parsePrecacheManifest: spaced JSON-quoted keys |
| `q-mp-1126` | **SAFE** | parsePrecacheManifest: optional integrity field |
| `q-mp-1127` | **SAFE** | classifyLicense: Affero / GNU Affero prose → denied |
| `q-mp-1128` | **SAFE** | classifyLicense: GNU Lesser/Library GPL prose |
| `q-mp-1129` | **SAFE** | classifyLicense: EUPL / OSL prose |
| `q-mp-1130` | **SAFE** | classifyLicense: British SEE LICENCE → unknown |
| `q-mp-1131` | **SAFE** | classifyLicense: CPAL prose → denied |
| `q-mp-1132` | **SAFE** | parseMenuCriticalRefs: src/href word boundary |
| `q-mp-1133` | **SAFE** | engine-coverage-rank: pct-only clamp \[0,100\] |
| `q-mp-1134` | **SAFE** | check-copy-pins: jest-dom matcher coverage |
| `q-mp-1135` | **SAFE** | tests: restore offsetWidth/Height prototype stubs |
| `q-mp-1136` | **SAFE** | docs: drop ap backlog self-hits in check:dev-docs |
| `q-mp-1137` | **SAFE** | docs: check-copy-pins exit semantics |

**Screened HOLD-CHECK (2):** `1122`, `1123` — tip-owner should skim before fold (workflow secrets/forbidden-trigger contract; job-level permissions scope).  
**No HOLD** product tickets queued (AI shard speedups / board-3d / rules / copy left out of scope).

## Out of scope / not used here

Already claimed / undrafted / HOLD / no headroom / prompt-skipped families: void/nnnull/nullish successors, eqeqeq product clear (`fiar/rules.ts` HOLD), lint-buckets eqeqeq probe, optional-chain product clears, knip demote / unusedTypes baseline drop, wiki **count** remasure, tip-name pointers (done on tip), UI coverage rounds, soft-fail characterizations, mutation-audit **waves**, board-3d **src** / **mp3d e2e** wait clears, harness shards, demo coverage, page-ready / double-rAF / artifact-dir / mountPair / npm aliases / `--help`/`--dry-run`/argv / empty-input / lib main-entry / cli-help spawn speedups (rounds 34–42), deep-playtest `waitForTimeout`, overnight mountPair/router batches, round-31…42 tickets through `q-mp-1114`, CI `e2e-cross-browser` yaml named script (`800`), dismissOwl deep-playtest (`879`), stars-bars / nav-away mid-AI / memory-leak / runtime-perf / webkit-offline / probe-offline **wait** clears (prior HOLD/skip), emit-identity wave5 merge-base tip retarget (tip-owner HOLD-CHECK), Queens & Guards product, AI timing / Hex Hard 450ms / Stars & Bars history cap, AI determinism/quality shard wall-time cuts (HOLD), dead-code Rank-2 yes deletes (live **0**), `cancelFabAiRequests` knip LEAVE (AI HOLD), visual-baseline PNG refresh (`1050`), canvas-dpr WebKit skip policy (`1051`), menu quote/query (`1088`), boundaries inline type (`1089`), permissions read-all (`1091`), owl flake (`1092`), ao/ap visual triage (`1093`/`1113`), proprietary/source-available license policy (`1081`), YAML 1.1 yes/on (`1097`), precache trailing/spaced-bare (`1098`/`1099`), Custom/CPL/EPL/CDDL (`1102`–`1105`), summarizeKnip (`1106`), state-roundtrip speed (`1108`).

**Could not honestly fill to 25** without filler (more `--help`/`--dry-run`/argv/empty-input theater, cli-help spawn speedups, mountPair adoptions, npm aliases, tip-name pointer stamps, knip baseline remasure, Rank-3 demote theater, AI harness speed theater, wiki count cells, or HOLD board-3d/mp3d wait clears). Stopped at **16**.
