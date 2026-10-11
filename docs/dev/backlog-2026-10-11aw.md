# Engineering backlog — 2026-10-11aw (tip refill after post99ba cut / round-49)

**Task id:** `q-mp-090aw`  
**Role:** worker (report-only)  
**Tip audited:** `cursor/mp-tip-post99ba` @ `30fc1b25` (full `30fc1b2523db54b75a6b1a28230df439f5cac797`; tip cut from `alpha` @ `99ba642f` after `#1367` fold of post2590; living pointers set by `q-mp-026ac`; tip-owner already folded round-48 SAFE implementers `#1383`–`#1399` into this tip through `30fc1b25`)  
**Depends on:** tip `cursor/mp-tip-post99ba` @ `30fc1b25`. Round-48 backlog (`q-mp-090av` / open `#1382` on old tip `post2590`, ids `q-mp-1246`…`1270`) — leave with `contained`; tip already carries the folded fixes. Round-47 backlog (`q-mp-090au` / open `#1364` on `post6066`, ids `q-mp-1222`…`1245`) — leave with `contained`. Tip HEAD continues to move as tip-owner folds green drafts — **rebase onto latest tip before opening worker PRs**.

## Purpose

The tip `cursor/mp-tip-post99ba` @ `30fc1b25` measures unit files **3432**; Chromium e2e **25** files / **249** cases; knip unusedExports **3** (LEAVE) / unusedTypes **29** / unusedFiles **0**; dead-code Rank-2 yes **0**. This doc lists **21 new** concrete engineering tasks (`q-mp-1271` … `q-mp-1291`) mined from the **live tip tree**, checked against prior refills through `q-mp-1270` (av on post2590 + tip-folded implementers `#1383`–`#1399`), au/at/as/ar/aq/ap/ao, and against the full open draft PR list (post99ba leftovers `#1383`–`#1399` if still open, post2590 `#1365`–`#1382`, post6066 `#1350`–`#1364`, older stacks). It is the **only** deliverable of `q-mp-090aw`.

**Honest count:** Only **21** tasks — not padded to 25. Id range starts at `q-mp-1271` per round-49 brief. Earlier reserved gaps (`1221`, `1192`–`1196`, `1164`–`1171`, `1138`–`1146`, etc.) stay unused. Round-48 already claimed (and tip-folded) shapeLh out-of-range, typePhase2 nested totals, mergeHistory null-overwrite, symbolInSource default/namespace, PATH_RE `.github/`, offline classify game chunks + worker parity, novelCount / size:check catch, lint-buckets non-numeric headroom, flattenKnip **files** null, verifyCandidate hex⊂hex-a-gone **dynamicHit**, scanTestHelpers export-as, deep-playtest end regexes, PAR55_QUICK, offline waitForUrl 404 + PROBE_BROWSERS trim, artifact-dir trim, frac-fact difficulty globs, phase2-export missing outOfScopeErrors, README CI soft/report-only, lint:ratchet 12-rule docs, eslint-off inventory, tip-vs-alpha PLAYER_FACING_COPY — **do not** re-queue `1246`–`1270` (leave `#1382` + tip drafts `#1383`–`#1399` with `contained`). This refill **does not** re-queue exhausted families from the round-49 brief: `--help`/argv/empty-input theater, cli-help spawn speedups, mountPair, npm aliases, tip-name pointers, knip remeasure/baselines, AI harness speed, license-classifier prose, pwa-manifest-contract, check-pwa-manifest, check-workflows parsing, precache parser, check-build asset/precache audits, menu-critical-ref, md-link regex, check-copy-pins, summarizeKnip/diffMetrics, classifyVitestRunResult, flake-rate loops, heap/memory-leak deltas, prototype-restore after direct assigns, engine-coverage-rank, report-coverage-map, ratchet-history **ceilings**, env-number, render-perf/runtime-perf, mobile-audit, console-sweep, mutation-report **games**, ratchet-history **mergeHistory**, check-dev-doc-links **symbolInSource / `.github` PATH_RE**, probe-offline **classify**, check-bundle-budgets exit codes, report-dead-code **files/dynamicHit/export-as**, deep-playtest **end regexes**, webkit-offline-probe, artifact-dir, README CI posture/lint-ratchet docs. Nav-away 8-game omission stays prior id `1070`. Emit-identity export demotes stay prior id `1110`. Boundaries HOLD-CHECK gaps `1201`–`1204`/`1220` and size soft-gate `1214` stay prior ids — leave with `contained`.

**Fresh payoffs on this tip (re-measured @ `30fc1b25` after av folds):** **`PATH_RE` still misses root backtick paths** (`` `package.json` `` / `` `vitest.config.ts` `` / `` `vite.config.ts` `` / `` `index.html` `` → no match; `.github/` already fixed by folded `1250`), **`docs/dev/testing-layers-2026-10-09.md` claims all named playtests use `PLAYTEST_BASE_URL`** while ramrod/stars/sum/par-55/fraction read `PLAYTEST_BASE` and hex-deep-probe reads `HEX_PLAYTEST_URL`, **`testGlobsForGame('hex')` overnight/burn globs match `hex-a-gone` filenames** (regex; no live hex-a-gone overnight hits today but pattern is wrong), **`flattenKnip` still throws on null `issues` / `exports` / `types` / `dependencies` / `devDependencies` entries** (files-null fixed by `1255`), **`check-lint-ratchet` and `report-lint-buckets` race on shared `.eslint.ratchet.probe.config.js`**, **fab-a-diffy `PLAYTEST_GAMES_PER` via bare `Number()`** (`'nope'`→NaN→0 games; `'0'`→0), **`PLAYTEST_SKIP_EXTRA_SHOTS='0'|'false'` still skips**, **`PLAYTEST_ONLY_VP='0'` / `PLAYTEST_ONLY_DIFF='false'` invent invalid filters**, **fraction-pinball `PLAYTEST_GAMES` same Number NaN/`0` trap**, **`gotoGame` with trailing-slash `baseURL` → `//#/game/…`**, **`buildCycloneDxBom` empty `version` → `bom-ref` `pkg:npm/x@`**, **invalid integrity `sha256-@@@@` → hash `content: ''`**, **`optional:true` + `production:true` → CycloneDX `scope: 'required'`**, **`npmPackageNameFromLockPath('node_modules/lodash/')` → `lodash/`**, **`nav-away-sweep` hardcodes base and never dismisses owl**, **`check-perf` `waitForUrl` still treats HTTP 404 as ready** (offline probes fixed by `1261`; check-perf residual), **`check-emit-identity --minify` false-DIFF on type-annotated vs plain identical raw emit** (esbuild rename instability), **`report-ratchet-history` `LINT_RULE_KEYS` tracks only 4 of 12 live ceilings**, **`CALIBRATION_GAMES=abc` → NaN → 0 matchups**, and **queens-guards fuzz seed-A case ~8.1s wall** (shard candidate).

