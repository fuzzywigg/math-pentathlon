# Engineering backlog — 2026-10-11ay (tip refill after postc4a7 cut / round-51)

**Task id:** `q-mp-090ay`  
**Role:** worker (report-only)  
**Tip audited:** `cursor/mp-tip-postc4a7` @ `cf88131c` (full `cf88131c391a84c11cf3a3414a713919d82372bb`; tip cut from `alpha` @ `c4a7fdbb` after `#1401` fold of post0f72; living pointers set by `q-mp-026ae`)  
**Depends on:** tip `cursor/mp-tip-postc4a7` @ `cf88131c`. Round-50 backlog (`q-mp-090ax` / open `#1417` on old tip `post0f72`, ids `q-mp-1292`…`1309`) — leave with `contained`; tip already folded most ax SAFE implementers (`#1419`–`#1431` still open as drafts) — **do not** re-queue. Round-49 backlog (`q-mp-090aw` / open `#1400` on `post99ba`, ids `q-mp-1271`…`1291`) — leave with `contained`. Tip HEAD continues to move as tip-owner folds green drafts — **rebase onto latest tip before opening worker PRs**.

## Purpose

The tip `cursor/mp-tip-postc4a7` @ `cf88131c` measures unit files **3445**; Chromium e2e **25** files / **249** cases; knip unusedExports **3** (LEAVE) / unusedTypes **29** / unusedFiles **0**. This doc lists **21 new** concrete engineering tasks (`q-mp-1310` … `q-mp-1330`) mined from the **live tip tree**, checked against prior refills through `q-mp-1309` (ax on post0f72 + tip implementers `#1419`–`#1431`), aw/av/au/at/as/ar/aq/ap/ao, and against the full open draft PR list (postc4a7 `#1419`–`#1431`, post0f72 `#1415`–`#1417`, post99ba `#1383`–`#1400`, post2590 `#1365`–`#1382`, older stacks). It is the **only** deliverable of `q-mp-090ay`.

**Honest count:** Only **21** tasks — not padded to 25. Id range starts at `q-mp-1310` per round-51 brief. Earlier reserved gaps stay unused. Round-50 already claimed (and tip-folding) runLighthouse JSON/stale, waitForGameReady load-error, offline board/recovered, offline-dev date, licenses null-proto, mapGameChunks, emit invalid base, withSeededRandom, storage-stubs, hex-ui reinject, playtest BASE/seed, queens e2e seed, type-ratchet phase2 docs, engine-property immutability — **do not** re-queue `1292`–`1309` (leave `#1417` + tip drafts `#1419`–`#1431` with `contained`). This refill **does not** re-queue exhausted families from the round-51 brief: `--help`/argv/empty-input theater, cli-help spawn speedups, mountPair, npm aliases, tip-name pointers, knip remeasure/baselines, AI harness speed, license-classifier prose, pwa-manifest-contract, check-pwa-manifest, check-workflows parsing, precache parser, check-build asset/precache audits, menu-critical-ref, md-link regex, check-copy-pins, summarizeKnip/diffMetrics, classifyVitestRunResult, flake-rate loops, heap/memory-leak deltas, prototype-restore after direct assigns, engine-coverage-rank, report-coverage-map, ratchet-history ceilings, env-number, render-perf/runtime-perf, mobile-audit, console-sweep, mutation-report games, ratchet-history mergeHistory, check-dev-doc-links, probe-offline classify, check-bundle-budgets exit codes, report-dead-code parsers, deep-playtest end regexes, webkit-offline-probe, artifact-dir, README CI posture/lint-ratchet docs, PATH_RE root configs, PLAYTEST\_\* env docs, hex mutation globs, flattenKnip issues, eslint probe path, fab/fraction-pinball/calibration env parsing, gotoGame baseURL, CycloneDX SBOM, nav-away-sweep, check-perf waitForUrl, emit-identity minify, ratchet-history lint keys, queens fuzz wall, runLighthouse JSON, waitForGameReady load-error, offline probe board/recovered, offline-dev date, report-licenses maps, mapGameChunks, emit-identity base, withSeededRandom, storage-stubs, hex-ui styles, playtest BASE join/seed, queens e2e seed, type-ratchet phase2 docs, engine-property immutability. No NaN/null-coercion micro-fixes unless real data hits them.

**Fresh payoffs on this tip (re-measured @ `cf88131c` after ax queue + open `#1419`–`#1431`):** **`analyzeHeapSnapshot` string-concats / NaNs non-finite `self_size`** and **`fmtMb(NaN)` → `"NaN MB"`**, **`extractMetric('typePhase2')` drops numeric strings** while lint ceilings already coerce via `coerceFiniteNumber`, **`parseSizeCheckArgs(['--fail-on-new-ovr'])` silently stays report-only**, **`report:knip` exits 0 on `knip.error` even with `--fail`**, **`MEM_LEAK_GAMES=bogus` → 0-game “success” audit**, **`MEM_LEAK_DATE` default still `2026-10-07`**, **`parseHelpOnlyArgv(['oops'])` → `{kind:'run'}`** (peer harness CLIs error), **`report-lint-buckets` / lint-ratchet treat empty eslint stdout as all-zero**, **mutation ARITH skip misses `NoSubstitutionTemplateLiteral`** (`` `hi` + x `` still mutated), **mutation `scoreOf` counts infra `error` in the denominator**, **deep-playtest / fab / hex-deep / star-track still hardcode `2026-10-07` OUT paths or result dates**, **`readReporterJson` rejects UTF-8 BOM JSON as corrupt**, **`parseMutationReportArgs(['--max=1e2'])` accepts `100`**, **`mutationTestGlobToRegExp` is a dead export** (zero external importers), **`matchMedia` stubs leak across unit-shared** (A/B: probe alone `undefined`, after ui16/ui8/reduced-motion `function`), **queens seed-B fuzz still ~6.0s monolithic** (seed-A already split), **`stripCommentsAndCollapseWhitespace` leaves `x++ / 2` ≠ `x++/2`**, **ai-calibration `aggregate` counts `timeout`/`error` winners as draws**.

