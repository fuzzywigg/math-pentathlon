# Engineering backlog — 2026-10-11ap (tip refill after poste740 folds / round-42)

**Task id:** `q-mp-090ap`  
**Role:** worker (report-only)  
**Tip audited:** `cursor/mp-tip-poste740` @ `a6e331d5` (full `a6e331d57734f85b7d89b051b2fbc7dc7dd2f77c`; tip cut from `alpha` @ `e740d0b6` after `#1288`; tip-owner fold `#1304` already landed living tip pointers + round-41 implementers `#1298`–`#1309` onto tip HEAD)  
**Depends on:** tip `cursor/mp-tip-poste740` @ `a6e331d5`. Round-41 backlog (`q-mp-090ao` / folded into alpha via `#1288`, ids `q-mp-1077`…`1096`) — tip already folded SAFE implementers `#1298`–`#1303`/`#1305`–`#1309`; remaining ao HOLD-CHECK gaps (`1081`/`1088`/`1089`/`1091`/`1092`/`1093`) — leave with `contained`. Round-40 an gaps on `post01f5` (`#1289`–`#1297`) and older tip stacks — leave with `contained`. Tip HEAD continues to move as tip-owner folds green drafts — **rebase onto latest tip before opening worker PRs**.

## Purpose

The tip `cursor/mp-tip-poste740` @ `a6e331d5` measures unit files **3399**; Chromium e2e **25** files / **249** cases; knip unusedExports **3** (LEAVE) / unusedTypes **29** / unusedFiles **0**. Alpha CI run `38114521587` (post-`#1288`) is green on blocking jobs; report-only `visual-baseline` still records **42 failed** screenshot comparisons (job success via `continue-on-error`). This doc lists **18 new** concrete engineering tasks (`q-mp-1097` … `q-mp-1114`) mined from the **live tip tree after `#1298`–`#1309` folds**, checked against prior refills through `q-mp-1096` and against the full open draft PR list (poste740 implementers `#1298`–`#1309`, post01f5 leftovers `#1289`–`#1297`, post1239 / older stacks). It is the **only** deliverable of `q-mp-090ap`.

**Honest count:** Only **18** tasks — not padded to 25. Id range starts at `q-mp-1097` per round-42 brief (`1073`–`1076` remain unused / reserved; `1008`–`1016` and `981`–`991` remain unused / reserved). Round-41 already claimed workflows list-form+quoted bools, license legacy+OR, apple-touch href order, engine-rank clamp+pct-only, coverage-map pct clamp, emit regex normalize, precache JSON keys, menu quote/query (HOLD-CHECK), boundaries inline type (HOLD-CHECK), LH child kill, permissions read-all (HOLD-CHECK), owl flake (HOLD-CHECK), visual triage (HOLD-CHECK), build-repro exit docs, dev-doc link titles, seat-handoff speed — **do not** re-queue `1077`–`1096` (leave open tip drafts + unworked ao HOLD-CHECK gaps with `contained`). This refill **does not** re-queue page-ready / double-rAF / artifact-dir / mountPair adoptions, npm aliases, `--help` / `--dry-run` / unknown-flag argv sweeps, empty-input / malformed-JSON guards as a family, lib main-entry guards, tip-name doc pointers (already on tip via `#1304` bootstrap), tip-stamp **count** remasures, knip unusedTypes baseline drop, Rank-3 demote theater, more cli-help spawn speedups, CI `e2e-cross-browser` named script (`800`), dismissOwl deep-playtest (`879`), deep-playtest / star-track / docs-playtest `waitForTimeout` families, stars-bars / nav-away **wait** clears (prior HOLD/skip), emit-identity wave5 merge-base tip retarget (tip-owner HOLD-CHECK — not queued), or anything in rounds ≤41.

**Fresh payoffs on this tip (re-measured after `#1298`–`#1309` folds @ `a6e331d5`):** **`check-workflows` still rejects YAML 1.1 `cancel-in-progress: yes` / `on` (and quoted `"yes"`) while `true` / `True` / `"true"` pass**, **`persist-credentials: yes` still fails the checkout pin**, **`parsePrecacheManifest` drops trailing-comma objects and spaced bare keys `{ url : "/a.js" }` (JSON-quoted keys fixed by folded `1087`)**, **`validateIndexHtml` misses valid `apple-mobile-web-app-capable` / `title` when `content` precedes `name` (apple-touch href-order fixed by folded `1082`)**, **`validateManifest` rejects brand-correct `#102A43` theme/background hex casing**, **`classifyLicense` treats `Custom` / `Custom: https://…` / `CPL-1.0` / `Common Public License 1.0` / `Eclipse Public License - v 2.0` / CDDL long prose / `MS-RL` as `ok`**, **`summarizeKnip` throws when `issues` is a non-array object**, **`render-perf-mode` still exports `TABLET_VIEWPORT` / `enterHoverPhase` / `renderReportPaths` with zero external importers**, **`scripts/check-build.mjs` header still claims “Always exits 0” while unknown flags exit 2** (doc cheat sheet fixed by folded `1094`), **`state-roundtrip-fuzz` wall ~15.5s**, and alpha CI **visual-baseline still 42 failed** (diagnose refresh against poste740/alpha evidence).