**Preference:** SAFE, mutually independent **scripts/** wrong-results fixes, **docs-only** accuracy, or **tests-only** flake hygiene / wall trim. **Do not** queue another remasure of CI wall, bundle headroom, lint-bucket snapshot, copy-pins findings totals, boundaries/PWA thresholds, board-3d layout inventory, CI permissions, tip-pointer **count** stamps, open-draft triage, emit-identity inventory remasure, knip unusedTypes baseline drop, Rank-3 demote theater, dead-CSS Rank-1 rescan, wiki **count** cells, more cli-help spawn speedups, or more license-classifier / pwa-manifest-contract / workflows-bool / summarizeKnip / md-link / precache / menu-critical / copy-pins / flake-rate / classifyVitest / heap / engine-coverage / coverage-map / env-number / render-perf / runtime-perf / mobile-audit / console-sweep / mutation-games theater. Anything in rules / AI / scoring / legal-move paths, player-facing copy, tutorials product edits, timing, Stars & Bars history cap, Hex Hard 450ms, board-3d **src** / **mp3d e2e**, or CI permissions widening is **HOLD**. **Do not** change fake-clock semantics. **Do not** edit `*/rules.ts`.

**Lint policy for this refill:** **no** new ceiling-key clears. Boundaries / size soft-gate schema tickets stay prior HOLD-CHECK ids (`1201`–`1204`/`1214`/`1220`) — do not sibling. Ratchet-history **ceiling coerce** tickets stay prior `1230`/`1231`; mergeHistory / typePhase2 stay prior `1247`/`1248` — this refill only queues **chart coverage** of the other 8 ceiling keys (`1289`).

## Duplicate check (do not re-queue)

| Topic family                                                                                                                                                              | Why skipped                                                                                                                                     |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| round-48 av `1246`–`1270` (+ open `#1382` on post2590; tip drafts `#1383`–`#1399`; tip-folded)                                                                           | leave with `contained`; this refill’s tickets are **new** surfaces only                                                                         |
| round-47 au `1222`–`1245` / at `1197`–`1220` / as `1172`–`1191` / ar–ao residuals                                                                                          | leave with `contained`                                                                                                                          |
| page-ready / double-rAF / artifact-dir **adoptions** / mountPair / npm aliases / `--help`/`--dry-run`/argv / lib main-entry / empty-input / cli-help spawn                 | prompt hard-skip (`gotoGame` **trailing-slash URL** is a new wrong-result, not an adoption)                                                     |
| license-classifier / pwa-manifest-**contract** / check-pwa-manifest / check-workflows / precache parser / menu-critical-ref / md-link regex / check-copy-pins / summarizeKnip | prompt hard-skip (CycloneDX **bom-ref/hash/scope** shape bugs are new non-classifier surfaces)                                                 |
| classifyVitestRunResult / flake-rate loops / heap-memory deltas / prototype-restore after direct assigns                                                                  | prompt hard-skip                                                                                                                                |
| engine-coverage-rank / report-coverage-map / ratchet-history **ceilings coerce** / mergeHistory / env-number / render-perf / runtime-perf / mobile-audit / console-sweep / mutation-report games | prompt hard-skip                                                                                                      |
| check-build asset/precache / deep-playtest end regexes / webkit-offline / artifact-dir / probe classify / bundle exit / dead-code files+dynamicHit+export-as / PATH_RE `.github` / symbolInSource | folded av — leave prior ids                                                                                           |
| nav-away 8-game omission (`1070`) / emit-identity export demotes (`1110`) / dismissOwl deep-playtest (`879`)                                                             | leave prior ids; this refill’s nav-away tickets are BASE_URL + owl for the **sweep**, not game-list / deep-playtest                             |
| tip-name pointers / wiki **count** remasure / knip unusedTypes baseline drop / Rank-3 demotes / AI harness speed                                                          | prompt hard-skip / HOLD                                                                                                                         |
| AI-timing / Hex Hard 450ms / history-cap / rules.ts / copy / scoring / CI permissions                                                                                     | hard-rule HOLD                                                                                                                                  |
| boundaries stripComments/typeOnly/classify-tutorial/DOM_IDENT/template/UI_REEXPORT (`1201`–`1204`/`1220`)                                                                | leave prior HOLD-CHECK — do not sibling                                                                                                         |

Also skipped: Merom / Sullivan / data-center / grants / nonprofit; `pappas-infrastructure`; meromhouse agents; any CI `permissions` widening. No `memory/` files.

## Stale queue re-check (live tip `30fc1b25`)

| Id                                 | Title (short)                           | Verdict                        | Evidence @ `30fc1b25`                                              |
| ---------------------------------- | --------------------------------------- | ------------------------------ | ------------------------------------------------------------------ |
| `q-mp-090av` / `#1382`             | round-48 backlog                        | **open on old tip `post2590`** | This refill starts at `1271`; do not re-queue `1246`–`1270`.       |
| `#1383`–`#1399`                    | av SAFE implementers into `post99ba`    | **open or tip-folded**         | Leave with `contained`; tip log already has fix commits.           |
| `q-mp-090au` / `#1364`             | round-47 backlog                        | **open on `post6066`**         | leave with `contained`.                                            |
| `q-mp-090at` / `#1349`             | round-46 backlog                        | **open on `postc75f`**         | leave with `contained`.                                            |
| `q-mp-1246`…`1270`                 | av gaps                                 | **tip-folded or in-flight**    | leave prior ids; do not sibling.                                   |
| `q-mp-1201`…`1204` / `1220` / `1214` | boundaries + size soft-gate           | **still-valid; no tip PR yet** | Leave prior ids — **do not** re-queue.                             |
| `q-mp-1070`                        | nav-away expand/document 8 games        | **still-valid; no open PR**    | Leave prior id — **do not** re-queue.                              |
| `q-mp-1110`                        | emit-identity demote exports            | **still-valid HOLD-CHECK**     | Leave prior id; this refill’s minify ticket is distinct.           |
| `q-mp-800` / `879` / `1050`        | cross-browser / dismissOwl / visual     | **still-valid**                | Leave prior ids (`879` ≠ nav-away-sweep owl).                      |
| Dead-code Rank-2 yes               | live dry-run                            | **0 yes**                      | No new Rank-2 demote queued.                                       |
| knip unusedExports                 | live `--json`                           | **3 LEAVE**                    | No SAFE demotes (AI / settings barrel).                            |