**Preference:** SAFE, mutually independent **scripts/** wrong-results fixes, **docs-only** accuracy, or **tests-only** flake/restore hygiene. **Do not** queue another remasure of CI wall, bundle headroom, lint-bucket snapshot, copy-pins findings totals, boundaries/PWA thresholds, board-3d layout inventory, CI permissions, tip-pointer **count** stamps, open-draft triage, knip unusedTypes baseline drop, Rank-3 demote theater, dead-CSS Rank-1 rescan, wiki **count** cells, or more exhausted-family theater. Anything in rules / AI / scoring / legal-move paths, player-facing copy, tutorials product edits, timing, Stars & Bars history cap, Hex Hard 450ms, board-3d **src** / **mp3d e2e**, or CI permissions widening is **HOLD**. **Do not** change fake-clock semantics. **Do not** edit `*/rules.ts`.

**Lint policy for this refill:** **no** new ceiling-key clears. Boundaries / size soft-gate schema tickets stay prior HOLD-CHECK ids (`1201`–`1204`/`1214`/`1220`) — do not sibling. Ratchet-history chart keys stay prior `1289`; mergeHistory stay prior. Lint-ratchet / type-ratchet fail-open residuals are queued once as HOLD-CHECK (`1328`–`1330`).

## Duplicate check (do not re-queue)

| Topic family                                                                                                   | Why skipped                                                                         |
| -------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| round-50 ax `1292`–`1309` (+ open `#1417` on post0f72; tip drafts `#1419`–`#1431`; most already folded on tip) | leave with `contained`; this refill’s tickets are **new** surfaces only             |
| round-49 aw `1271`–`1291` / av `1246`–`1270` / au–ao residuals                                                 | leave with `contained`                                                              |
| offline-dev date (`1297`) / playtest BASE+seed (`1305`/`1306`)                                                 | harness **OUT dir / result date** stamps are new (`1320`); do not re-queue URL/seed |
| emit-identity minify (`1288`) / invalid base (`1301`)                                                          | normalize `++`/`/` residual is new (`1326`)                                         |
| heap/memory-leak **deltas** (`1215`/`1216`)                                                                    | non-finite `self_size` / DATE / empty GAMES are new (`1310`/`1314`/`1315`)          |
| check-bundle-budgets **exit-code** theater / size soft MISSING (`1214`)                                        | typo/unknown `--fail-on-new-over` silent ignore is new (`1312`)                     |
| knip flatten/summarize/diffMetrics / unusedTypes baseline                                                      | `--fail` ignore on `knip.error` is new (`1313`)                                     |
| deep-playtest **end regexes** / offline **classify** / mobile-audit / console-sweep / nav-away                 | prompt hard-skip (measured residuals left unqueued)                                 |
| queens fuzz **wall** (`1291`)                                                                                  | seed-B early/late shard is new (`1325`); not wall trim                              |
| ratchet-history mergeHistory / lint keys / ceilings                                                            | typePhase2 string coerce residual only (`1311`)                                     |
| boundaries `1201`–`1204`/`1220` / emit demotes `1110` / engine-property `1309`                                 | leave prior ids                                                                     |
| AI-timing / Hex Hard 450ms / history-cap / rules.ts / copy / scoring / CI permissions                          | hard-rule HOLD                                                                      |

Also skipped: Merom / Sullivan / data-center / grants / nonprofit; `pappas-infrastructure`; meromhouse agents; any CI `permissions` widening. No `memory/` files.

## Stale queue re-check (live tip `cf88131c`)

| Id                                   | Title (short)                        | Verdict                        | Evidence @ `cf88131c`                                        |
| ------------------------------------ | ------------------------------------ | ------------------------------ | ------------------------------------------------------------ |
| `q-mp-090ax` / `#1417`               | round-50 backlog                     | **open on old tip `post0f72`** | This refill starts at `1310`; do not re-queue `1292`–`1309`. |
| `#1419`–`#1431`                      | ax SAFE implementers into `postc4a7` | **open** (most folded on tip)  | Leave with `contained`.                                      |
| `q-mp-090aw` / `#1400`               | round-49 backlog                     | **open on `post99ba`**         | leave with `contained`.                                      |
| `q-mp-1292`…`1309`                   | ax gaps                              | **folded or in-flight on tip** | leave prior ids; do not sibling.                             |
| `q-mp-1201`…`1204` / `1220` / `1214` | boundaries + size soft-gate          | **still-valid; no tip PR yet** | Leave prior ids — **do not** re-queue.                       |
| `q-mp-1309`                          | engine-property fingerprint before   | **still-valid HOLD-CHECK**     | Leave prior id — do not sibling.                             |
| Dead-code Rank-2 yes                 | live dry-run                         | **0 yes** (prior posture)      | No new Rank-2 demote queued.                                 |
| knip unusedExports                   | live `--json`                        | **3 LEAVE**                    | Only demote `mutationTestGlobToRegExp` (scripts export).     |

## Shared-file conflict flags