**Preference:** SAFE, mutually independent **scripts/** wrong-results fixes, **docs-only** accuracy, or **tests-only** flake/speed hygiene. **Do not** queue another remasure of CI wall, bundle headroom, lint-bucket snapshot, copy-pins findings totals, boundaries/PWA thresholds, board-3d layout inventory, CI permissions, tip-pointer **count** stamps, open-draft triage, emit-identity inventory remasure, knip unusedTypes baseline drop, Rank-3 demote theater, dead-CSS Rank-1 rescan, wiki **count** cells, or more cli-help spawn speedups. Anything in rules / AI / scoring / legal-move paths, player-facing copy, tutorials product edits, timing, Stars & Bars history cap, Hex Hard 450ms, board-3d **src** / **mp3d e2e**, or CI permissions widening is **HOLD**. **Do not** change fake-clock semantics. **Do not** edit `*/rules.ts`.

**Lint policy for this refill:** **no** new ceiling-key clears.

## Duplicate check (do not re-queue)

| Topic family | Why skipped |
| --- | --- |
| round-41 / workflows list+quoted (`1077`/`1078` folded) / license legacy+OR (`1079`/`1080` folded) / apple-touch href (`1082` folded) / engine-rank (`1083`/`1084` folded) / coverage pct (`1085` folded) / emit regex (`1086` folded) / precache JSON keys (`1087` folded) / menu quotes (`1088`) / boundaries inline type (`1089`) / LH kill (`1090` folded) / permissions read-all (`1091`) / owl flake (`1092`) / visual triage (`1093`) / build-repro docs (`1094` folded) / md titles (`1095` folded) / seat-handoff speed (`1096` folded) | tip-folded `#1298`–`#1309` + ao HOLD-CHECK gaps — leave with `contained`; **do not** re-queue `1077`–`1096` (this refill’s `1097`/`1098`/`1099`/`1100` are **only** YAML 1.1 yes/on / trailing-comma precache / spaced-key precache / apple-mobile content-before-name — not siblings of quoted `"true"` / JSON keys / apple-touch href) |
| round-40…32 / page-ready / double-rAF / artifact-dir / mountPair / npm aliases / `--help`/`--dry-run`/argv / lib main-entry / empty-input argv / cli-help spawn theater | prompt hard-skip + open drafts / tip folds — leave with `contained` |
| CI `e2e-cross-browser` named script (`800`) / dismissOwl deep-playtest (`879`) | tip-queued; unworked — **do not** re-queue |
| deep-playtest / star-track / docs-playtest waits | leave prior ids |
| visual-baseline PNG refresh / stabilize (`1050`) | leave with `contained`; this refill’s `1113` is diagnose-only against alpha `38114521587` |
| nested flake-e2e (`1052`) / emit string normalize (`1053`) / mutation no-files (`1038`) / timeout-minutes string (`1057`) / theme-color media-order (`1055`) / precache revision-first (`1058`) | already on tip / open post01f5 drafts — leave with `contained` |
| knip unusedExports LEAVE / unusedTypes baseline drop / Rank-3 demotes / dead-code Rank-2 yes (live **0**) / unusedFiles **0** | no SAFE deletes of knip product exports; remasure theater skipped |
| tip-name pointers | already on tip (`AGENTS.md` / wiki → `poste740`) via `#1304` bootstrap |
| emit-identity wave5 merge-base tip retarget | tip-owner HOLD-CHECK — not queued |
| AI determinism / quality shard wall times | **HOLD** — AI harness; do not fake-clock or change search |
| AI-timing / Hex Hard 450ms / history-cap / rules.ts / copy / scoring / CI permissions / eqeqeq in `fiar/rules.ts` | hard-rule HOLD |
| wiki / testing-layers **count** remasure (`3366`→`3399`) | prompt hard-skip tip-stamp theater |

Also skipped: Merom / Sullivan / data-center / grants / nonprofit; `pappas-infrastructure`; meromhouse agents; any CI `permissions` widening. No `memory/` files.

## Stale queue re-check (live tip `a6e331d5`)

| Id | Title (short) | Verdict | Evidence @ `a6e331d5` |
| --- | --- | --- | --- |
| `q-mp-090ao` / `#1287` | round-41 backlog | **folded into alpha / tip lineage** | This refill starts at `1097`. |
| `#1298`–`#1309` | ao SAFE implementers | **tip-folded** (`#1304` fold table) | Leave with `contained`. |
| `q-mp-1081`/`1088`/`1089`/`1091`/`1092`/`1093` | ao HOLD-CHECK gaps | **still-valid; need tip-owner skim / workers** | leave prior ids; do not sibling. |
| `#1289`–`#1297` | an gaps on post01f5 | **open on retired tip** | Leave with `contained`. |
| `q-mp-1050` | visual-baseline refresh/stabilize | **still-valid; no open PNG refresh PR** | Leave prior id; `1113` diagnose-only. |
| `q-mp-800` | CI cross-browser named script | **tip-queued; unworked** | Live `ci.yml` still bare `test:e2e -- --project=firefox --project=webkit` — **do not** re-queue. |
| `q-mp-879` | dismissOwl deep-playtest adopters | **still-valid; no open PR** | Leave prior id. |
| Dead-code Rank-2 yes | live dry-run | **0 yes** | No SAFE product delete ticket; script export demotes only. |
| Alpha CI `38114521587` | blocking green; visual 42 failed | **report-only drift** | Owned by `1050` for fix; diagnosed in purpose + `1113`. |