## Shared-file conflict flags

| Shared file                                                              | Conflicting new ids                                                         |
| ------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| `scripts/check-dev-doc-links.mjs`                                        | `1271` only; leave folded `1249`/`1250` alone                               |
| `docs/dev/testing-layers-2026-10-09.md`                                  | `1272` only                                                                 |
| `scripts/mutation-report.mjs`                                            | `1273` only; leave folded `1264` / open `#1397` alone                       |
| `scripts/report-dead-code.mjs`                                           | `1274` only; leave folded `1255`–`1257` alone                               |
| `scripts/check-lint-ratchet.mjs` + `scripts/report-lint-buckets.mjs`     | `1275` (shared probe path) — one PR or serialize; **no** ceiling / gate edits |
| `tests/playtest/fab-a-diffy-deep.mjs`                                    | `1276` + `1277` + `1278` — serialize                                        |
| `docs/playtest/fraction-pinball-deep-playtest.mjs`                       | `1279` only; leave docs env matrix to `1272`                                |
| `scripts/lib/page-ready.mjs`                                             | `1280` only; **no** mountPair / adopter rewires                             |
| `scripts/report-licenses.mjs`                                            | `1281` + `1282` + `1283` + `1284` — serialize; **no** classifier prose      |
| `scripts/nav-away-sweep.mjs`                                             | `1285` + `1286` — serialize; leave `1070` alone                             |
| `scripts/check-perf.mjs`                                                 | `1287` only; leave folded offline `1261` alone                              |
| `scripts/check-emit-identity.mjs`                                        | `1288` only; leave `1110` demotes alone                                     |
| `scripts/report-ratchet-history.mjs`                                     | `1289` only; leave folded `1247`/`1248` + au `1230`/`1231` alone            |
| `scripts/run-ai-calibration.ts`                                          | `1290` only; **no** AI search/scoring/timing edits                          |
| `tests/unit/state-roundtrip-fuzz-queens-a.test.ts` (+ siblings if split) | `1291` only                                                                 |

**Parallel-friendly:** `1271`, `1272`, `1273`, `1274`, `1275`, `1276`, `1279`, `1280`, `1281`, `1285`, `1287`, `1288`, `1289`, `1290`, `1291`. Serialize `1276`→`1277`→`1278`; `1281`→`1282`→`1283`→`1284`; `1285`→`1286`.

## Live tip measurements (evidence snapshot @ `30fc1b25`)

```text
$ git rev-parse HEAD
  30fc1b2523db54b75a6b1a28230df439f5cac797

$ git branch --show-current
  cursor/mp-tip-post99ba (audited) / cursor/backlog-2026-10-11aw-2f2a (this PR)

$ find tests/unit \( -name '*.test.ts' -o -name '*.spec.ts' \) ! -path '*/_tokenmaxx_archive/*' | wc -l
  3432

$ npm run test:e2e:chromium -- --list
  Total: 249 tests in 25 files

$ npm run report:knip -- --json
  unusedExports: 3  unusedTypes: 29  unusedFiles: 0
  (NOTICE unusedTypes 36→29 shrink vs committed baseline 36 — baseline write NOT queued)

$ npm run report:dead-code -- --dry-run
  Safe-to-remove yes: 0

$ PATH_RE on '`.github/workflows/ci.yml`' → match (folded 1250)
$ PATH_RE on '`package.json`' / '`vitest.config.ts`' / '`vite.config.ts`' / '`index.html`' → []
$ docs cite counts: package.json 63, vitest.config.ts 50, eslint.config.js 15, knip.json 13,
  playwright.config.ts 12, index.html 12, tsconfig.ratchet.json 11, vite.config.ts 5, AGENTS.md 29

$ testing-layers L107: "named scripts follow the same PLAYTEST_BASE_URL convention"
$ calla → PLAYTEST_BASE_URL; ramrod/stars/sum/par-55/fraction → PLAYTEST_BASE; hex-deep-probe → HEX_PLAYTEST_URL
$ docs L118–119 set PLAYTEST_BASE_URL=… for hex-deep-probe + fraction-pinball (ignored by harnesses)

$ overnight-wave*-hex-*rules*.test.ts matches overnight-wave54-hex-a-gone-rules-x.test.ts → true
$ burn-wave*-hex*rules*.test.ts matches burn-wave41-hex-a-gone-rules.test.ts → true
$ expandExistingTests(testGlobsForGame('hex')) live hex-a-gone hits: 0 (no such files today)

$ flattenKnip({ issues: [null] }) → TypeError reading 'file'
$ flattenKnip({ issues: [{ file:'a.ts', exports:[null] }] }) → TypeError reading 'name'
$ flattenKnip({ issues: [{ file:'a.ts', types:[null] }] }) → TypeError reading 'name'
$ flattenKnip({ files: [null] }) → []  # 1255 fixed

$ check-lint-ratchet.mjs + report-lint-buckets.mjs both write ROOT/.eslint.ratchet.probe.config.js

$ Number('nope' || 10) → NaN; for (g=0; g<NaN; g++) → 0 iters
$ Number('0' || 10) → 0
$ PLAYTEST_SKIP_EXTRA_SHOTS='0' → truthy → skip extra shots
$ PLAYTEST_ONLY_VP='0' → VIEWPORTS = { '0': undefined }
$ PLAYTEST_ONLY_DIFF='false' → DIFFICULTIES = ['false']

$ gotoGame baseURL='http://127.0.0.1:5173/' → http://127.0.0.1:5173//#/game/hex

$ buildCycloneDxBom empty version → bom-ref "pkg:npm/x@" (purl correctly omits @)
$ integrity sha256-@@@@ → hashes: [{ alg: 'SHA-256', content: '' }]
$ optional:true + production:true → scope: 'required'
$ npmPackageNameFromLockPath('node_modules/lodash/') → 'lodash/'
$ npmPackageNameFromLockPath('node_modules/@scope/') → '@scope/'

$ nav-away-sweep: const BASE = 'http://127.0.0.1:5173' (ignores BASE_URL)
$ nav-away-sweep: waitForGameReady then #new-game-btn click; no dismissOwl
$ console-sweep / mobile-audit: process.env.BASE_URL || …

$ check-perf waitForUrl: res.ok || res.status === 404  # still
$ offline-probe-ready waitForUrl: 2xx-only  # folded 1261

$ transpileToJs type-annotated vs plain, minify:false → equal
$ transpileToJs same, minify:true → "const e=1;export{e as x}" vs "const o=1;export{o as x}" → DIFF

$ LINT_RULE_KEYS keys: curly, voidExpression, nnnull, dupImports (4)
$ lint-ratchet-ceilings.json rules: 12 (adds radix, default-case, nullish, optional-chain,
  switch-exhaustiveness, no-shadow, eqeqeq, return-await)

$ CALIBRATION_GAMES=abc → Number → NaN → 0 matchup loops

$ CI=1 npx vitest run tests/unit/state-roundtrip-fuzz-queens-a.test.ts --reporter=verbose --maxWorkers=1
  → 1 test 8122ms / file 8.80s

$ Open drafts into cursor/mp-tip-post99ba at audit: #1383–#1399 (av implementers; tip-folded)
$ Round-48 backlog still open on post2590: #1382
```