| Shared file                                                      | Conflicting new ids                                          |
| ---------------------------------------------------------------- | ------------------------------------------------------------ |
| `scripts/lib/memory-leak-heap.mjs`                               | `1310` only; leave metricDelta `1215`/`1216` alone           |
| `scripts/report-ratchet-history.mjs`                             | `1311` only; leave mergeHistory / lint keys alone            |
| `scripts/check-bundle-budgets.mjs`                               | `1312` only; **no** exit-code / mapGameChunks re-queue       |
| `scripts/report-knip.mjs`                                        | `1313` only; **no** summarize/diffMetrics/baseline drop      |
| `scripts/memory-leak-audit.mjs`                                  | `1314` + `1315` — serialize                                  |
| `scripts/lib/help-only-cli.mjs`                                  | `1316` only; not `--help` theater                            |
| `scripts/report-lint-buckets.mjs`                                | `1317` only; serialize after HOLD-CHECK `1328` if same probe |
| `scripts/mutation-report.mjs`                                    | `1318` + `1319` + `1323` — serialize                         |
| `scripts/lib/mutation-report-args.mjs`                           | `1322` only                                                  |
| deep-playtest / playtest harnesses (OUT date)                    | `1320` — one PR or serialize per file                        |
| `scripts/lib/read-reporter-json.mjs`                             | `1321` only                                                  |
| `scripts/check-emit-identity.mjs`                                | `1326` only; leave minify / invalid-base alone               |
| `tests/helpers/ai-calibration/matrix.ts`                         | `1327` only; **no** AI search/scoring/timing                 |
| mutation-ui matchMedia suites                                    | `1324` — one PR across listed files                          |
| `tests/unit/state-roundtrip-fuzz-queens-b.test.ts` + fuzz helper | `1325` only; leave seed-A `1291` alone                       |
| `scripts/check-lint-ratchet.mjs`                                 | `1328` + `1329` — serialize HOLD-CHECK                       |
| `scripts/check-type-ratchet.mjs`                                 | `1330` only HOLD-CHECK                                       |

**Parallel-friendly:** `1310`, `1311`, `1312`, `1313`, `1316`, `1317`, `1321`, `1322`, `1324`, `1325`, `1326`, `1327`. Serialize `1314`→`1315`; `1318`→`1319`→`1323`; `1328`→`1329`.

## Live tip measurements (evidence snapshot @ `cf88131c`)

```text
$ git rev-parse HEAD
  cf88131c391a84c11cf3a3414a713919d82372bb

$ git branch --show-current
  cursor/mp-tip-postc4a7 (audited) / cursor/backlog-2026-10-11ay-82d3 (this PR)

$ find tests/unit \( -name '*.test.ts' -o -name '*.spec.ts' \) ! -path '*/_tokenmaxx_archive/*' | wc -l
  3445

$ npm run test:e2e:chromium -- --list
  Total: 249 tests in 25 files

$ npm run report:knip -- --json
  unusedExports: 3  unusedTypes: 29  unusedFiles: 0

$ analyzeHeapSnapshot(nodes self_size "12") → totalSelfSize: "012" ; fmtMb(NaN) → "NaN MB"
$ extractMetric('typePhase2', { outOfScopeErrors: '42' }) → null
$ extractMetric('eqeqeq', { rules: { eqeqeq: '9' } }) → 9  (lint coerces; typePhase2 does not)
$ parseSizeCheckArgs(['--fail-on-new-ovr']) → { failOnNewOver: false } ; novelCount 2 → exit 0
$ report-knip: if (knip.error) process.exit(0)  // args.fail never consulted
$ MEM_LEAK_GAMES=bogus → GAMES=[] ; MEM_LEAK_DATE default '2026-10-07'
$ parseHelpOnlyArgv(['oops']) → { kind: 'run' } ; parseBrowserHarnessArgs(['oops']) → error
$ check-lint-ratchet / report-lint-buckets: JSON.parse(result.stdout || '[]'); no result.status
$ object ceiling {}: count<=ceiling false, count>ceiling false → prints FAIL, exit 0
$ `` `hi` + y `` → skipStringPlus false (NoSubstitutionTemplateLiteral); "hi"+y skipped
$ scoreOf(8,10)=80 with 1 error in denom; excluding error → 88.9
$ OUT dirs: calla/ramrod/stars/sum/par/hex-deep/fab …-2026-10-07 ; star-track date: '2026-10-07'
$ readReporterJson(BOM json) → { ok:false, error:'corrupt json' }
$ parseMutationReportArgs(['--max=1e2'], defaults) → { ok:true, opts:{ max:100 } }
$ rg mutationTestGlobToRegExp → only scripts/mutation-report.mjs
$ matchMedia A/B unit-shared maxWorkers=1: probe alone undefined; after ui16/ui8/reduced-motion function
$ queens-b: ~6021ms single case (seed-A already queens-a / queens-a2)
$ stripCommentsAndCollapseWhitespace('return x++ / 2;') !== ('return x++/2;')
$ aggregate([{winner:'timeout'},{winner:'error'},{winner:'player1'}]) → draws:2
$ type-ratchet: "error TS18003: No inputs…" → errorFile null → outOfScope → exit 0

$ Open drafts into cursor/mp-tip-postc4a7 at audit: #1419–#1431 (ax implementers)
$ Round-50 backlog still open on post0f72: #1417
```

Baselines also captured under `/opt/cursor/artifacts/q-mp-090ay-repros.log`.

## New tasks

### q-mp-1310 · Scripts: `analyzeHeapSnapshot` must coerce finite `self_size` (no concat / NaN)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-postc4a7`)
- **depends-on:** leave metricDelta `1215`/`1216` alone
- **series:** script-tooling
- **verdict:** **SAFE** — truncated/odd CDP nodes poison audit totals
- **CI / package.json callers:** `package.json` → `audit:memory` (local / report-only)
- **target files:** `scripts/lib/memory-leak-heap.mjs` (`analyzeHeapSnapshot`, `fmtMb`)
- **measured baseline:** `self_size: "12"` → `totalSelfSize: "012"`; `fmtMb(NaN)` → `"NaN MB"`; null self → null totals.
- **acceptance criteria:** Non-finite / non-number `self_size` skipped or coerced to 0 with finite totals; `fmtMb` returns `n/a` for non-finite; metricDelta semantics unchanged.
- **verification commands:** hermetic unit in `tests/unit/*memory-leak-heap*`; `rg -n 'totalSelfSize|fmtMb' scripts/lib/memory-leak-heap.mjs`
- **conflict notes:** not heap **delta** theater; self_size parsing only.
- **screen:** SAFE.