## Shared-file conflict flags

| Shared file | Conflicting new ids |
| --- | --- |
| `scripts/check-workflows.mjs` | `1097` only; leave ao `1091` permissions shorthand + folded `#1298`/`1077`/`1078` alone |
| `scripts/check-build.mjs` | `1098` + `1099` + `1111` — serialize; leave folded `#1303`/`1087` JSON keys alone |
| `scripts/lib/pwa-manifest-contract.mjs` | `1100` + `1101` — serialize; leave folded `#1300`/`1082` apple-touch + an `1056` display alone |
| `scripts/report-licenses.mjs` (+ `.d.mts` if patterns change) | `1102` + `1103` + `1104` + `1105` — serialize; leave ao `1081` proprietary policy + folded `#1306`/`1079`/`1080` alone |
| `scripts/report-knip.mjs` | `1106` only; leave open `#1297`/`1036` baseline schema alone |
| `scripts/render-perf-mode.mjs` | `1107` only |
| `tests/unit/state-roundtrip-fuzz.test.ts` (+ helpers if needed) | `1108` only |
| `docs/dev/backlog-2026-10-11ao.md` | `1109` only (example href hygiene) |
| `docs/dev/q-mp-055-visual-baseline-triage.md` | `1113` only; leave `1050` PNG refresh + ao `1093` alone |
| `scripts/check-boundaries.mjs` | none new — leave ao `1089` |
| `scripts/check-bundle-budgets.mjs` | none new — leave ao `1088` + an `1060` |

**Parallel-friendly:** `1097`, `1100`, `1106`, `1107`, `1108`, `1109`, `1111`, `1112`, `1113`, `1114`. Serialize `1098`→`1099`→`1111`; serialize `1100`→`1101`; serialize `1102`→`1103`→`1104`→`1105`.

## Live tip measurements (evidence snapshot @ `a6e331d5`)

```text
$ git rev-parse HEAD
  a6e331d57734f85b7d89b051b2fbc7dc7dd2f77c

$ git branch --show-current
  cursor/mp-tip-poste740 (audited) / cursor/backlog-2026-10-11ap-6950 (this PR)

$ find tests/unit \( -name '*.test.ts' -o -name '*.spec.ts' \) ! -path '*/_tokenmaxx_archive/*' | wc -l
  3399

$ npm run test:e2e:chromium -- --list
  Total: 249 tests in 25 files

$ npm run report:knip -- --json
  unusedExports: 3  unusedTypes: 29  unusedFiles: 0
  (NOTICE unusedTypes 36→29 shrink vs committed baseline 36 — baseline write NOT queued)

$ # workflows YAML 1.1 cancel / persist
  cancel-in-progress: true|True|"true" → clean
  cancel-in-progress: yes|on|"yes" → must be true
  persist-credentials: "false" → clean (folded 1078)
  persist-credentials: yes → checkout must set persist-credentials: false

$ parsePrecacheManifest
  {"url":"/a.js","revision":"1"} → 1 entry (folded 1087)
  {url: "/a.js", revision: "1",} → []
  { url : "/a.js" , revision : "1" } → []

$ validateIndexHtml
  apple-touch href-before-rel → ok (folded 1082)
  content-before-name apple-mobile capable/title → missing capable/title

$ validateManifest theme_color "#102A43" → expected "#102a43"

$ classifyLicense
  Custom=>ok  Custom: https://x=>ok
  CPL-1.0=>ok  Common Public License 1.0=>ok
  Eclipse Public License - v 2.0=>ok  (EPL-2.0=>copyleft_or_review)
  Common Development and Distribution License=>ok  (CDDL-1.1=>copyleft_or_review)
  MS-RL=>ok
  Elastic-2.0=>ok (owned by ao 1081 — leave)

$ summarizeKnip({issues:{exports:[…]}}) → TypeError: object is not iterable

$ CI=1 npx vitest run tests/unit/state-roundtrip-fuzz.test.ts
  Duration ~15.5s (tests ~14.9s) — 22 tests

$ CI=1 npx vitest run tests/unit/engine-property-invariants.test.ts
  Duration ~6.66s — leave prior id 1071

$ Alpha CI 38114521587 visual-baseline: 42 failed (report-only job success)

$ Open drafts into cursor/mp-tip-poste740 at audit: #1298–#1309 (tip-folded; leave with contained)
$ Tip→alpha fold open: #1304 (q-mp-026x)
```

Baselines also captured under `/opt/cursor/artifacts/q-mp-090ap-baselines.log` and `/opt/cursor/artifacts/q-mp-090ap-reprobe-tip.log`.

## New tasks