Baselines also captured under `/opt/cursor/artifacts/q-mp-090aw-repros.log` … `q-mp-090aw-repros7.log`.

## New tasks

### q-mp-1271 · Scripts: `PATH_RE` include root config backtick paths

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post99ba`)
- **depends-on:** leave folded `1250` `.github/` alone
- **series:** script-tooling
- **verdict:** **SAFE** — dozens of docs cite root configs with zero path checks
- **CI / package.json callers:** `package.json` → `check:dev-docs` (report-only)
- **target files:** `scripts/check-dev-doc-links.mjs` (`PATH_RE`; allowlists if needed)
- **measured baseline:** `` `package.json` `` / `` `vitest.config.ts` `` / `` `vite.config.ts` `` / `` `index.html` `` → no match; `` `scripts/x.mjs` `` matches; `` `.github/workflows/ci.yml` `` matches (folded). Cite counts: package.json **63**, vitest.config.ts **50**, index.html **12**, …
- **acceptance criteria:** Root configs commonly cited in docs (at least `package.json`, `vitest.config.ts`, `vite.config.ts`, `eslint.config.js`, `knip.json`, `playwright.config.ts`, `tsconfig*.json`, `index.html`, `package-lock.json`, `AGENTS.md`, `CONTRIBUTING.md` — tip-owner may trim) are checked like `scripts/`/`docs/`; missing paths surface as `missing-path`; **no** md-link regex edits; `.github/` behavior unchanged.
- **verification commands:** hermetic `PATH_RE` tests; `npm run check:dev-docs`
- **conflict notes:** not folded `.github/` `1250`; not tip-name theater.
- **screen:** SAFE.

### q-mp-1272 · Docs: testing-layers `PLAYTEST_*` env names match harnesses

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post99ba`)
- **depends-on:** none
- **series:** docs-accuracy
- **verdict:** **SAFE** — copy-paste env lines are ignored by 4+ harnesses
- **CI / package.json callers:** none (docs); truth in `scripts/*deep-playtest.mjs` + `docs/playtest/*` + `tests/playtest/*`
- **target files:** `docs/dev/testing-layers-2026-10-09.md` (L107 claim + L116–119 examples)
- **measured baseline:** Doc claims “same `PLAYTEST_BASE_URL` convention”; live: calla/fab/star-track → `PLAYTEST_BASE_URL`; ramrod/stars/sum/par-55/fraction → `PLAYTEST_BASE`; hex-deep-probe → `HEX_PLAYTEST_URL`. L118–119 export the wrong name for hex + fraction.
- **acceptance criteria:** Doc states the actual env var per harness (or documents a single alias after a separate code ticket); example commands set a var the harness reads; no tip-name edits; no product copy.
- **verification commands:** `rg -n 'PLAYTEST_BASE|HEX_PLAYTEST' docs/dev/testing-layers-2026-10-09.md scripts/*deep* docs/playtest/*.mjs tests/playtest/*.mjs`
- **conflict notes:** not end-regex / PAR55_QUICK; docs-only unless tip-owner pairs a code alias ticket.
- **screen:** SAFE.

### q-mp-1273 · Scripts: `testGlobsForGame('hex')` must not match `hex-a-gone`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post99ba`)
- **depends-on:** leave folded `1256` verifyCandidate + `1264` frac-fact alone
- **series:** script-tooling
- **verdict:** **SAFE** — substring `hex` in overnight/burn globs pulls hex-a-gone suites when present
- **CI / package.json callers:** `package.json` → `mutation:report` (report-only)
- **target files:** `scripts/mutation-report.mjs` (`testGlobsForGame` hex branch / filter)
- **measured baseline:** glob `overnight-wave*-hex-*rules*.test.ts` matches `…-hex-a-gone-rules-…`; `burn-wave*-hex*rules*.test.ts` matches `…-hex-a-gone-…`. Live expand currently **0** hex-a-gone files (latent).
- **acceptance criteria:** Hex globs / post-filter exclude `hex-a-gone`; real hex overnight/burn/rules files remain; no mutation **games** list edits; no `*/rules.ts` logic edits.
- **verification commands:** hermetic glob/filter unit with fixture names; `rg -n 'hex-a-gone|overnight-wave\*-hex' scripts/mutation-report.mjs`
- **conflict notes:** not `1256` dynamicHit; not `1264` frac-fact difficulty.
- **screen:** SAFE.