### q-mp-1311 · Scripts: `extractMetric('typePhase2')` coerce numeric strings like lint/boundaries

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-postc4a7`)
- **depends-on:** leave mergeHistory / lint-keys / ceilings alone
- **series:** script-tooling
- **verdict:** **SAFE** — string-encoded Phase-2 baselines drop from history charts
- **CI / package.json callers:** `package.json` → `report:ratchet-history` (report-only)
- **target files:** `scripts/report-ratchet-history.mjs` (`extractMetric` typePhase2 branch)
- **measured baseline:** `{ outOfScopeErrors: '42' }` → `null`; `{ outOfScopeErrors: 42 }` → `42`; lint `rules.eqeqeq: '9'` already → `9`.
- **acceptance criteria:** Top-level and nested `totals.outOfScopeErrors` accept finite numeric strings via the same coerce helper as lint/boundaries; non-numeric still null.
- **verification commands:** hermetic unit; `rg -n "case 'typePhase2'|coerceFiniteNumber" scripts/report-ratchet-history.mjs`
- **conflict notes:** not mergeHistory; not lint-key chart expansion.
- **screen:** SAFE.

### q-mp-1312 · Scripts: `size:check` reject unknown / misspelled `--fail-on-new-over`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-postc4a7`)
- **depends-on:** none; **do not** change soft-gate exit policy for valid flags
- **series:** script-tooling
- **verdict:** **SAFE** — typo keeps novel OVER report-only in CI-shaped invocations
- **CI / package.json callers:** `package.json` → `size:check` (soft / report-only)
- **target files:** `scripts/check-bundle-budgets.mjs` (`parseSizeCheckArgs`)
- **measured baseline:** `parseSizeCheckArgs(['--fail-on-new-ovr'])` → `{ failOnNewOver: false }`; with `novelCount: 2` → exit `0`.
- **acceptance criteria:** Unknown argv (including near-miss typo) → usage / exit 2 (or explicit error); exact `--fail-on-new-over` unchanged; default report-only path unchanged.
- **verification commands:** hermetic `parseSizeCheckArgs` unit; `rg -n 'parseSizeCheckArgs|fail-on-new-over' scripts/check-bundle-budgets.mjs`
- **conflict notes:** unknown-flag honesty, not exit-code theater / mapGameChunks.
- **screen:** SAFE.

### q-mp-1313 · Scripts: `report:knip --fail` must not exit 0 on `knip.error`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-postc4a7`)
- **depends-on:** none; **no** unusedTypes baseline drop / summarizeKnip edits
- **series:** script-tooling
- **verdict:** **SAFE** — enforce mode cannot catch knip runner failure
- **CI / package.json callers:** `package.json` → `report:knip` (report-only / optional `--fail`)
- **target files:** `scripts/report-knip.mjs` (`main` knip.error branch)
- **measured baseline:** `if (knip.error) { … process.exit(0); }` — `args.fail` / `enforce` never consulted.
- **acceptance criteria:** When `--fail` or baseline `enforce` is set, `knip.error` → non-zero exit; default report-only may still warn + exit 0; summarize/diffMetrics unchanged.
- **verification commands:** hermetic spawn/unit with mocked `runKnip`; `rg -n 'knip\\.error|args\\.fail|enforce' scripts/report-knip.mjs`
- **conflict notes:** fail-open on runner error, not knip remasure theater.
- **screen:** SAFE.

### q-mp-1314 · Scripts: `MEM_LEAK_GAMES` reject all-unknown filter (no empty success)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-postc4a7`)
- **depends-on:** serialize with `1315`
- **series:** script-tooling
- **verdict:** **SAFE** — typo env looks like a clean 0-game audit
- **CI / package.json callers:** `package.json` → `audit:memory`
- **target files:** `scripts/memory-leak-audit.mjs` (`MEM_LEAK_GAMES` / `GAMES` filter)
- **measured baseline:** unknown ids filtered out → `GAMES=[]` → logs `0 games × N cycles`, writes empty results, exit 0.
- **acceptance criteria:** If filter non-empty and no known ids remain → exit 2 with clear message; valid subsets unchanged; no heap delta edits.
- **verification commands:** hermetic filter unit or dry argv path; `rg -n 'MEM_LEAK_GAMES|GAMES =' scripts/memory-leak-audit.mjs`
- **conflict notes:** not metricDelta; serialize with date `1315`.
- **screen:** SAFE.

### q-mp-1315 · Scripts: memory-leak audit stamp live `MEM_LEAK_DATE` default

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-postc4a7`)
- **depends-on:** serialize after `1314`
- **series:** script-tooling
- **verdict:** **SAFE** — every new run overwrites the Oct 7 artifact twin
- **CI / package.json callers:** `package.json` → `audit:memory`
- **target files:** `scripts/memory-leak-audit.mjs` (`auditDate`)
- **measured baseline:** `process.env.MEM_LEAK_DATE || '2026-10-07'`; sibling offline-dev already moved to live UTC (`1297`).
- **acceptance criteria:** Default uses today’s UTC `toISOString().slice(0,10)` (or env override); env name unchanged; no classify / delta edits.
- **verification commands:** `rg -n "MEM_LEAK_DATE|2026-10-07|toISOString" scripts/memory-leak-audit.mjs`
- **conflict notes:** date metadata only; not heap deltas.
- **screen:** SAFE.

### q-mp-1316 · Scripts: `parseHelpOnlyArgv` reject unknown positionals (peer CLI parity)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-postc4a7`)
- **depends-on:** none; **not** `--help`/empty-input theater
- **series:** script-tooling
- **verdict:** **SAFE** — `node scripts/check-perf.mjs oops` launches full LH/perf
- **CI / package.json callers:** `check:perf` / `check:boundaries` / `check:workflows` via `scripts/lib/help-only-cli.mjs`
- **target files:** `scripts/lib/help-only-cli.mjs` (`parseHelpOnlyArgv`)
- **measured baseline:** `parseHelpOnlyArgv(['oops'])` → `{ kind: 'run' }`; `parseBrowserHarnessArgs(['oops'])` → `{ mode: 'error', … }`.
- **acceptance criteria:** Unknown positionals → error / usage exit 2; `--help` / empty argv (intentional run) unchanged; no spawn-speed theater.
- **verification commands:** hermetic unit; `rg -n 'parseHelpOnlyArgv' scripts/lib/help-only-cli.mjs`
- **conflict notes:** real wrong-run vs peer CLIs; not empty-input `--help` theater.
- **screen:** SAFE.