### q-mp-1097 · Scripts: `check-workflows` accept YAML 1.1 `yes`/`on` for cancel / persist-credentials

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-poste740`)
- **depends-on:** none (leave folded `#1298`/`1077`/`1078` + ao `1091` alone)
- **series:** script-tooling
- **verdict:** **SAFE** — js-yaml 1.2 keeps bare `yes`/`on`/`"yes"` as strings; distinct from quoted `"true"`/`"false"` (`1078`)
- **CI / package.json callers:** `package.json` → `check:workflows`; **not** in `ci.yml`
- **target files:** `scripts/check-workflows.mjs` (cancel-in-progress + persist-credentials checks); unit fixtures
- **measured baseline:** `cancel-in-progress: yes|on|"yes"` → `must be true`; `persist-credentials: yes` → checkout violation; `true`/`True`/`"true"` / `"false"` → clean (folded `1078`).
- **acceptance criteria:** YAML 1.1-style truthy tokens `yes`/`on` (and case variants tip-owner approves) accepted as true; `no`/`off` accepted as false for persist; non-bool junk still fails; live workflows stay clean.
- **verification commands:** `npm run check:workflows` ; `CI=1 npx vitest run tests/unit/workflow-contract.test.ts`
- **conflict notes:** not list-form `on` (`1077`) or `permissions: read-all` (`1091`).

### q-mp-1098 · Scripts: `parsePrecacheManifest` accept trailing commas in Workbox entries

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-poste740`)
- **depends-on:** none (serialize with `1099`/`1111`; leave folded `#1303`/`1087` alone)
- **series:** script-tooling
- **verdict:** **SAFE** — silent undercount on prettier/JSON5-ish trailing commas
- **CI / package.json callers:** `package.json` → `check:build`; **not** a blocking CI job
- **target files:** `scripts/check-build.mjs` (`parsePrecacheManifest`); helpers unit tests
- **measured baseline:** `{url: "/a.js", revision: "1"}` → 1 entry; `{url: "/a.js", revision: "1",}` → **`[]`** (also JSON-quoted + trailing comma).
- **acceptance criteria:** Optional trailing comma after revision/url fields parses; folded `1058`/`1087` behaviors preserved; null revision still supported.
- **verification commands:** `CI=1 npx vitest run tests/unit/check-build*.test.ts` ; `node --input-type=module -e 'import { parsePrecacheManifest } from "./scripts/check-build.mjs"; …'`
- **conflict notes:** distinct from JSON-quoted keys (`1087`) and spaced keys (`1099`).

### q-mp-1099 · Scripts: `parsePrecacheManifest` accept whitespace around bare keys / colons

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-poste740`)
- **depends-on:** `1098` lightly (same regex)
- **series:** script-tooling
- **verdict:** **SAFE** — silent undercount when formatters pad object keys
- **CI / package.json callers:** `package.json` → `check:build`
- **target files:** `scripts/check-build.mjs` (`parsePrecacheManifest`); helpers unit tests
- **measured baseline:** `{ url : "/a.js" , revision : "1" }` → **`[]`**; `{url: "/a.js", revision: "1"}` → 1 entry; multiline indented keys without spaced colons already parse.
- **acceptance criteria:** Optional WS around bare `url`/`revision` identifiers and colons parses; trailing-comma (`1098`) + JSON keys (`1087`) coexist; no template-literal inventing required in this ticket.
- **verification commands:** `CI=1 npx vitest run tests/unit/check-build*.test.ts`
- **conflict notes:** serialize after `1098`.

### q-mp-1100 · Scripts: `validateIndexHtml` accept apple-mobile meta when `content` precedes `name`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-poste740`)
- **depends-on:** none (serialize with `1101`; leave folded `#1300`/`1082` apple-touch alone)
- **series:** script-tooling
- **verdict:** **SAFE** — false negative on valid HTML attribute order
- **CI / package.json callers:** `package.json` → `check:pwa-manifest`; `.github/workflows/ci.yml` → `build` → `npm run check:pwa-manifest` (report-only)
- **target files:** `scripts/lib/pwa-manifest-contract.mjs` (`validateIndexHtml` capable/title checks); unit cases
- **measured baseline:** `name` then `content` → ok (with brand theme + apple-touch); `content="yes" name="apple-mobile-web-app-capable"` (+ title content-first) → `missing apple-mobile-web-app-capable=yes` / title. Apple-touch href-order already fixed by folded `1082`.
- **acceptance criteria:** Either attribute order with correct values passes; wrong content still fails; live `index.html` + PWA tests green.
- **verification commands:** `CI=1 npx vitest run tests/unit/*pwa-manifest*.test.ts` ; `npm run check:pwa-manifest` (with `dist/` present)
- **conflict notes:** not apple-touch href (`1082`) or display REQUIRED (`1056`).

### q-mp-1101 · Scripts: `validateManifest` compare theme/background hex case-insensitively

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-poste740`)
- **depends-on:** `1100` lightly (same module)
- **series:** script-tooling
- **verdict:** **SAFE** — CSS/HTML hex is case-insensitive; false fail on `#102A43`
- **CI / package.json callers:** `package.json` → `check:pwa-manifest` (report-only)
- **target files:** `scripts/lib/pwa-manifest-contract.mjs` (`validateManifest` color compares); unit cases
- **measured baseline:** `theme_color: "#102a43"` → ok; `theme_color: "#102A43"` → `expected "#102a43"`. Index HTML theme checks already use case-insensitive content regex.
- **acceptance criteria:** Brand colors match case-insensitively; wrong hue still fails; live manifest green.
- **verification commands:** `CI=1 npx vitest run tests/unit/*pwa-manifest*.test.ts`
- **conflict notes:** serialize after `1100`; not display REQUIRED (`1056`).