### q-mp-1274 · Scripts: `flattenKnip` tolerate null `issues` / nested export arrays

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post99ba`)
- **depends-on:** leave folded `1255` files-null alone
- **series:** script-tooling
- **verdict:** **SAFE** — malformed knip `issues` aborts the whole inventory after files path was hardened
- **CI / package.json callers:** `package.json` → `report:dead-code` (report-only)
- **target files:** `scripts/report-dead-code.mjs` (`flattenKnip`)
- **measured baseline:** `issues: [null]` → TypeError `'file'`; `exports`/`types`/`dependencies`/`devDependencies: [null]` → TypeError `'name'`; `files: [null]` → `[]` (folded).
- **acceptance criteria:** Null/non-object issue rows and null nested symbol entries skipped (or schema error without throw); string/`{file}` + named export shapes unchanged; no knip baseline rewrite.
- **verification commands:** hermetic flatten unit; `npm run report:dead-code -- --dry-run`
- **conflict notes:** extension of `1255`, not a re-queue; not summarizeKnip.
- **screen:** SAFE.

### q-mp-1275 · Scripts: unique eslint probe config path (lint:ratchet ↔ lint-buckets)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post99ba`)
- **depends-on:** none; **do not** edit ceiling values or gate exit policy
- **series:** script-tooling
- **verdict:** **SAFE** — concurrent probe runs clobber / unlink the same root file mid-eslint
- **CI / package.json callers:** `package.json` → `lint:ratchet` (CI lint) + `report:lint-buckets` (report-only)
- **target files:** `scripts/check-lint-ratchet.mjs`, `scripts/report-lint-buckets.mjs` (`probeConfigPath`)
- **measured baseline:** both write/unlink `path.join(ROOT, '.eslint.ratchet.probe.config.js')`.
- **acceptance criteria:** Each run uses a unique temp probe path (pid/random under `os.tmpdir()` or similar) and always cleans up; probe source semantics unchanged; **no** ceiling JSON edits; **no** fail-open gate changes.
- **verification commands:** `rg -n 'eslint\\.ratchet\\.probe' scripts/check-lint-ratchet.mjs scripts/report-lint-buckets.mjs` ; hermetic path unit if exported
- **conflict notes:** not lint-buckets headroom `1254`; not CI gate fail-open HOLD-CHECK.
- **screen:** SAFE.

### q-mp-1276 · Scripts: fab-a-diffy `PLAYTEST_GAMES_PER` reject NaN / non-positive

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post99ba`)
- **depends-on:** none; serialize with `1277`/`1278`
- **series:** script-tooling
- **verdict:** **SAFE** — bad env silently runs 0 games
- **CI / package.json callers:** `tests/playtest/fab-a-diffy-deep.mjs` (local; not blocking CI)
- **target files:** `tests/playtest/fab-a-diffy-deep.mjs` (`GAMES_PER`)
- **measured baseline:** `Number(process.env.PLAYTEST_GAMES_PER || 10)`; `'nope'`→NaN→0 iters; `'0'`→0 (truthy string bypasses `|| 10`).
- **acceptance criteria:** Non-finite / non-positive / non-integer → usage error or fall back to default 10 (tip-owner chooses); valid positives unchanged; no `--help` theater.
- **verification commands:** hermetic env matrix; `rg -n 'PLAYTEST_GAMES_PER' tests/playtest/fab-a-diffy-deep.mjs`
- **conflict notes:** not shared `env-number` lib (`1234`); serialize with `1277`/`1278`.
- **screen:** SAFE.

### q-mp-1277 · Scripts: fab `PLAYTEST_SKIP_EXTRA_SHOTS` must not treat `'0'`/`'false'` as set

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post99ba`)
- **depends-on:** serialize after `1276`
- **series:** script-tooling
- **verdict:** **SAFE** — env disable strings still skip dedicated screenshots
- **CI / package.json callers:** `tests/playtest/fab-a-diffy-deep.mjs`
- **target files:** `tests/playtest/fab-a-diffy-deep.mjs` (`PLAYTEST_SKIP_EXTRA_SHOTS`)
- **measured baseline:** `if (!process.env.PLAYTEST_SKIP_EXTRA_SHOTS)` — any non-empty string skips; `'0'`/`'false'` skip incorrectly.
- **acceptance criteria:** Only clear truthy enables skip (`1`/`true`/`yes` — tip-owner chooses); `'0'`/`'false'`/`''`/unset run extra shots; no product screenshot content changes.
- **verification commands:** hermetic truth table; `rg -n 'PLAYTEST_SKIP_EXTRA_SHOTS' tests/playtest/fab-a-diffy-deep.mjs`
- **conflict notes:** same class as folded `1260` PAR55_QUICK but different flag/file.
- **screen:** SAFE.

### q-mp-1278 · Scripts: fab `PLAYTEST_ONLY_VP` / `PLAYTEST_ONLY_DIFF` validate known keys

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post99ba`)
- **depends-on:** serialize after `1277`
- **series:** script-tooling
- **verdict:** **SAFE** — `'0'`/`'false'` invent empty viewport / bogus difficulty clicks
- **CI / package.json callers:** `tests/playtest/fab-a-diffy-deep.mjs`
- **target files:** `tests/playtest/fab-a-diffy-deep.mjs` (`ONLY_VP` / `ONLY_DIFF`)
- **measured baseline:** `ONLY_VP='0'` → `{ '0': undefined }`; `ONLY_DIFF='false'` → `['false']` → clicks `.difficulty-btn.false`.
- **acceptance criteria:** Unknown / disable-looking values error or fall through to full defaults; known `desktop`/`tablet` + `easy`/`medium`/`hard` unchanged.
- **verification commands:** hermetic filter matrix
- **conflict notes:** serialize after `1277`; not Number NaN ticket `1276`.
- **screen:** SAFE.

### q-mp-1279 · Scripts: fraction-pinball `PLAYTEST_GAMES` reject NaN / non-positive

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post99ba`)
- **depends-on:** leave docs env naming to `1272`
- **series:** script-tooling
- **verdict:** **SAFE** — bad env → 0 games + `avgDurationMs: NaN`
- **CI / package.json callers:** `docs/playtest/fraction-pinball-deep-playtest.mjs` (local)
- **target files:** `docs/playtest/fraction-pinball-deep-playtest.mjs` (`GAMES_PER`)
- **measured baseline:** `Number(process.env.PLAYTEST_GAMES || 10)`; `'abc'`/`'false'`→NaN→0 iters; `'0'`→0; `Math.round(0/[].length)`→NaN summary.
- **acceptance criteria:** Non-finite / non-positive → usage error or default 10; valid positives unchanged; summary avoids NaN avg when zero games.
- **verification commands:** hermetic env matrix; `rg -n 'PLAYTEST_GAMES' docs/playtest/fraction-pinball-deep-playtest.mjs`
- **conflict notes:** sibling of fab `1276`, different file/env; not BASE docs `1272`.
- **screen:** SAFE.