### q-mp-1317 · Scripts: `report:lint-buckets` must not zero totals on empty eslint stdout

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-postc4a7`)
- **depends-on:** leave HOLD-CHECK `1328` for the CI-gating sibling
- **series:** script-tooling
- **verdict:** **SAFE** — report-only probe prints full headroom on crash
- **CI / package.json callers:** `package.json` → `report:lint-buckets` (report-only; not in `verify`)
- **target files:** `scripts/report-lint-buckets.mjs` (eslint JSON parse path)
- **measured baseline:** `JSON.parse(result.stdout || '[]')` with no `result.status` check → totals 0 / full headroom.
- **acceptance criteria:** Empty stdout and/or non-zero eslint status → explicit error / non-zero for the report CLI (tip-owner chooses); valid JSON reports unchanged; **do not** edit `check-lint-ratchet` in this ticket.
- **verification commands:** hermetic unit with mocked spawn; `rg -n 'stdout \\|\\| .\\[\\]|result\\.status' scripts/report-lint-buckets.mjs`
- **conflict notes:** report-only sibling of HOLD-CHECK `1328`.
- **screen:** SAFE.

### q-mp-1318 · Scripts: mutation ARITH skip must include `NoSubstitutionTemplateLiteral`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-postc4a7`)
- **depends-on:** serialize with `1319`/`1323`; **no** `*/rules.ts` product edits beyond mutant AST
- **series:** script-tooling
- **verdict:** **SAFE** — intended string-`+` skip still mutates `` `…` + expr ``
- **CI / package.json callers:** `package.json` → `mutation:report` (local / report-only)
- **target files:** `scripts/mutation-report.mjs` (`collectMutants` PlusToken skip)
- **measured baseline:** `` `hi` + y `` → `skipStringPlus: false` (`NoSubstitutionTemplateLiteral`); `"hi" + y` / `` `h${1}` + y `` skipped.
- **acceptance criteria:** `ts.isNoSubstitutionTemplateLiteral` treated like string literal / template expression for PlusToken skip; numeric `+` still mutated; games globs unchanged.
- **verification commands:** hermetic AST unit (export helper or inject); `rg -n 'isTemplateExpression|NoSubstitutionTemplateLiteral|PlusToken' scripts/mutation-report.mjs`
- **conflict notes:** heuristic bug, not mutation-report **games** / hex globs.
- **screen:** SAFE.

### q-mp-1319 · Scripts: mutation score must not treat infra `error` as not-killed

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-postc4a7`)
- **depends-on:** serialize after `1318`
- **series:** script-tooling
- **verdict:** **SAFE** — spawn/filter failures look like weak mutation score
- **CI / package.json callers:** `package.json` → `mutation:report`
- **target files:** `scripts/mutation-report.mjs` (`scoreOf` / `mutateGame` denominator)
- **measured baseline:** Comment says timeouts count as not-killed; `error` also increments neither killed nor excluded → `scoreOf(8,10)=80` with 1 error vs `88.9` excluding error.
- **acceptance criteria:** Infra `error` excluded from score denominator (or scored separately); timeouts policy tip-owner chooses but document; JSON fields remain report-only; no vitest-phrase classifier edits.
- **verification commands:** hermetic score unit; `rg -n 'scoreOf|error|detected|ran =' scripts/mutation-report.mjs`
- **conflict notes:** not classifyVitest / no-tests skip; score math only.
- **screen:** SAFE.

### q-mp-1320 · Scripts: playtest harnesses stamp live OUT dir / result `date` (not 2026-10-07)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-postc4a7`)
- **depends-on:** leave open `#1431` BASE/seed alone; **no** end-regex edits
- **series:** script-tooling
- **verdict:** **SAFE** — new runs clobber/mislabel Oct 7 artifact trees
- **CI / package.json callers:** `playtest:calla` / `playtest:ramrod` / `playtest:stars-bars` / `playtest:sum-dominoes` / `playtest:par-55`; plus `docs/playtest/hex-deep-probe.mjs`, `docs/playtest/fraction-pinball-deep-playtest.mjs`, `tests/playtest/fab-a-diffy-deep.mjs`, `tests/playtest/star-track-deep-playtest.mjs`
- **target files:** those harnesses’ `OUT` / `OUT_DIR` / `SHOT_DIR` / result `date` fields
- **measured baseline:** Fixed `…-2026-10-07` paths in calla/ramrod/stars/sum/par/hex-deep/fraction/fab; star-track writes `date: '2026-10-07'`.
- **acceptance criteria:** Default stamp uses live UTC date (env override OK); historical markdown under old paths may remain; no BASE-join / seed / end-regex edits.
- **verification commands:** `rg -n "2026-10-07" scripts/*deep-playtest.mjs docs/playtest/*deep*.mjs tests/playtest/*.mjs`
- **conflict notes:** not offline-dev `1297`; not playtest URL/seed `1305`/`1306`.
- **screen:** SAFE.