### q-mp-1102 · Scripts: `classifyLicense` must not treat `Custom` / `Custom: …` as `ok`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-poste740`)
- **depends-on:** none (serialize with `1103`–`1105`; leave ao `1081` alone)
- **series:** script-tooling
- **verdict:** **SAFE** — wrong SBOM class on realistic npm `Custom` / URL license strings
- **CI / package.json callers:** `package.json` → `report:licenses`; **not** a blocking CI job
- **target files:** `scripts/report-licenses.mjs` (`UNKNOWN_*` / classify order); helpers unit tests
- **measured baseline:** `Custom` / `custom` / `Custom: https://x.test/lic` → **`ok`**; `SEE LICENSE IN LICENSE` → `unknown`; `UNLICENSED` → `unknown`.
- **acceptance criteria:** Bare/URL `Custom*` classify as `unknown` (or tip-owner-approved review bucket), not `ok`; MIT/Apache stay `ok`; no lockfile rewrite; HC-guard: installed lockfile class counts unchanged or tip-owner-approved.
- **verification commands:** `CI=1 npx vitest run tests/unit/report-licenses*.test.ts` ; lockfile classify before/after count diff
- **conflict notes:** not proprietary/source-available policy (`1081`).

### q-mp-1103 · Scripts: `classifyLicense` review `CPL-1.0` / Common Public License prose

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-poste740`)
- **depends-on:** `1102` lightly
- **series:** script-tooling
- **verdict:** **SAFE** — CPL is OSI copyleft; currently silent `ok`
- **CI / package.json callers:** `package.json` → `report:licenses`
- **target files:** `scripts/report-licenses.mjs` (`COPYLEFT_*` patterns); helpers tests
- **measured baseline:** `CPL-1.0` / `Common Public License 1.0` → **`ok`**; `EPL-2.0` / `CDDL-1.1` → `copyleft_or_review`.
- **acceptance criteria:** CPL SPDX + Common Public License prose → `copyleft_or_review`; MIT stays `ok`; HC-guard on lockfile counts.
- **verification commands:** `CI=1 npx vitest run tests/unit/report-licenses*.test.ts`
- **conflict notes:** serialize after `1102`; not EPL/CDDL prose (`1104`/`1105`).

### q-mp-1104 · Scripts: `classifyLicense` review Eclipse Public License prose forms

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-poste740`)
- **depends-on:** `1103` lightly
- **series:** script-tooling
- **verdict:** **SAFE** — EPL prose currently `ok` while `EPL-2.0` is copyleft_or_review
- **CI / package.json callers:** `package.json` → `report:licenses`
- **target files:** `scripts/report-licenses.mjs`; helpers tests
- **measured baseline:** `Eclipse Public License - v 2.0` / `Eclipse Public License v1.0` → **`ok`**; `EPL-1.0`/`EPL-2.0` → `copyleft_or_review`.
- **acceptance criteria:** Listed EPL prose forms match SPDX copyleft_or_review bucket; HC-guard on lockfile.
- **verification commands:** `CI=1 npx vitest run tests/unit/report-licenses*.test.ts`
- **conflict notes:** serialize after `1103`.

### q-mp-1105 · Scripts: `classifyLicense` review CDDL long prose (+ optional MS-RL)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-poste740`)
- **depends-on:** `1104` lightly; tip-owner skim for MS-RL
- **series:** script-tooling
- **verdict:** **HOLD-CHECK** — CDDL prose is a clear false `ok`; bundling `MS-RL` / Microsoft Reciprocal is a small deny-list policy call
- **CI / package.json callers:** `package.json` → `report:licenses`
- **target files:** `scripts/report-licenses.mjs`; helpers tests; optional one-line docs note
- **measured baseline:** `Common Development and Distribution License` → **`ok`** (vs `CDDL-1.1` copyleft_or_review); `MS-RL` / `Microsoft Reciprocal License` → **`ok`**.
- **acceptance criteria:** CDDL long prose → `copyleft_or_review`; tip-owner chooses MS-RL → copyleft_or_review vs leave-ok with docs; HC-guard on lockfile.
- **verification commands:** `CI=1 npx vitest run tests/unit/report-licenses*.test.ts`
- **conflict notes:** tip-owner skim for MS-RL; leave `1081` Elastic/PolyForm alone.
- **screen:** HOLD-CHECK — MS-RL policy slice; CDDL prose fix is otherwise SAFE if split.