### q-mp-1280 · Scripts: `gotoGame` join `baseURL` without double slash

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post99ba`)
- **depends-on:** none; **do not** adopt mountPair / rewire harness defaults
- **series:** script-tooling
- **verdict:** **SAFE** — trailing-slash bases navigate to `//#/game/…`
- **CI / package.json callers:** imported by `mobile-audit` / `runtime-perf` / `render-perf` / etc. via `scripts/lib/page-ready.mjs`
- **target files:** `scripts/lib/page-ready.mjs` (`gotoGame`)
- **measured baseline:** `` `${baseURL}/${q}#/game/${gameId}` `` with `baseURL='http://127.0.0.1:5173/'` → `http://127.0.0.1:5173//#/game/hex` (and `//?board3d=1#…`).
- **acceptance criteria:** Trailing slash on baseURL produces a single `/` before `?`/`#`; no-trailing-slash bases still work; board3d query unchanged; no wait/adoption theater.
- **verification commands:** hermetic URL builder unit; `rg -n 'gotoGame|baseURL' scripts/lib/page-ready.mjs`
- **conflict notes:** not page-ready **adoption** family; URL join only.
- **screen:** SAFE.

### q-mp-1281 · Scripts: CycloneDX `bom-ref` omit `@` when version empty

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post99ba`)
- **depends-on:** none; serialize with `1282`–`1284`; **no** license-classifier prose edits
- **series:** script-tooling
- **verdict:** **SAFE** — empty version green-washes invalid bom-refs while purl already omits `@`
- **CI / package.json callers:** `package.json` → `report:licenses` (report-only)
- **target files:** `scripts/report-licenses.mjs` (`buildCycloneDxBom`)
- **measured baseline:** `version: ''` → `bom-ref: "pkg:npm/x@"`; `purl: "pkg:npm/x"` (correct).
- **acceptance criteria:** `bom-ref` matches purl versioning rules (omit `@` when version empty/undefined); non-empty versions unchanged.
- **verification commands:** hermetic `buildCycloneDxBom` unit; existing `tests/unit/report-licenses-helpers.test.ts`
- **conflict notes:** not classifier prose; serialize with siblings.
- **screen:** SAFE.

### q-mp-1282 · Scripts: CycloneDX skip invalid / empty integrity hashes

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post99ba`)
- **depends-on:** serialize after `1281`
- **series:** script-tooling
- **verdict:** **SAFE** — `Buffer.from` invalid base64 does not throw → empty hash content emitted
- **CI / package.json callers:** `package.json` → `report:licenses`
- **target files:** `scripts/report-licenses.mjs` (`buildCycloneDxBom` integrity block)
- **measured baseline:** `integrity: 'sha256-@@@@'` → `hashes: [{ alg: 'SHA-256', content: '' }]`.
- **acceptance criteria:** Empty/non-hex/undecodable integrity → omit `hashes` (or schema error); valid sha\* integrities unchanged.
- **verification commands:** hermetic integrity matrix
- **conflict notes:** serialize after `1281`; not classifier.
- **screen:** SAFE.

### q-mp-1283 · Scripts: CycloneDX `scope` honor `optional` over production-only

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post99ba`)
- **depends-on:** serialize after `1282`
- **series:** script-tooling
- **verdict:** **SAFE** — optional prod deps are labeled `required`
- **CI / package.json callers:** `package.json` → `report:licenses`
- **target files:** `scripts/report-licenses.mjs` (`buildCycloneDxBom` `scope:`)
- **measured baseline:** `optional:true, production:true` → `scope: 'required'` (`pkg.production ? 'required' : 'optional'` ignores `optional`).
- **acceptance criteria:** Optional packages → `scope: 'optional'` (even if production); non-optional production stays `required`; property flags unchanged unless tip-owner aligns.
- **verification commands:** hermetic scope matrix
- **conflict notes:** serialize after `1282`; SBOM semantics only.
- **screen:** SAFE.

### q-mp-1284 · Scripts: `npmPackageNameFromLockPath` strip trailing `/`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post99ba`)
- **depends-on:** serialize after `1283`
- **series:** script-tooling
- **verdict:** **SAFE** — trailing slash pollutes package names and bom-refs
- **CI / package.json callers:** `package.json` → `report:licenses`
- **target files:** `scripts/report-licenses.mjs` (`npmPackageNameFromLockPath`)
- **measured baseline:** `node_modules/lodash/` → `lodash/`; `node_modules/@scope/pkg/` → `@scope/pkg/`; `node_modules/@scope/` → `@scope/`.
- **acceptance criteria:** Trailing slashes stripped; normal `foo` / `@scope/pkg` unchanged; empty/malformed paths still handled safely.
- **verification commands:** hermetic path matrix; licenses helpers unit
- **conflict notes:** serialize after `1283`; not `1233` root-only packages; not classifier.
- **screen:** SAFE.

### q-mp-1285 · Scripts: `nav-away-sweep` honor `BASE_URL`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post99ba`)
- **depends-on:** none; serialize with `1286`; leave `1070` game-list alone
- **series:** script-tooling
- **verdict:** **SAFE** — `BASE_URL` ignored while sibling sweeps honor it
- **CI / package.json callers:** `package.json` → `audit:nav-away` (or local `node scripts/nav-away-sweep.mjs`; report-only)
- **target files:** `scripts/nav-away-sweep.mjs` (`BASE`)
- **measured baseline:** `const BASE = 'http://127.0.0.1:5173'` hardcoded; `console-sweep` / `mobile-audit` use `process.env.BASE_URL`.
- **acceptance criteria:** `BASE_URL` overrides default; unset keeps current default; USAGE mentions the env; no game-list expansion (`1070`).
- **verification commands:** `rg -n 'BASE_URL|127\\.0\\.0\\.1:5173' scripts/nav-away-sweep.mjs scripts/console-sweep.mjs`
- **conflict notes:** not `1070`; serialize with `1286`.
- **screen:** SAFE.