### q-mp-1321 · Scripts: `readReporterJson` accept UTF-8 BOM JSON

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-postc4a7`)
- **depends-on:** none; **no** flake-rate loop theater
- **series:** script-tooling
- **verdict:** **SAFE** — BOM from some editors/tools marks green runs corrupt
- **CI / package.json callers:** flake-rate helpers / any consumer of `scripts/lib/read-reporter-json.mjs`
- **target files:** `scripts/lib/read-reporter-json.mjs` (`readReporterJson`)
- **measured baseline:** `'\uFEFF{"numFailedTests":0}'` → `{ ok:false, error:'corrupt json' }`; without BOM → ok.
- **acceptance criteria:** Strip leading UTF-8 BOM before `JSON.parse`; other corrupt JSON still fails closed; schema checks unchanged.
- **verification commands:** hermetic unit; `rg -n 'JSON\\.parse|BOM|FEFF' scripts/lib/read-reporter-json.mjs`
- **conflict notes:** parser honesty, not flake-rate loop design.
- **screen:** SAFE.

### q-mp-1322 · Scripts: `parseMutationReportArgs` reject scientific-notation `--max`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-postc4a7`)
- **depends-on:** none; leave floats reject `1217` alone
- **series:** script-tooling
- **verdict:** **SAFE** — `--max=1e2` silently becomes 100
- **CI / package.json callers:** `package.json` → `mutation:report`
- **target files:** `scripts/lib/mutation-report-args.mjs` (`parseMutationReportArgs`)
- **measured baseline:** `Number('1e2')` + `Number.isInteger(100)` → `{ ok:true, max:100 }`; `--max=1.5` already rejected.
- **acceptance criteria:** Require integer **decimal** token (e.g. `/^\d+$/`) for `--max` / `--timeout`; scientific notation → error; `--max=0` “all” preserved.
- **verification commands:** hermetic unit; `rg -n 'maxRaw|Number\\.isInteger|--max=' scripts/lib/mutation-report-args.mjs`
- **conflict notes:** not fab/fraction env Number tickets; mutation argv only.
- **screen:** SAFE.

### q-mp-1323 · Chore: demote dead export `mutationTestGlobToRegExp`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 chore
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-postc4a7`)
- **depends-on:** serialize after `1318`/`1319` if same file; **no** knip AI/settings LEAVE demotes
- **series:** dead-export
- **verdict:** **SAFE** — export has strictly zero external importers
- **CI / package.json callers:** none (internal to `mutation:report`)
- **target files:** `scripts/mutation-report.mjs`
- **measured baseline:** `rg mutationTestGlobToRegExp` → only that file (internal callers @ L132/L240).
- **acceptance criteria:** Make function non-exported (or move to lib without export if tests need it); behavior unchanged; knip src LEAVE barrels untouched.
- **verification commands:** `rg -n 'mutationTestGlobToRegExp' -g '!node_modules'`; `npm run report:knip -- --json`
- **conflict notes:** scripts export only; not emit-identity demotes `1110`.
- **screen:** SAFE.

### q-mp-1324 · Tests: restore `window.matchMedia` after graph/dice/reduced-motion stubs

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tests
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-postc4a7`)
- **depends-on:** none; pattern already in `mutation-ui13` / `mutation-ui21`
- **series:** test-hygiene
- **verdict:** **SAFE** — unit-shared isolate:false leak flips later suites
- **CI / package.json callers:** `package.json` → `test:unit` (unit-shared)
- **target files:** `tests/unit/mutation-ui8-graph-ui.test.ts`, `mutation-ui16-graph-ui.test.ts`, `mutation-ui5-dice-ui.test.ts`, `mutation-ui-reduced-motion.test.ts`
- **measured baseline:** A/B `--project unit-shared --maxWorkers=1`: probe alone → `typeof matchMedia === 'undefined'`; after ui16/ui8/reduced-motion → `function`.
- **acceptance criteria:** Save/restore original descriptor in `afterEach` (ui13 style); double-define still ok; no product reduced-motion behavior change.
- **verification commands:** A/B probe as above; `rg -n 'matchMedia|afterEach' tests/unit/mutation-ui8-graph-ui.test.ts tests/unit/mutation-ui16-graph-ui.test.ts`
- **conflict notes:** not elementFromPoint/ResizeObserver/getContext prior ids; matchMedia only.
- **screen:** SAFE.

### q-mp-1325 · Tests: shard queens-guards seed-B fuzz early/late (~6s)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tests
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-postc4a7`)
- **depends-on:** leave seed-A wall `1291` / `#1415` alone
- **series:** test-hygiene
- **verdict:** **SAFE** — measured ~6.0s case; seed-A already split
- **CI / package.json callers:** `package.json` → `test:unit`
- **target files:** `tests/unit/state-roundtrip-fuzz-queens-b.test.ts` (+ helper windows in `tests/unit/helpers/state-roundtrip-fuzz-run.ts`; optional `QUEENS_SEED_B_SPLIT_MOVE`)
- **measured baseline:** `CI=1 npx vitest run --reporter=verbose --maxWorkers=1 tests/unit/state-roundtrip-fuzz-queens-b.test.ts` → case **~6021ms**, file **~6.6s**.
- **acceptance criteria:** Split early/late like seed-A (`queens-a` / `queens-a2`); coverage of seed-B moves unchanged; no wall-budget weakening of other engines.
- **verification commands:** `CI=1 npx vitest run --reporter=verbose --maxWorkers=1 tests/unit/state-roundtrip-fuzz-queens-b*.test.ts`
- **conflict notes:** not queens fuzz **wall** `1291`; seed-B only.
- **screen:** SAFE.