### q-mp-1106 · Scripts: `summarizeKnip` must not throw when `issues` is a non-array object

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-poste740`)
- **depends-on:** none (leave open `#1297`/`1036` baseline schema alone)
- **series:** script-tooling
- **verdict:** **SAFE** — defensive parse; knip JSON reporter uses `issues: []`, but object shape throws mid-report
- **CI / package.json callers:** `package.json` → `report:knip`; `.github/workflows/ci.yml` → report-only `knip` job
- **target files:** `scripts/report-knip.mjs` (`summarizeKnip`); hermetic unit
- **measured baseline:** `summarizeKnip({issues:[{exports:[…]}]})` works; `summarizeKnip({issues:{exports:[…]}})` → **`TypeError: object is not iterable`**.
- **acceptance criteria:** Non-array `issues` yields zeroed/stable metrics (or explicit schema error object) **without throw**; array shape unchanged; `--json` path never crashes the process on bad shape.
- **verification commands:** `CI=1 npx vitest run tests/unit/*knip*.test.ts` (or new hermetic) ; `npm run report:knip -- --json`
- **conflict notes:** not baseline incomplete/corrupt (`1036`).

### q-mp-1107 · Scripts: demote dead exports in `render-perf-mode.mjs`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 dead-code
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-poste740`)
- **depends-on:** none
- **series:** dead-export-demote
- **verdict:** **SAFE** — strictly zero external importers; keep as module-locals
- **CI / package.json callers:** `package.json` → `perf:runtime` / render mode (behavior unchanged)
- **target files:** `scripts/render-perf-mode.mjs` (`TABLET_VIEWPORT`, `enterHoverPhase`, `renderReportPaths` — demote `export`); update any local references only
- **measured baseline:** `rg` across `scripts/` + `tests/` shows **zero** importers outside the defining file for those three names; cli-help / measureTTI tests import other exports only; `runtime-perf.mjs` imports measure/setup helpers, not these three.
- **acceptance criteria:** Symbols remain usable inside the module; no longer named exports; `npm run report:knip` unusedExports does not grow; no behavior change to render-perf measurements.
- **verification commands:** `rg -n 'TABLET_VIEWPORT|enterHoverPhase|renderReportPaths' scripts tests` ; `CI=1 npx vitest run tests/unit/render-perf-mode*.test.ts` ; `npm run report:knip -- --json`
- **conflict notes:** not knip product LEAVE exports (`cancelFabAiRequests` / storage barrel).

### q-mp-1108 · Tests: profile/trim `state-roundtrip-fuzz` wall (~15.5s)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 test-hygiene
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-poste740`)
- **depends-on:** none (leave an `1071` engine-property alone)
- **series:** test-speed
- **verdict:** **SAFE** — wall-time only; not AI / cli-help / seat-handoff families
- **CI / package.json callers:** `npm run test:unit` / CI `unit`
- **target files:** `tests/unit/state-roundtrip-fuzz.test.ts` (+ `tests/unit/helpers/state-roundtrip-games.ts` only if needed for shared setup)
- **measured baseline:** Local `CI=1 npx vitest run tests/unit/state-roundtrip-fuzz.test.ts` → **Duration ~15.5s** (22 tests; tests ~14.9s).
- **acceptance criteria:** Keep coverage of all registered games’ round-trip properties; Duration **&lt;8s** locally under `CI=1` (or ≥1.8× faster) via leaner seeds / shared setup / shard-by-game files — **no** product rules/AI changes; no fake-clock of AI timing.
- **verification commands:** `CI=1 npx vitest run tests/unit/state-roundtrip-fuzz.test.ts` (and any new shards)
- **conflict notes:** not AI shard speedups; not engine-property (`1071`); not folded seat-handoff (`1096`).

### q-mp-1109 · Docs: remove intentional broken titled-link example from `backlog-2026-10-11ao.md`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs-accuracy
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-poste740`)
- **depends-on:** none (leave folded `#1307`/`1095` resolver alone)
- **series:** docs-accuracy
- **verdict:** **SAFE** — docs-only; stops `check:dev-docs` reporting a self-inflicted broken md link
- **CI / package.json callers:** `package.json` → `check:dev-docs` (report-only)
- **target files:** `docs/dev/backlog-2026-10-11ao.md` (measured-baseline / acceptance prose that embeds a titled markdown href (`path.md` plus optional `"title"`) as a live markdown link)
- **measured baseline:** `npm run check:dev-docs` → `problems: 2` including `[broken-md-link] docs/dev/backlog-2026-10-11ao.md: path.md "title" -> docs/dev/path.md` (title strip from folded `1095` works; target still missing). Intentional `no-such-game` missing-path negative example stays.
- **acceptance criteria:** No live markdown link to missing `path.md`; prose can keep a fenced/code-span example; `check:dev-docs` broken-md-link count drops by 1; no tip-name / count-cell edits.
- **verification commands:** `npm run check:dev-docs` ; `rg -n 'path\\.md' docs/dev/backlog-2026-10-11ao.md`
- **conflict notes:** not resolver logic (`1095`); not renamed backlog paths (`1072`).