### q-mp-1286 · Scripts: `nav-away-sweep` dismiss owl before chrome clicks

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post99ba`)
- **depends-on:** serialize after `1285`; leave `879` deep-playtest alone; leave `1070` alone
- **series:** script-tooling
- **verdict:** **SAFE** — owl can intercept `#new-game-btn` after bare `waitForGameReady`
- **CI / package.json callers:** `scripts/nav-away-sweep.mjs` (report-only)
- **target files:** `scripts/nav-away-sweep.mjs` (main loop); reuse `scripts/lib/dismiss-owl.mjs` / `gotoGame`
- **measured baseline:** imports `waitForGameReady` only; no `dismissOwl`; then clicks `#new-game-btn`. Siblings via `gotoGame` dismiss owl.
- **acceptance criteria:** Owl dismissed before interactive chrome clicks (shared helper); no game-list changes; no waitForTimeout theater.
- **verification commands:** `rg -n 'dismissOwl|waitForGameReady|new-game-btn' scripts/nav-away-sweep.mjs`
- **conflict notes:** not `879` deep-playtest adoption scope; not `1070`.
- **screen:** SAFE.

### q-mp-1287 · Scripts: `check-perf` `waitForUrl` must not treat HTTP 404 as ready

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post99ba`)
- **depends-on:** leave folded offline `1261` / `#1394` alone; prefer shared `offline-probe-ready` helper if tip-owner agrees
- **series:** script-tooling
- **verdict:** **SAFE** — preview not up / wrong port looks ready (1261 residual in check-perf only)
- **CI / package.json callers:** `package.json` → `check:perf` (report-only / local)
- **target files:** `scripts/check-perf.mjs` (`waitForUrl`)
- **measured baseline:** `res.ok || res.status === 404` still present in check-perf; offline probes use 2xx-only helper.
- **acceptance criteria:** Ready only on 2xx (or tip-owner-approved SPA fallback that is not bare 404); timeout still throws; no LH scoring / AI timing edits.
- **verification commands:** `rg -n 'status === 404' scripts/check-perf.mjs scripts/lib/offline-probe-ready.mjs` ; hermetic wait helper mock
- **conflict notes:** residual of `1261` (offline only); new id because check-perf was not in that PR’s files.
- **screen:** SAFE.

### q-mp-1288 · Scripts: `check-emit-identity --minify` must not false-DIFF rename-only emit

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post99ba`)
- **depends-on:** leave `1110` export demotes alone; **no** AI source edits
- **series:** script-tooling
- **verdict:** **SAFE** — brace-only minify proof false-fails when esbuild renames locals differently on identical raw emit
- **CI / package.json callers:** `package.json` → `check:emit-identity` (local helper)
- **target files:** `scripts/check-emit-identity.mjs` (`transpileToJs` / `compareFileEmit` minify path)
- **measured baseline:** type-annotated `export const x: number = 1` vs plain `export const x = 1` → raw minify:false equal; minify:true → `const e=1;export{e as x}` vs `const o=1;export{o as x}` → DIFF.
- **acceptance criteria:** Minify compare ignores unstable local renames **or** documents/fails with a dedicated reason when raw (non-minify) emit already matches; non-minify path unchanged; **no** AI file demotes (`1110`).
- **verification commands:** hermetic transpile pair unit; `rg -n 'minify' scripts/check-emit-identity.mjs`
- **conflict notes:** not `1110`; not tip merge-base HOLD-CHECK.
- **screen:** SAFE.

### q-mp-1289 · Scripts: ratchet-history track all 12 lint ceiling keys

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post99ba`)
- **depends-on:** leave folded `1247`/`1248` + au `1230`/`1231` alone
- **series:** script-tooling
- **verdict:** **SAFE** — history chart/markdown omit 8 live ratchet rules
- **CI / package.json callers:** `package.json` → `report:ratchet-history` (report-only)
- **target files:** `scripts/report-ratchet-history.mjs` (`LINT_RULE_KEYS` / `extractLintMetrics` / render series)
- **measured baseline:** `LINT_RULE_KEYS` = curly, void, nnnull, dup-imports only; ceilings JSON has **12** rules including `eqeqeq`, `return-await`, `radix`, …
- **acceptance criteria:** All ceiling keys from `docs/dev/lint-ratchet-ceilings.json` are extracted + rendered (or explicitly listed as untracked with tip-owner approval — prefer full track); no ceiling value remasure / no key clears; string-ceiling coerce stays prior ids.
- **verification commands:** hermetic `extractLintMetrics` with 12-key fixture; `node -e '…Object.keys(ceilings.rules).length…'`
- **conflict notes:** chart coverage, not ceiling coerce / mergeHistory.
- **screen:** SAFE.

### q-mp-1290 · Scripts: `CALIBRATION_GAMES` reject NaN / non-positive

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post99ba`)
- **depends-on:** none; **no** AI search / scoring / difficulty / timing edits
- **series:** script-tooling
- **verdict:** **SAFE** — bad env silently runs 0 matchups and writes `Games per matchup: NaN`
- **CI / package.json callers:** `scripts/run-ai-calibration.ts` (local bench; not CI)
- **target files:** `scripts/run-ai-calibration.ts` (`GAMES` / `CALIBRATION_GAMES`)
- **measured baseline:** `Number(process.env.CALIBRATION_GAMES ?? 50)`; `'abc'`→NaN→0 loop iters.
- **acceptance criteria:** Non-finite / non-positive / non-integer → usage error or default 50; valid positives unchanged; **no** AI behavior / timing asserts.
- **verification commands:** hermetic parse unit or small node harness; `rg -n 'CALIBRATION_GAMES' scripts/run-ai-calibration.ts`
- **conflict notes:** not AI harness speed theater; env parse only.
- **screen:** SAFE.

### q-mp-1291 · Tests: shard or trim queens-guards fuzz seed-A ~8s case

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tests
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post99ba`)
- **depends-on:** none; **do not** weaken serialize/deserialize coverage; **no** AI timing locks
- **series:** test-hygiene
- **verdict:** **SAFE** — single case dominates local/CI unit wall when isolated
- **CI / package.json callers:** `package.json` → `test:unit` (CI unit)
- **target files:** `tests/unit/state-roundtrip-fuzz-queens-a.test.ts` (+ new shard file if split)
- **measured baseline:** `CI=1 npx vitest run tests/unit/state-roundtrip-fuzz-queens-a.test.ts --reporter=verbose --maxWorkers=1` → **8122ms** / file **8.80s**.
- **acceptance criteria:** Wall trim via shard and/or iteration budget that preserves property coverage (tip-owner chooses); measured duration drops without deleting the round-trip assert; no fake-clock / AI deadline edits.
- **verification commands:** same vitest command before/after with `--reporter=verbose`; `npm run test:unit -- tests/unit/state-roundtrip-fuzz-queens*.test.ts`
- **conflict notes:** not AI-timing HOLD; not engine-property-invariants `1071`.
- **screen:** SAFE.