### q-mp-1326 · Scripts: emit-identity normalize must collapse spaces after `++`/`--`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-postc4a7`)
- **depends-on:** leave minify `#1407` / invalid-base `#1426` / demotes `1110` alone; **no** AI source edits
- **series:** script-tooling
- **verdict:** **SAFE** — insignificant `x++ / 2` vs `x++/2` looks like emit drift
- **CI / package.json callers:** `package.json` → `check:emit-identity`
- **target files:** `scripts/check-emit-identity.mjs` (`canStartRegexAt` / `stripCommentsAndCollapseWhitespace`)
- **measured baseline:** `stripCommentsAndCollapseWhitespace('return x++ / 2;')` ≠ `('return x++/2;')` (`equal: false`).
- **acceptance criteria:** Postfix `++`/`--` must not make `/` look like regex start for space collapse; true regex literals still preserved; minify/invalid-base paths unchanged.
- **verification commands:** hermetic normalize unit; `rg -n 'canStartRegexAt|stripCommentsAndCollapseWhitespace' scripts/check-emit-identity.mjs`
- **conflict notes:** not minify rename; not invalid `--base`.
- **screen:** SAFE.

### q-mp-1327 · Tests: ai-calibration `aggregate` must not count unknown winners as draws

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tests
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-postc4a7`)
- **depends-on:** none; **no** AI search/scoring/difficulty/timing edits in `src/`
- **series:** test-hygiene
- **verdict:** **SAFE** — harness miscategorises timeout/error as draws
- **CI / package.json callers:** ai-calibration helpers used by local calibration scripts / unit tests
- **target files:** `tests/helpers/ai-calibration/matrix.ts` (`aggregate`; mirror in `games.ts` if private twin exists)
- **measured baseline:** `aggregate([{winner:'timeout'},{winner:'error'},{winner:'player1'}])` → `{ draws: 2, p1Wins: 1, drawRate: 0.666… }`.
- **acceptance criteria:** Unknown winners excluded or tracked separately (tip-owner chooses); `player1`/`player2` rates honest; **no** product AI behavior change.
- **verification commands:** hermetic vitest; `rg -n 'winner === .player1|draws' tests/helpers/ai-calibration/matrix.ts`
- **conflict notes:** helper accounting only; not AI harness speed.
- **screen:** SAFE.

### q-mp-1328 · Scripts: `lint:ratchet` must not green-wash empty eslint stdout / ignored status

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-postc4a7`)
- **depends-on:** serialize with `1329`; leave report-only `1317` alone if parallel
- **series:** script-tooling
- **verdict:** **HOLD-CHECK** — CI-gating script live verdict
- **CI / package.json callers:** `package.json` → `lint:ratchet` (blocking via `verify`)
- **target files:** `scripts/check-lint-ratchet.mjs`
- **measured baseline:** `JSON.parse(result.stdout || '[]')`; `result.status` never read → empty stdout yields all-zero ok + exit 0.
- **acceptance criteria:** Non-zero eslint status and/or empty/non-array stdout → fail closed; valid JSON counts unchanged; ceilings may only go down.
- **verification commands:** hermetic mocked spawn unit; `rg -n 'result\\.status|stdout \\|\\|' scripts/check-lint-ratchet.mjs`
- **conflict notes:** CI gate; tip-owner folds carefully; not string-ceiling screened case alone.
- **screen:** HOLD-CHECK.

### q-mp-1329 · Scripts: `lint:ratchet` object / non-numeric ceilings must fail closed

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-postc4a7`)
- **depends-on:** serialize after `1328`
- **series:** script-tooling
- **verdict:** **HOLD-CHECK** — CI-gating live verdict
- **CI / package.json callers:** `package.json` → `lint:ratchet`
- **target files:** `scripts/check-lint-ratchet.mjs` (ceiling compare loop)
- **measured baseline:** `ceiling: {}` → `5 <= {}` false and `5 > {}` false → status `FAIL` printed but `failed` stays false → exit 0.
- **acceptance criteria:** Non-numeric ceiling values fail closed (exit ≠ 0) with a clear message; numeric ceilings unchanged; no upward ceiling edits.
- **verification commands:** hermetic unit with fixture ceilings; `rg -n 'count <= ceiling|failed' scripts/check-lint-ratchet.mjs`
- **conflict notes:** object residual beyond screened string-ceiling exit0; CI gate.
- **screen:** HOLD-CHECK.

### q-mp-1330 · Scripts: `typecheck:ratchet` fail closed on config / unparseable `error TSxxxx` lines

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-postc4a7`)
- **depends-on:** leave abs-path `IN_SCOPE` fail-open prior screened posture alone; **no** baseline upward edits
- **series:** script-tooling
- **verdict:** **HOLD-CHECK** — CI type ratchet live verdict
- **CI / package.json callers:** `package.json` → `typecheck:ratchet` (blocking via `verify`)
- **target files:** `scripts/check-type-ratchet.mjs` (`errorFile` / status handling)
- **measured baseline:** `error TS18003: No inputs were found…` → `errorFile` null → `outOfScope`, `inScope=0` → exit 0 despite `tsc` status≠0 (fail-closed only when `errorLines.length===0`).
- **acceptance criteria:** Config/input fatals without `file(line,col)` fail closed; real out-of-scope file errors still counted; Phase-2 ceiling may only go down.
- **verification commands:** hermetic unit with fixture lines; `rg -n 'errorFile|outOfScope|status !== 0' scripts/check-type-ratchet.mjs`
- **conflict notes:** distinct from abs-path `IN_SCOPE` fail-open; CI gate.
- **screen:** HOLD-CHECK.

## Verdict summary