### q-mp-1110 · Scripts: demote unused internal helpers in `check-emit-identity.mjs` (export surface only)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 dead-code
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-poste740`)
- **depends-on:** tip-owner skim (keep testable surface for hermetic units)
- **series:** dead-export-demote
- **verdict:** **HOLD-CHECK** — several exports (`gitShow`, `readWorkingTree`, `unifiedDiff`, `defaultAiTouchedFiles`, `runEmitIdentityCheck`) have zero external importers today, but tests may want them later; tip-owner chooses which to demote vs keep for hermetic coverage
- **CI / package.json callers:** `package.json` → `check:emit-identity`
- **target files:** `scripts/check-emit-identity.mjs`; optionally adjust `tests/unit/check-emit-identity.test.ts` if a kept export moves
- **measured baseline:** `rg` shows no importers outside the defining file for `gitShow` / `readWorkingTree` / `unifiedDiff` / `defaultAiTouchedFiles` / `runEmitIdentityCheck`; tests import `stripCommentsAndCollapseWhitespace` / `compareFileEmit` / `parseArgs` only.
- **acceptance criteria:** Tip-owner-approved demote set becomes non-exported; remaining public API + live `check:emit-identity` behavior unchanged; unit suite green.
- **verification commands:** `CI=1 npx vitest run tests/unit/check-emit-identity*.test.ts` ; `npm run check:emit-identity -- --help`
- **conflict notes:** tip-owner skim; do not retarget merge-base tip.
- **screen:** HOLD-CHECK — export-surface policy for emit-identity helpers.

### q-mp-1111 · Docs: `scripts/check-build.mjs` header stop claiming Always exits 0

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs-accuracy
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-poste740`)
- **depends-on:** none (serialize lightly with `1098`/`1099`; leave folded `#1299`/`1094` doc cheat sheet alone)
- **series:** docs-accuracy
- **verdict:** **SAFE** — comment-only in script banner; behavior unchanged
- **CI / package.json callers:** n/a (comment); script is `package.json` → `check:build`
- **target files:** `scripts/check-build.mjs` (file header near “Always exits 0”)
- **measured baseline:** Header L13 still says `Always exits 0 (report-only) on the default path`. Live `node scripts/check-build.mjs --wat` → Unknown flag, exit **2**. Doc cheat sheet already fixed by folded `1094`.
- **acceptance criteria:** Banner matches live exit semantics (usage/unknown → non-zero; default report-only path exit 0); no logic change.
- **verification commands:** `rg -n 'Always exits 0|exit 2' scripts/check-build.mjs` ; `node scripts/check-build.mjs --wat ; echo $?`
- **conflict notes:** not `1094` docs path; serialize lightly with precache tickets on same file.

### q-mp-1112 · Tests: trim `engine-property-invariants` wall without weakening coverage (follow `1071`)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 test-hygiene
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-poste740`)
- **depends-on:** leave prior `1071` as owner if still open; **only** take this id if `1071` is already folded/abandoned — otherwise **do not start** (use `1071`)
- **series:** test-speed
- **verdict:** **SAFE** — wall-time only; reserved sibling if `1071` lands incomplete
- **CI / package.json callers:** `npm run test:unit` / CI `unit`
- **target files:** `tests/unit/engine-property-invariants.test.ts` (+ helper)
- **measured baseline:** Tip `a6e331d5`: `CI=1 npx vitest run tests/unit/engine-property-invariants.test.ts` → **Duration ~6.66s** (32 tests). Prior an `1071` targeted ~6.3s trim — leave that id first.
- **acceptance criteria:** Same as `1071` if still needed after tip remeasure: keep coverage; Duration **&lt;4s** or ≥1.5× faster; no product engine changes.
- **verification commands:** `CI=1 npx vitest run tests/unit/engine-property-invariants.test.ts`
- **conflict notes:** **prefer `1071`**; this id exists only to avoid a gap if `1071` is closed without landing a trim.

### q-mp-1113 · Docs: refresh visual-baseline triage against alpha/`poste740` CI (diagnose only)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 docs-accuracy
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-poste740`)
- **depends-on:** tip-owner / Andrew for any later PNG refresh (`1050`); leave ao `1093` with `contained`
- **series:** visual-diagnose
- **verdict:** **HOLD-CHECK** — diagnose-only; **do not** run `test:e2e:visual:update` or edit baselines/product UI
- **CI / package.json callers:** `package.json` → `test:e2e:visual`; `.github/workflows/ci.yml` → report-only job `visual-baseline`
- **target files:** `docs/dev/q-mp-055-visual-baseline-triage.md` (add alpha/`poste740` evidence block: run `38114521587`, confirm still **42 failed**)
- **measured baseline:** Alpha CI `38114521587` visual-baseline: **42 failed** (42 tests run); job conclusion success; “Surface report-only result” step success. Matches prior triage shape (EXPECTED restore / REGRESSION suspects).
- **acceptance criteria:** Triage doc cites current alpha/tip CI run; restates REGRESSION-first eyeball order; explicitly defers PNG refresh to `1050`; **no** snapshot update, **no** `src/` edits.
- **verification commands:** `rg -n '38114521587|42 failed|1050' docs/dev/q-mp-055-visual-baseline-triage.md`
- **conflict notes:** leave `1050` + ao `1093` alone (this is a newer evidence stamp only).
- **screen:** HOLD-CHECK — visual baseline ownership (diagnose only).