## Verdict summary

| Id          | Verdict  | Title (short)                                                    |
| ----------- | -------- | ---------------------------------------------------------------- |
| `q-mp-1271` | **SAFE** | check-dev-docs: PATH_RE root config backtick paths               |
| `q-mp-1272` | **SAFE** | docs: testing-layers PLAYTEST_* env name matrix                  |
| `q-mp-1273` | **SAFE** | mutation-report: hex globs must not match hex-a-gone             |
| `q-mp-1274` | **SAFE** | dead-code: flattenKnip null issues / nested arrays               |
| `q-mp-1275` | **SAFE** | lint probe: unique temp path (ratchet ↔ buckets)                 |
| `q-mp-1276` | **SAFE** | fab playtest: PLAYTEST_GAMES_PER NaN / non-positive              |
| `q-mp-1277` | **SAFE** | fab playtest: PLAYTEST_SKIP_EXTRA_SHOTS `'0'`/`'false'`          |
| `q-mp-1278` | **SAFE** | fab playtest: ONLY_VP / ONLY_DIFF validate keys                  |
| `q-mp-1279` | **SAFE** | fraction-pinball: PLAYTEST_GAMES NaN / non-positive              |
| `q-mp-1280` | **SAFE** | page-ready: gotoGame trailing-slash baseURL                      |
| `q-mp-1281` | **SAFE** | licenses: CycloneDX bom-ref empty version                        |
| `q-mp-1282` | **SAFE** | licenses: CycloneDX skip invalid integrity hashes                |
| `q-mp-1283` | **SAFE** | licenses: CycloneDX scope honor optional                         |
| `q-mp-1284` | **SAFE** | licenses: npmPackageNameFromLockPath strip trailing `/`          |
| `q-mp-1285` | **SAFE** | nav-away-sweep: honor BASE_URL                                   |
| `q-mp-1286` | **SAFE** | nav-away-sweep: dismiss owl before chrome clicks                 |
| `q-mp-1287` | **SAFE** | check-perf: waitForUrl 404 ≠ ready (1261 residual)               |
| `q-mp-1288` | **SAFE** | emit-identity: --minify rename-stable compare                    |
| `q-mp-1289` | **SAFE** | ratchet-history: track all 12 lint ceiling keys                  |
| `q-mp-1290` | **SAFE** | ai-calibration: CALIBRATION_GAMES NaN / non-positive             |
| `q-mp-1291` | **SAFE** | tests: queens-guards fuzz seed-A wall trim                       |

**Screened HOLD-CHECK (not queued — leave prior posture / tip-owner):**

| Topic | Why not queued |
| ----- | -------------- |
| `check-lint-ratchet` non-numeric string ceiling → status FAIL but exit 0 | CI-gating script live verdict (av screened) |
| `check-type-ratchet` string / abs-path `IN_SCOPE` fail-open | CI-gating type ratchet (av screened) |
| `check-boundaries` `UI_REEXPORT` misses named / `export * as`; `classify` abs paths → `other` | CI-gating boundaries; `1201`–`1204`/`1220` |
| `check-emit-identity` default merge-base still wave5 tip; `missing-base` → `ok: false` for new ai files | HOLD-CHECK tip-owner / AI-adjacent; `1110` demotes stay prior |
| runtime-perf `maxLongTaskMs` invalid-only → `0` residual | exhausted render-perf/runtime-perf family — leave prior `1245` posture |

**No HOLD** product tickets queued (AI / board-3d / rules / copy left out of scope).

## Out of scope / not used here

Already claimed / in-flight / HOLD / no headroom / prompt-skipped families: av `1246`–`1270` + `#1382`/`#1383`–`#1399`, au `1222`–`1245`, at `1197`–`1220`, as `1172`–`1191`, ar `1147`–`1163`, aq `1122`–`1137`, ap/ao residuals, void/nnnull/nullish successors, eqeqeq product clear (`fiar/rules.ts` HOLD), lint-buckets **gate** fail-open (screened), optional-chain product clears, knip demote / unusedTypes baseline drop, wiki **count** remasure, tip-name pointers, UI coverage rounds, soft-fail characterizations, mutation-audit **waves**, board-3d **src** / **mp3d e2e** wait clears, harness shards theater, demo coverage, page-ready / double-rAF / artifact-dir **adoptions** / mountPair / npm aliases / `--help`/`--dry-run`/argv / empty-input / lib main-entry / cli-help spawn speedups, license-classifier siblings, pwa-manifest-contract / check-pwa-manifest, check-workflows parsing, precache parser, check-build asset/precache, menu-critical-ref, md-link regex, check-copy-pins, summarizeKnip/diffMetrics, classifyVitestRunResult, flake-rate loops, heap/memory-leak deltas, prototype-restore after direct assigns, engine-coverage-rank, report-coverage-map, ratchet-history **ceilings** (`1230`/`1231`) + **mergeHistory** (`1248`), env-number, render-perf/runtime-perf, mobile-audit, console-sweep, mutation-report **games**, deep-playtest end regexes / `waitForTimeout`, overnight mountPair/router batches, rounds ≤48 through `q-mp-1270`, CI `e2e-cross-browser` yaml named script (`800`), dismissOwl deep-playtest (`879`), nav-away games (`1070`), emit-identity export demotes (`1110`), AI timing / Hex Hard 450ms / Stars & Bars history cap, cancelFabAiRequests knip LEAVE (AI HOLD), visual-baseline PNG refresh (`1050`), canvas-dpr WebKit skip (`1051`), offsetWidth (`1135`), scrollIntoView (`1180`), getContext (`1181`), flake `flaky` (`1183`), boundaries HOLD-CHECK (`1201`–`1204`/`1220`), size soft MISSING (`1214`).

Filled to **21** with measured wrong-results + docs mismatches only — **no filler** from exhausted families (honest shortfall vs 25).