| Id          | Verdict        | Title (short)                                             |
| ----------- | -------------- | --------------------------------------------------------- |
| `q-mp-1310` | **SAFE**       | memory-leak-heap: finite self_size / fmtMb                |
| `q-mp-1311` | **SAFE**       | ratchet-history: typePhase2 coerce numeric strings        |
| `q-mp-1312` | **SAFE**       | size:check: reject unknown/typo fail-on-new-over          |
| `q-mp-1313` | **SAFE**       | report-knip: --fail honor knip.error                      |
| `q-mp-1314` | **SAFE**       | memory-leak: reject all-unknown MEM_LEAK_GAMES            |
| `q-mp-1315` | **SAFE**       | memory-leak: live MEM_LEAK_DATE default                   |
| `q-mp-1316` | **SAFE**       | help-only-cli: reject unknown positionals                 |
| `q-mp-1317` | **SAFE**       | lint-buckets: empty eslint stdout ≠ all-zero              |
| `q-mp-1318` | **SAFE**       | mutation-report: ARITH skip NoSubstitutionTemplateLiteral |
| `q-mp-1319` | **SAFE**       | mutation-report: exclude infra error from score denom     |
| `q-mp-1320` | **SAFE**       | playtest harnesses: live OUT/date stamp                   |
| `q-mp-1321` | **SAFE**       | read-reporter-json: accept UTF-8 BOM                      |
| `q-mp-1322` | **SAFE**       | mutation-report-args: reject --max=1e2                    |
| `q-mp-1323` | **SAFE**       | chore: demote mutationTestGlobToRegExp export             |
| `q-mp-1324` | **SAFE**       | tests: restore matchMedia after ui stubs                  |
| `q-mp-1325` | **SAFE**       | tests: shard queens seed-B fuzz early/late                |
| `q-mp-1326` | **SAFE**       | emit-identity: normalize spaces after ++/--               |
| `q-mp-1327` | **SAFE**       | ai-calibration: unknown winners ≠ draws                   |
| `q-mp-1328` | **HOLD-CHECK** | lint:ratchet: empty stdout / ignored eslint status        |
| `q-mp-1329` | **HOLD-CHECK** | lint:ratchet: non-numeric ceiling fail-closed             |
| `q-mp-1330` | **HOLD-CHECK** | typecheck:ratchet: config fatals fail-closed              |

**Screened HOLD-CHECK (not queued — leave prior posture / tip-owner):**

| Topic                                                         | Why not queued                                                 |
| ------------------------------------------------------------- | -------------------------------------------------------------- |
| `check-boundaries` `typeof import()` counted as value edge    | CI-gating boundaries; sibling of prior `1201`–`1204`/`1220`    |
| `check-lint-ratchet` string ceiling → FAIL status but exit 0  | prior screened; this refill queues object residual as `1329`   |
| `check-type-ratchet` abs-path `IN_SCOPE` fail-open            | prior screened; `1330` is config-fatal residual only           |
| calla/deep-playtest `wins?` / `tie-break` end-regex residuals | exhausted deep-playtest end-regex family — leave prior posture |
| offline-probe-classify `.js` vs `.json` / `/three/` order     | exhausted probe-offline classify family — leave prior posture  |
| classifyVitest all-skipped → `survived`                       | exhausted classifyVitestRunResult family                       |
| engine-property fingerprint before (`1309`)                   | leave prior HOLD-CHECK id                                      |

**No HOLD** product tickets queued (AI / board-3d / rules / copy left out of scope).

## Out of scope / not used here

Already claimed / in-flight / HOLD / prompt-skipped families: ax `1292`–`1309` + `#1417`/`#1419`–`#1431`, aw `1271`–`1291`, av `1246`–`1270`, au `1222`–`1245`, at `1197`–`1220`, as–ao residuals, void/nnnull/nullish successors, eqeqeq product clear, lint-buckets **gate** fail-open, optional-chain product clears, knip demote / unusedTypes baseline drop, wiki **count** remasure, tip-name pointers, UI coverage rounds, soft-fail characterizations, mutation-audit **waves**, board-3d **src** / **mp3d e2e**, harness shards theater, demo coverage, page-ready / double-rAF / artifact-dir **adoptions** / mountPair / npm aliases / `--help`/`--dry-run`/argv empty-input / lib main-entry / cli-help spawn, license-classifier, pwa-manifest-contract / check-pwa-manifest, check-workflows, precache parser, check-build asset/precache, menu-critical-ref, md-link regex, check-copy-pins, summarizeKnip/diffMetrics, classifyVitestRunResult, flake-rate loops, heap/memory-leak **deltas**, prototype-restore after direct assigns, engine-coverage-rank, report-coverage-map, ratchet-history ceilings/mergeHistory/lint keys, env-number, render-perf/runtime-perf, mobile-audit, console-sweep, mutation-report games/hex globs, deep-playtest end regexes, PATH_RE root configs, PLAYTEST\_\* env docs, flattenKnip, eslint probe path, fab/fraction/calibration env, gotoGame baseURL, CycloneDX, nav-away-sweep, check-perf waitForUrl + runLighthouse JSON/stale, emit-identity minify + invalid base, queens fuzz wall, waitForGameReady load-error, offline board/recovered/dev date, report-licenses maps, mapGameChunks, withSeededRandom, storage-stubs, hex-ui styles, playtest BASE join/seed, queens e2e seed, type-ratchet phase2 docs, engine-property immutability, overnight mountPair/router batches, CI `e2e-cross-browser` yaml named script (`800`), dismissOwl deep-playtest (`879`), nav-away games (`1070`), emit-identity export demotes (`1110`), AI timing / Hex Hard 450ms / Stars & Bars history cap, visual-baseline PNG refresh (`1050`), boundaries HOLD-CHECK (`1201`–`1204`/`1220`), size soft MISSING (`1214`).

Filled to **21** with measured wrong-results + test hygiene only — **no filler** from exhausted families (honest shortfall vs 25).