### q-mp-1114 · Docs: clarify `check:dev-docs` intentional negative-example path in af backlog

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs-accuracy
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-poste740`)
- **depends-on:** none
- **series:** docs-accuracy
- **verdict:** **SAFE** — docs-only labeling of the remaining missing-path hit
- **CI / package.json callers:** `package.json` → `check:dev-docs`
- **target files:** `docs/dev/backlog-2026-10-10af.md` (near the intentional `no-such-game` rules path — keep as af’s labeled missing-path negative example; do not invent a real game tree) and/or a one-line note in the absent check-dev-doc-links doc under docs/dev/ if that page exists and already describes negatives (it does not — do not invent that .md path)
- **measured baseline:** After `1109`, `check:dev-docs` should still report exactly **1** `missing-path` for the intentional `no-such-game` example in `backlog-2026-10-10af.md`.
- **acceptance criteria:** Negative example is clearly marked as intentional in-doc so humans do not “fix” it; checker behavior unchanged; no inventing real paths.
- **verification commands:** `npm run check:dev-docs` ; `rg -n 'no-such-game|intentional' docs/dev/backlog-2026-10-10af.md`
- **conflict notes:** not resolver title strip (`1095`); not ao titled-link cleanup (`1109`).

## Verdict summary

| Id | Verdict | Title (short) |
| --- | --- | --- |
| `q-mp-1097` | **SAFE** | check-workflows: YAML 1.1 `yes`/`on` cancel+persist |
| `q-mp-1098` | **SAFE** | parsePrecacheManifest: trailing commas |
| `q-mp-1099` | **SAFE** | parsePrecacheManifest: spaced bare keys/colons |
| `q-mp-1100` | **SAFE** | validateIndexHtml: apple-mobile content-before-name |
| `q-mp-1101` | **SAFE** | validateManifest: case-insensitive theme hex |
| `q-mp-1102` | **SAFE** | classifyLicense: `Custom` / `Custom: URL` → unknown |
| `q-mp-1103` | **SAFE** | classifyLicense: CPL / Common Public License |
| `q-mp-1104` | **SAFE** | classifyLicense: Eclipse Public License prose |
| `q-mp-1105` | **HOLD-CHECK** | classifyLicense: CDDL prose (+ optional MS-RL) |
| `q-mp-1106` | **SAFE** | summarizeKnip: non-array `issues` must not throw |
| `q-mp-1107` | **SAFE** | demote render-perf-mode dead exports |
| `q-mp-1108` | **SAFE** | speed state-roundtrip-fuzz (~15.5s) |
| `q-mp-1109` | **SAFE** | docs: drop ao live titled-link to missing path.md |
| `q-mp-1110` | **HOLD-CHECK** | demote emit-identity internal exports (tip-owner set) |
| `q-mp-1111` | **SAFE** | check-build banner: not always exit 0 |
| `q-mp-1112` | **SAFE** | engine-property trim sibling (prefer `1071`) |
| `q-mp-1113` | **HOLD-CHECK** | visual-baseline triage refresh (diagnose only) |
| `q-mp-1114` | **SAFE** | docs: label intentional no-such-game missing-path |

**Screened HOLD-CHECK (3):** `1105`, `1110`, `1113` — tip-owner should skim before fold (MS-RL policy; emit-identity export surface; visual diagnose).  
**No HOLD** product tickets queued (AI shard speedups / board-3d / rules / copy left out of scope).

## Out of scope / not used here

Already claimed / undrafted / HOLD / no headroom / prompt-skipped families: void/nnnull/nullish successors, eqeqeq product clear (`fiar/rules.ts` HOLD), lint-buckets eqeqeq probe, optional-chain product clears, knip demote / unusedTypes baseline drop, wiki **count** remasure, tip-name pointers (done on tip), UI coverage rounds, soft-fail characterizations, mutation-audit **waves**, board-3d **src** / **mp3d e2e** wait clears, harness shards, demo coverage, page-ready / double-rAF / artifact-dir / mountPair / npm aliases / `--help`/`--dry-run`/argv / empty-input / lib main-entry / cli-help spawn speedups (rounds 34–41), deep-playtest `waitForTimeout`, overnight mountPair/router batches, round-31…41 tickets through `q-mp-1096`, CI `e2e-cross-browser` yaml named script (`800`), dismissOwl deep-playtest (`879`), stars-bars / nav-away mid-AI / memory-leak / runtime-perf / webkit-offline / probe-offline **wait** clears (prior HOLD/skip), emit-identity wave5 merge-base tip retarget (tip-owner HOLD-CHECK), Queens & Guards product, AI timing / Hex Hard 450ms / Stars & Bars history cap, AI determinism/quality shard wall-time cuts (HOLD), dead-code Rank-2 yes deletes (live **0**), `cancelFabAiRequests` knip LEAVE (AI HOLD), visual-baseline PNG refresh (`1050`), canvas-dpr WebKit skip policy (`1051`), menu quote/query (`1088`), boundaries inline type (`1089`), permissions read-all (`1091`), owl flake (`1092`), ao visual triage (`1093`), proprietary/source-available license policy (`1081`).

**Could not honestly fill to 25** without filler (more `--help`/`--dry-run`/argv/empty-input theater, cli-help spawn speedups, mountPair adoptions, npm aliases, tip-name pointer stamps, knip baseline remasure, Rank-3 demote theater, AI harness speed theater, wiki count cells, or HOLD board-3d/mp3d wait clears). Stopped at **18**.
