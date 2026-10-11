# Engineering backlog — 2026-10-11as (tip refill after post04d5 cut / round-45)

**Task id:** `q-mp-090as`  
**Role:** worker (report-only)  
**Tip audited:** `cursor/mp-tip-post04d5` @ `04d52597` (full `04d52597327b14abdc9c5cea3093d54746d73516`; tip cut from `alpha` after `#1304` fold of poste740 `#1298`–`#1303`/`#1305`–`#1319`)  
**Depends on:** tip `cursor/mp-tip-post04d5` @ `04d52597`. Round-44 backlog (`q-mp-090ar` / open `#1320` on old tip `poste740`, ids `q-mp-1147`…`1163`) — leave with `contained`; many ar SAFE ids already have open implementer drafts into **this** tip (`#1321`–`#1334`). Round-43 backlog (`q-mp-090aq` / tip-folded `#1319`, ids `q-mp-1122`…`1137`) — leave with `contained`. Tip HEAD continues to move as tip-owner folds green drafts — **rebase onto latest tip before opening worker PRs**.

## Purpose

The tip `cursor/mp-tip-post04d5` @ `04d52597` measures unit files **3402**; Chromium e2e **25** files / **249** cases; knip unusedExports **3** (LEAVE) / unusedTypes **29** / unusedFiles **0**. This doc lists **20 new** concrete engineering tasks (`q-mp-1172` … `q-mp-1191`) mined from the **live tip tree**, checked against prior refills through `q-mp-1163` (ar upload + `#1320`), aq/ap/ao on tip, and against the full open draft PR list (post04d5 `#1321`–`#1334`, poste740 leftovers `#1298`–`#1320`, older stacks). It is the **only** deliverable of `q-mp-090as`.

**Honest count:** Only **20** tasks — not padded to 25. Id range starts at `q-mp-1172` per round-45 brief (`1164`–`1171` remain unused / reserved; earlier reserved gaps `1138`–`1146`, `1115`–`1121`, etc. stay unused). Round-44 already claimed workflows hashFiles quoting/glob, precache Workbox `size`, menu single-quote/case, parenthetical md titles, `readReporterJson` null roots, `summarizeKnip` null root, baseline neg/frac, vitest filter-miss phrases, copy-pins `--fail` honesty, timeout-minutes bool, string concurrency, formatCounts `0/0`, check-dev-doc-links argv header, residual check:dev-docs hygiene — **do not** re-queue `1147`–`1163` (leave `#1320` + open tip implementers `#1321`–`#1334` with `contained`). This refill **does not** re-queue page-ready / double-rAF / artifact-dir / mountPair adoptions, npm aliases, `--help` / `--dry-run` / unknown-flag argv sweeps, empty-input / malformed-JSON guards as a family, lib main-entry guards, tip-name doc pointers, tip-stamp **count** remasures, knip unusedTypes baseline drop, Rank-3 demote theater, more cli-help spawn speedups, AI harness speed theater, license-classifier prose, pwa-manifest-contract tweaks, check-workflows bool / scalar-`on:` / job-permissions / cache-array parsing, precache spaced JSON / integrity / size (open `#1334`), menu-critical-ref quote/case/word-boundary (open `#1328`), or check-copy-pins matcher/banner (open `#1330`).

**Fresh payoffs on this tip (re-measured @ `04d52597` after ar queue + concurrent implementers noted):** **`summarizeKnip` still treats string `files` as `.length` (fake unusedFiles)** and **throws on `issues: [null]`** (null root / non-array `issues` owned by open `#1331` / `1154`+`1106b`), **`MD_LINK_RE` truncates destinations at the first `)`** so paren-in-path links never resolve (parenthetical _titles_ owned by open `#1329` / `1152`), **CommonMark `<destination>` angle brackets are not stripped**, **`symbolInFile` misses `export type { SeatId }`** (live `src/ui/seat-labels.ts`), **`PATH_RE` never checks `` `….d.mts` `` / `` `.mts` ``** (cited in `docs/dev/type-ratchet-batch-8.md`), **`parsePrecacheManifest` drops numeric `revision`** (size/integrity/spaced owned by `#1334`), **`auditSourcemapsAndBase` only sees double-quoted `src`/`href` so single-quoted relative assets false-clean**, **`Element.prototype.scrollIntoView = vi.fn()` leaks across `unit-shared`** (distinct from offsetWidth `#1333` / `1135`), **`HTMLCanvasElement.prototype.getContext` direct assign in burn-wave13 leaks**, **`classifyVitestRunResult("No tests found")` still → `killed`** after `#1323` phrase list, **`flake-rate-e2e` `walkSuite` ignores Playwright `flaky` result status**, **`check-build --help` still claims “Default path always exits 0” while `--wat` exits 2**, **`formatSummaryMarkdown` has zero external importers**, **dead-code Rank-2 yes: `FUZZ_PLAY_SEEDS` export** (local use only), **two slow unit files worth sharding** (`existing-games-controllers` ~2.7s / `burn-1008-registry-module-contract` ~1.7s), **`check-type-ratchet` string `outOfScopeErrors` disables Phase-2 ceiling**, and **`check-lint-ratchet` non-numeric ceiling can print FAIL while leaving `failed` false (exit 0)**.

**Preference:** SAFE, mutually independent **scripts/** wrong-results fixes, **docs-only** accuracy, or **tests-only** flake hygiene / wall trim. **Do not** queue another remasure of CI wall, bundle headroom, lint-bucket snapshot, copy-pins findings totals, boundaries/PWA thresholds, board-3d layout inventory, CI permissions, tip-pointer **count** stamps, open-draft triage, emit-identity inventory remasure, knip unusedTypes baseline drop, Rank-3 demote theater, dead-CSS Rank-1 rescan, wiki **count** cells, more cli-help spawn speedups, or more license-classifier / pwa-manifest-contract / workflows-bool theater. Anything in rules / AI / scoring / legal-move paths, player-facing copy, tutorials product edits, timing, Stars & Bars history cap, Hex Hard 450ms, board-3d **src** / **mp3d e2e**, or CI permissions widening is **HOLD**. **Do not** change fake-clock semantics. **Do not** edit `*/rules.ts`.

**Lint policy for this refill:** **no** new ceiling-key clears. Ratchet _schema_ hardening tickets are HOLD-CHECK only.

## Duplicate check (do not re-queue)

| Topic family                                                                                                                                                                                                              | Why skipped                                                                                                                                                                                                                                                                                                |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| round-44 ar `1147`–`1163` (+ open tip implementers `#1321`–`#1334`)                                                                                                                                                       | leave with `contained`; this refill’s knip / precache / md-link tickets are **only** files-typeof, null issue elements, MD_LINK capture, angle destinations, numeric revision, audit single-quote — not siblings of null-root, parenthetical titles, size/integrity, hashFiles, copy-pins, menu quote/case |
| round-43 aq `1122`–`1137`                                                                                                                                                                                                 | tip-folded `#1319` + open implementers — leave with `contained`                                                                                                                                                                                                                                            |
| round-42…32 / page-ready / double-rAF / artifact-dir / mountPair / npm aliases / `--help`/`--dry-run`/argv / lib main-entry / empty-input argv / cli-help spawn theater                                                   | prompt hard-skip + open drafts / tip folds — leave with `contained`                                                                                                                                                                                                                                        |
| license-classifier / pwa-manifest-contract / check-workflows bool parsing                                                                                                                                                 | prompt hard-skip for this round                                                                                                                                                                                                                                                                            |
| CI `e2e-cross-browser` named script (`800`) / dismissOwl deep-playtest (`879`)                                                                                                                                            | tip-queued; unworked — **do not** re-queue                                                                                                                                                                                                                                                                 |
| deep-playtest / star-track / docs-playtest waits                                                                                                                                                                          | leave prior ids                                                                                                                                                                                                                                                                                            |
| visual-baseline PNG refresh (`1050`) / diagnose (`1093`/`1113`) / offsetWidth (`1135` open `#1333`)                                                                                                                       | leave with `contained`                                                                                                                                                                                                                                                                                     |
| nested flake-e2e (`1052`) / emit string/regex normalize (`1053`/`1086`) / menu quote+query (`1088`) / boundaries inline type (`1089`) / permissions read-all (`1091`) / owl flake (`1092`) / proprietary license (`1081`) | leave prior ids / open drafts                                                                                                                                                                                                                                                                              |
| knip unusedExports LEAVE / unusedTypes baseline drop / Rank-3 demotes                                                                                                                                                     | remasure theater skipped; product LEAVE exports untouched                                                                                                                                                                                                                                                  |
| tip-name pointers                                                                                                                                                                                                         | prompt hard-skip (live tip is `post04d5`; AGENTS/wiki still name `poste740` — tip-owner fold concern, not this refill)                                                                                                                                                                                     |
| AI determinism / quality shard wall times / queens fuzz further trim                                                                                                                                                      | **HOLD** — AI harness                                                                                                                                                                                                                                                                                      |
| AI-timing / Hex Hard 450ms / history-cap / rules.ts / copy / scoring / CI permissions / eqeqeq in `fiar/rules.ts`                                                                                                         | hard-rule HOLD                                                                                                                                                                                                                                                                                             |
| wiki / testing-layers **count** remasure                                                                                                                                                                                  | prompt hard-skip tip-stamp theater                                                                                                                                                                                                                                                                         |

Also skipped: Merom / Sullivan / data-center / grants / nonprofit; `pappas-infrastructure`; meromhouse agents; any CI `permissions` widening. No `memory/` files.

## Stale queue re-check (live tip `04d52597`)

| Id                                 | Title (short)                           | Verdict                              | Evidence @ `04d52597`                                             |
| ---------------------------------- | --------------------------------------- | ------------------------------------ | ----------------------------------------------------------------- |
| `q-mp-090ar` / `#1320`             | round-44 backlog                        | **open on old tip `poste740`**       | This refill starts at `1172`; do not re-queue `1147`–`1163`.      |
| `#1321`–`#1334`                    | ar/aq SAFE implementers into `post04d5` | **open on this tip**                 | Leave with `contained`; serialize shared files.                   |
| `q-mp-090aq` / `#1319`             | round-43 backlog                        | **tip-folded** via `#1304`           | leave with `contained`.                                           |
| `q-mp-1122`…`1137` / `1147`…`1163` | aq/ar gaps                              | **still-valid or in-flight**         | leave prior ids; do not sibling.                                  |
| `q-mp-800`                         | CI cross-browser named script           | **tip-queued; unworked**             | Live `ci.yml` still bare projects — **do not** re-queue.          |
| `q-mp-879`                         | dismissOwl deep-playtest adopters       | **still-valid; no open PR**          | Leave prior id.                                                   |
| `q-mp-1050`                        | visual-baseline refresh                 | **still-valid**                      | Leave prior id.                                                   |
| Dead-code Rank-2 yes               | live dry-run                            | **1 yes** (`FUZZ_PLAY_SEEDS` export) | Queued as `1186` demote-export only.                              |
| offsetWidth A/B                    | open `#1333` / `1135`                   | **in-flight**                        | leave with `contained`; scrollIntoView / getContext are distinct. |

## Shared-file conflict flags

| Shared file                                                           | Conflicting new ids                                                                        |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `scripts/report-knip.mjs`                                             | `1172` + `1173` — serialize after open `#1331` (`1154`/`1106b`)                            |
| `scripts/check-dev-doc-links.mjs`                                     | `1174` + `1175` + `1176` + `1177` — serialize; leave open `#1329` (`1152`) + `#1324` alone |
| `scripts/check-build.mjs`                                             | `1178` + `1179` + `1184` — serialize after open `#1334` (`1125`/`1126`/`1149`)             |
| `tests/unit/game-selector.test.ts` (+ other scrollIntoView polluters) | `1180` only; leave `#1333`/`1135` alone                                                    |
| `tests/unit/burn-wave13-secondary-ui.test.ts`                         | `1181` only                                                                                |
| `scripts/lib/mutation-report-vitest-status.mjs`                       | `1182` only; serialize after open `#1323` (`1156`)                                         |
| `scripts/flake-rate-e2e-loop.mjs`                                     | `1183` only; leave `1052` nested-suite alone                                               |
| `scripts/report-licenses.mjs`                                         | `1185` only; leave license-classifier open drafts alone                                    |
| `tests/unit/helpers/state-roundtrip-fuzz-run.ts`                      | `1186` only; leave `#1318`/`1108` shard alone                                              |
| `tests/unit/existing-games-controllers.test.ts`                       | `1187` only                                                                                |
| `tests/unit/burn-1008-registry-module-contract.test.ts`               | `1188` only                                                                                |
| `scripts/check-type-ratchet.mjs`                                      | `1189` only                                                                                |
| `scripts/check-lint-ratchet.mjs`                                      | `1190` only                                                                                |
| `scripts/report-dead-code.mjs`                                        | `1191` only                                                                                |

**Parallel-friendly:** `1172`, `1174`, `1178`, `1180`, `1181`, `1182`, `1183`, `1185`, `1186`, `1187`, `1188`, `1189`, `1190`, `1191`. Serialize `1172`→`1173`; serialize `1174`→`1175`→`1176`→`1177`; serialize `1178`→`1179`→`1184`.

## Live tip measurements (evidence snapshot @ `04d52597`)

```text
$ git rev-parse HEAD
  04d52597327b14abdc9c5cea3093d54746d73516

$ git branch --show-current
  cursor/mp-tip-post04d5 (audited) / cursor/backlog-2026-10-11as-e953 (this PR)

$ find tests/unit \( -name '*.test.ts' -o -name '*.spec.ts' \) ! -path '*/_tokenmaxx_archive/*' | wc -l
  3402

$ npm run test:e2e:chromium -- --list
  Total: 249 tests in 25 files

$ npm run report:knip -- --json
  unusedExports: 3  unusedTypes: 29  unusedFiles: 0
  (NOTICE unusedTypes 36→29 shrink vs committed baseline 36 — baseline write NOT queued)

$ summarizeKnip({ files: "abc", issues: [] })
  → unusedFiles: 3   (string length — fake growth risk under --fail)
$ summarizeKnip({ files: [], issues: [null] })
  → throw Cannot read properties of null (reading 'exports')
$ summarizeKnip(null)
  → throw (owned by open #1331 / 1154)

$ MD_LINK_RE = /\]\(([^)]+)\)/g
  md link dest file_(draft).md → MD_LINK_RE capture stops at first ')'
  stripMdLinkTitle("<../wiki/development.md>") → unchanged with brackets
  resolveMdLink(..., "<../wiki/development.md>") → docs/dev/<../wiki/development.md>

$ symbolInFile patterns vs src/ui/seat-labels.ts
  export type { SeatId } from '../core/seats';  → false (miss)

$ PATH_RE extensions ts|tsx|js|mjs|css|md|json
  `scripts/check-build.d.mts` → no match (file exists; cited in type-ratchet-batch-8.md)
  `scripts/check-build.mjs` → match

$ parsePrecacheManifest
  [{url:"/a.js",revision:"1"}] → 1 entry
  [{url:"/a.js",revision:42}] → []
  [{url:"/a.js",revision:0}] → []
  [{url:"/a.js",revision:"1",size:12}] → []  (owned by #1334 / 1149)

$ auditSourcemapsAndBase htmlNonRootAssetRefs
  <script src="./a.js"> → ['./a.js']
  <script src='./b.js'> → []   (false-clean)

$ scrollIntoView A/B (unit-shared, --no-file-parallelism --maxWorkers=1)
  probe alone → PASS
  game-selector.test.ts then probe → FAIL (leftover vi.fn mock)

$ getContext A/B
  probe alone → PASS
  burn-wave13-secondary-ui.test.ts then probe → FAIL (direct assign + restoreAllMocks)

$ classifyVitestRunResult
  "No test files found" → error  (1038)
  "Found 0 test files" / "filter matched no files" → killed on tip; → error in open #1323
  "No tests found" → killed  (NEW — not in #1323 list)

$ flake-rate-e2e walkSuite
  status flaky|interrupted|skipped → neither passed nor failed (undercount)

$ check-build --help
  includes "Default path always exits 0"
$ check-build --wat → exit 2

$ formatSummaryMarkdown — only defined + self-called in report-licenses.mjs

$ npm run report:dead-code -- --dry-run
  Safe-to-remove yes: 1 — FUZZ_PLAY_SEEDS export (same-file loop only)

$ existing-games-controllers.test.ts (unit-isolated) → ~2675ms / 67 tests
$ burn-1008-registry-module-contract.test.ts (unit-isolated) → ~1701ms / 129 tests

$ type-ratchet: prev.outOfScopeErrors = "5" → ceiling undefined → no FAIL
$ lint-ratchet: ceiling "abc", count 10 → status prints FAIL but failed=false (exit 0)

$ npm run check:workflows → OK — 2 file(s): ci.yml, deploy.yml
$ npm run check:dev-docs → problems: 4 (pre-existing af/ap only)

$ Open drafts into cursor/mp-tip-post04d5 at audit: #1321–#1334
$ Round-44 backlog still open on poste740: #1320
$ Tip→alpha fold open: #1326 (q-mp-026y)
```

Baselines also captured under `/opt/cursor/artifacts/q-mp-090as-baselines.log` … `q-mp-090as-baselines-final.log`.

## New tasks

### q-mp-1172 · Scripts: `summarizeKnip` reject non-array `files` (no string `.length`)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post04d5`)
- **depends-on:** serialize after open `#1331` (`1154`/`1106b`); leave baseline schema `#1321`/`1155` alone
- **series:** script-tooling
- **verdict:** **SAFE** — string `files` yields fake `unusedFiles` via `.length` and can trip `--fail` growth
- **CI / package.json callers:** `package.json` → `report:knip` (report-only CI job)
- **target files:** `scripts/report-knip.mjs` (`summarizeKnip`); unit fixtures
- **measured baseline:** `summarizeKnip({ files: "abc", issues: [] })` → `unusedFiles: 3`; `summarizeKnip({ files: 7, issues: [] })` → `unusedFiles: undefined` (missing key / NaN risk depending on Result shape after `#1331`).
- **acceptance criteria:** Non-array `files` is treated as unparseable or zeroed without using string length; array `files` unchanged; live knip metrics unchanged.
- **verification commands:** `CI=1 npx vitest run tests/unit/*knip*.test.ts` ; `npm run report:knip -- --json`
- **conflict notes:** not null-root / non-array `issues` (`1154`/`1106b` / `#1331`).
- **screen:** SAFE.

### q-mp-1173 · Scripts: `summarizeKnip` must not throw on null/undefined `issues[]` elements

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post04d5`)
- **depends-on:** `1172` lightly; serialize after `#1331`
- **series:** script-tooling
- **verdict:** **SAFE** — array-shaped `issues` with null holes must be total
- **CI / package.json callers:** `package.json` → `report:knip`
- **target files:** `scripts/report-knip.mjs` (`summarizeKnip` / `countIssueField` call sites); unit fixtures
- **measured baseline:** `summarizeKnip({ files: [], issues: [null] })` → throws `Cannot read properties of null (reading 'exports')`.
- **acceptance criteria:** Null/undefined issue elements are skipped (or mark unparseable) without throw; well-formed issue objects unchanged.
- **verification commands:** `CI=1 npx vitest run tests/unit/*knip*.test.ts`
- **conflict notes:** serialize after `1172` / `#1331`.
- **screen:** SAFE.

### q-mp-1174 · Scripts: `MD_LINK_RE` must not truncate destinations at the first `)`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post04d5`)
- **depends-on:** serialize with open `#1329` (`1152`); leave quoted-title `#1307`/`1095` alone
- **series:** script-tooling
- **verdict:** **SAFE** — CommonMark destinations may contain `(` `)`; capture bug yields false broken-md-link
- **CI / package.json callers:** `package.json` → `check:dev-docs`
- **target files:** `scripts/check-dev-doc-links.mjs` (`MD_LINK_RE` / link walk); unit fixtures
- **measured baseline:** Markdown link whose destination is `file_(draft).md` → `MD_LINK_RE` capture stops at the first `)`; title strip cannot recover.
- **acceptance criteria:** Balanced paren-in-path destinations resolve; quoted titles with inner `()` still strip correctly after capture; live `check:dev-docs` does not regress (af/ap self-hits remain prior ids).
- **verification commands:** `npm run check:dev-docs` ; `CI=1 npx vitest run tests/unit/*dev-doc*.test.ts`
- **conflict notes:** not parenthetical _title_ suffix (`1152`); this is the capture itself.
- **screen:** SAFE.

### q-mp-1175 · Scripts: strip CommonMark `<destination>` angle brackets in md links

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post04d5`)
- **depends-on:** `1174` lightly; serialize with `#1329`
- **series:** script-tooling
- **verdict:** **SAFE** — CommonMark allows `<path with spaces.md>`; brackets currently become part of the FS path
- **CI / package.json callers:** `package.json` → `check:dev-docs`
- **target files:** `scripts/check-dev-doc-links.mjs` (`stripMdLinkTitle` / `resolveMdLink`); unit fixtures
- **measured baseline:** `stripMdLinkTitle("<../wiki/development.md>")` → unchanged with brackets; `resolveMdLink` → `docs/dev/<../wiki/development.md>` while real `docs/wiki/development.md` exists.
- **acceptance criteria:** Leading/trailing `<>` stripped before resolve; non-angle paths unchanged; no product copy edits.
- **verification commands:** `npm run check:dev-docs` ; `CI=1 npx vitest run tests/unit/*dev-doc*.test.ts`
- **conflict notes:** serialize after `1174`.
- **screen:** SAFE.

### q-mp-1176 · Scripts: `symbolInFile` accept `export type { Foo }`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post04d5`)
- **depends-on:** serialize with `1174`–`1177`
- **series:** script-tooling
- **verdict:** **SAFE** — type-only re-export barrels false-miss today
- **CI / package.json callers:** `package.json` → `check:dev-docs`
- **target files:** `scripts/check-dev-doc-links.mjs` (`symbolInFile`); unit fixtures
- **measured baseline:** patterns match `export type Foo` and `export { type Foo }` but not `export type { Foo }`; live `src/ui/seat-labels.ts` `SeatId` → false.
- **acceptance criteria:** `export type { Sym }` / `export type { Sym as Alias }` detected for `Sym` (and alias if desired); existing patterns unchanged; no false positives on comments.
- **verification commands:** `CI=1 npx vitest run tests/unit/*dev-doc*.test.ts` ; `npm run check:dev-docs`
- **conflict notes:** not boundaries inline-type import (`1089`).
- **screen:** SAFE.

### q-mp-1177 · Scripts: `PATH_RE` include `.mts` / `.d.mts` backtick paths

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post04d5`)
- **depends-on:** serialize after `1176`
- **series:** script-tooling
- **verdict:** **SAFE** — real docs cite `.d.mts` companions that are never checked
- **CI / package.json callers:** `package.json` → `check:dev-docs`
- **target files:** `scripts/check-dev-doc-links.mjs` (`PATH_RE` + table path allowlist if needed); unit fixtures
- **measured baseline:** `` `scripts/check-build.d.mts` `` → no `PATH_RE` match; file exists; cited in `docs/dev/type-ratchet-batch-8.md`.
- **acceptance criteria:** `.mts` / `.d.mts` under `src|tests|docs|scripts` are path-checked like `.mjs`; missing ones report; existing extensions unchanged.
- **verification commands:** `npm run check:dev-docs` ; `CI=1 npx vitest run tests/unit/*dev-doc*.test.ts`
- **conflict notes:** serialize after `1174`–`1176`.
- **screen:** SAFE.

### q-mp-1178 · Scripts: `parsePrecacheManifest` accept numeric `revision`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post04d5`)
- **depends-on:** serialize after open `#1334` (`1125`/`1126`/`1149`)
- **series:** script-tooling
- **verdict:** **SAFE** — Workbox may emit numeric revision; dropping the entry is a false precache miss
- **CI / package.json callers:** `package.json` → `check:build` / size path via `scripts/check-build.mjs` helpers
- **target files:** `scripts/check-build.mjs` (`parsePrecacheManifest`); unit fixtures
- **measured baseline:** `revision:"1"` → 1 entry; `revision:42` → `[]`; `revision:0` → `[]`. Size/integrity still owned by `#1334`.
- **acceptance criteria:** Finite numeric revisions (including `0`) accepted and stringified consistently; invalid revisions still drop; size/integrity behavior left to `#1334`.
- **verification commands:** `CI=1 npx vitest run tests/unit/check-build-helpers.test.ts tests/unit/*precache*.test.ts`
- **conflict notes:** not spaced JSON / integrity / size (`1125`/`1126`/`1149`).
- **screen:** SAFE.

### q-mp-1179 · Scripts: `auditSourcemapsAndBase` accept single-quoted `src` / `href`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post04d5`)
- **depends-on:** serialize with `1178`; leave menu `#1328` alone (different helper)
- **series:** script-tooling
- **verdict:** **SAFE** — single-quoted relative assets currently false-clean the non-root audit
- **CI / package.json callers:** `package.json` → `check:build`
- **target files:** `scripts/check-build.mjs` (`auditSourcemapsAndBase`); unit fixtures
- **measured baseline:** `src="./a.js"` → listed in `htmlNonRootAssetRefs`; `src='./b.js'` → omitted.
- **acceptance criteria:** Single-quoted relative asset refs collected like double-quoted; root-absolute `/…` still excluded from non-root list; manifest checks unchanged.
- **verification commands:** `CI=1 npx vitest run tests/unit/check-build-helpers.test.ts`
- **conflict notes:** not `parseMenuCriticalRefs` (`1150`/`1151`/`1132`).
- **screen:** SAFE.

### q-mp-1180 · Tests: restore `Element.prototype.scrollIntoView` after direct `vi.fn` assign

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 tests
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post04d5`)
- **depends-on:** leave open `#1333` / `1135` offsetWidth alone
- **series:** test-flake
- **verdict:** **SAFE** — order-dependent `unit-shared` pollution; proven A/B
- **CI / package.json callers:** CI `unit` job (`unit-shared` project)
- **target files:** polluters including `tests/unit/game-selector.test.ts`, `tests/unit/burn-wave44-ui-selector-*.test.ts`, `tests/unit/mutation-ui4-game-selector.test.ts`, `tests/unit/burn-1010-ui-cov-r29-hex-a-gone.test.ts` (re-measure list before edit); optionally shared setup restore
- **measured baseline:** probe alone PASS; `game-selector.test.ts` then probe FAIL (`scrollIntoView` still a vitest mock). `vi.restoreAllMocks()` does not undo direct prototype assignment.
- **acceptance criteria:** Save/restore descriptor or `vi.spyOn`+`mockRestore` in `afterEach`; same A/B stays PASS; no product UI behavior change.
- **verification commands:** `CI=1 npx vitest run <polluter> <probe> --project unit-shared --no-file-parallelism --maxWorkers=1`
- **conflict notes:** not offsetWidth/Height (`1135`).
- **screen:** SAFE.

### q-mp-1181 · Tests: restore `HTMLCanvasElement.prototype.getContext` after burn-wave13 assign

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tests
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post04d5`)
- **depends-on:** none; leave mp3d board-3d getContext tests alone (HOLD surface)
- **series:** test-flake
- **verdict:** **SAFE** — direct assign + `restoreAllMocks` leak across `unit-shared`
- **CI / package.json callers:** CI `unit` job
- **target files:** `tests/unit/burn-wave13-secondary-ui.test.ts` (Juggle board case)
- **measured baseline:** probe alone PASS; after burn-wave13 FAIL (`getContext` leftover `vi.fn`).
- **acceptance criteria:** Restore original `getContext` in `afterEach` / try/finally; A/B PASS; no canvas product changes.
- **verification commands:** `CI=1 npx vitest run tests/unit/burn-wave13-secondary-ui.test.ts <probe> --project unit-shared --no-file-parallelism --maxWorkers=1`
- **conflict notes:** do not broaden into mp3d lifecycle suites in this id.
- **screen:** SAFE.

### q-mp-1182 · Scripts: `classifyVitestRunResult` treat `No tests found` as `error`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post04d5`)
- **depends-on:** serialize after open `#1323` (`1156`); leave `1038` alone
- **series:** script-tooling
- **verdict:** **SAFE** — Vitest short phrase must not score as mutant kill
- **CI / package.json callers:** `scripts/mutation-report.mjs` via `scripts/lib/mutation-report-vitest-status.mjs` (report-only)
- **target files:** `scripts/lib/mutation-report-vitest-status.mjs`; unit fixtures
- **measured baseline @ tip:** `No tests found` → `killed`; `#1323` covers `Found 0 test files` / `filter matched no files` but not this phrase.
- **acceptance criteria:** `No tests found` (and close siblings if tip-owner agrees) → `error`; assertion failures stay `killed`; timeout unchanged.
- **verification commands:** `CI=1 npx vitest run tests/unit/mutation-report-vitest-status.test.ts`
- **conflict notes:** extend `#1323` patterns only.
- **screen:** SAFE.

### q-mp-1183 · Scripts: `flake-rate-e2e` count Playwright `flaky` results

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post04d5`)
- **depends-on:** leave nested-suite walk `1052` / open `#1295` alone; leave `readReporterJson` `#1325`/`1153` alone
- **series:** script-tooling
- **verdict:** **SAFE** — a flake-rate tool that ignores `status: "flaky"` undercounts flakes
- **CI / package.json callers:** `scripts/flake-rate-e2e-loop.mjs` (not CI-gating)
- **target files:** `scripts/flake-rate-e2e-loop.mjs` (`walkSuite` / ingest); unit fixtures if present
- **measured baseline:** `walkSuite` only increments on `passed|expected` / `failed|timedOut|unexpected`; `flaky` is ignored (stats.flaky used only when present on root stats).
- **acceptance criteria:** Per-result `flaky` increments flake counters / fails ok when appropriate; nested suite behavior left to `1052`; null-root JSON left to `1153`.
- **verification commands:** `CI=1 npx vitest run tests/unit/*flake-rate*.test.ts` (or add focused unit coverage)
- **conflict notes:** not nested-suite recursion (`1052`).
- **screen:** SAFE.

### q-mp-1184 · Docs: `check-build --help` stop claiming default path always exits 0

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post04d5`)
- **depends-on:** serialize after `1178`/`1179` if same PR wave; leave file header (already mentions exit 2) + folded `#1299`/`1094` alone
- **series:** docs-accuracy
- **verdict:** **SAFE** — help text disagrees with live unknown-flag exit **2**
- **CI / package.json callers:** n/a (help string only)
- **target files:** `scripts/check-build.mjs` (`printHelp` string)
- **measured baseline:** `--help` includes `Default path always exits 0`; `--wat` → exit **2**. File header already documents exit 2.
- **acceptance criteria:** Help matches header/live semantics; no audit logic change.
- **verification commands:** `node scripts/check-build.mjs --help` ; `node scripts/check-build.mjs --wat; echo $?`
- **conflict notes:** residual after `#1299` header fix; not precache logic.
- **screen:** SAFE.

### q-mp-1185 · Chore: demote dead export `formatSummaryMarkdown`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 chore
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post04d5`)
- **depends-on:** leave license-classifier open drafts (`#1327` / `#1313` / …) alone — demote only this symbol
- **series:** dead-export
- **verdict:** **SAFE** — zero external importers; keep as file-local helper
- **CI / package.json callers:** `package.json` → `report:licenses` (behavior unchanged)
- **target files:** `scripts/report-licenses.mjs` (+ `.d.mts` if the export is declared there)
- **measured baseline:** `rg` importers outside defining file: none; only self-call at summary write.
- **acceptance criteria:** Symbol un-exported (or moved to non-export); CLI summary output byte-identical; no classifyLicense changes.
- **verification commands:** `npm run report:licenses` (or unit helpers) ; `rg -n "formatSummaryMarkdown" --glob '!*.d.mts'`
- **conflict notes:** not Affero/LGPL/… prose (`1127`–`1131`).
- **screen:** SAFE.

### q-mp-1186 · Chore: demote export `FUZZ_PLAY_SEEDS` (keep file-local)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 chore
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post04d5`)
- **depends-on:** leave open `#1318` / `1108` shard alone
- **series:** dead-export
- **verdict:** **SAFE** — dead-code Rank-2 yes; only same-file use
- **CI / package.json callers:** unit tests importing the helper module (seed loop stays)
- **target files:** `tests/unit/helpers/state-roundtrip-fuzz-run.ts`
- **measured baseline:** `npm run report:dead-code -- --dry-run` → Safe-to-remove yes: 1 (`FUZZ_PLAY_SEEDS`); `rg` shows define + same-file `for (const seed of FUZZ_PLAY_SEEDS)` only.
- **acceptance criteria:** Drop `export` (keep `const`); fuzz behavior unchanged; dead-code yes count for this symbol clears.
- **verification commands:** `CI=1 npx vitest run tests/unit/*state-roundtrip*` ; `npm run report:dead-code -- --dry-run`
- **conflict notes:** not fuzz shard wall (`1108`).
- **screen:** SAFE.

### q-mp-1187 · Tests: shard `existing-games-controllers` for parallel wall trim

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tests
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post04d5`)
- **depends-on:** none
- **series:** test-speed
- **verdict:** **SAFE** — isolate:true monolith; split preserves asserts
- **CI / package.json callers:** CI `unit` job (`unit-isolated`)
- **target files:** `tests/unit/existing-games-controllers.test.ts` → ≥3 files by existing describe/wave boundaries
- **measured baseline:** ~**2675ms** wall / **67** tests (`CI=1 npx vitest run … --project unit-isolated --reporter=json`).
- **acceptance criteria:** Same asserts; multi-worker parallel wall **&lt; ~1.2s** (measure with durations/json); no AI/scoring/rules edits.
- **verification commands:** `CI=1 npx vitest run tests/unit/existing-games-controllers*.test.ts --project unit-isolated --reporter=json`
- **conflict notes:** not AI harness speed theater.
- **screen:** SAFE.

### q-mp-1188 · Tests: shard `burn-1008-registry-module-contract` for parallel wall trim

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tests
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post04d5`)
- **depends-on:** none
- **series:** test-speed
- **verdict:** **SAFE** — large isolate:true contract file
- **CI / package.json callers:** CI `unit` job (`unit-isolated`)
- **target files:** `tests/unit/burn-1008-registry-module-contract.test.ts` → 2–3 files (import-contract vs destroy-idempotency)
- **measured baseline:** ~**1701ms** wall / **129** tests.
- **acceptance criteria:** Asserts unchanged; parallel wall **&lt; ~0.9s**; no product registry behavior change.
- **verification commands:** `CI=1 npx vitest run tests/unit/burn-1008-registry-module-contract*.test.ts --project unit-isolated --reporter=json`
- **conflict notes:** scrollIntoView polluter lines in this file stay owned by `1180` if present — coordinate restores.
- **screen:** SAFE.

### q-mp-1189 · Scripts: `check-type-ratchet` reject non-number Phase-2 ceiling

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post04d5`)
- **depends-on:** tip-owner skim (ratchet gate)
- **series:** script-tooling
- **verdict:** **HOLD-CHECK** — string `outOfScopeErrors` makes `ceiling` undefined and disables FAIL
- **CI / package.json callers:** `package.json` → `typecheck:ratchet` (blocking `verify` / CI lint)
- **target files:** `scripts/check-type-ratchet.mjs`; unit fixtures if present
- **measured baseline:** `typeof prev.outOfScopeErrors === 'number' ? … : prev.totals?.outOfScopeErrors` with `{ outOfScopeErrors: "5" }` → `ceiling === undefined` → no enforcement even if out-of-scope length is high.
- **acceptance criteria:** Non-number / non-integer ceilings fail closed (corrupt baseline) or coerce only via explicit numeric parse tip-owner chooses; live baseline still green.
- **verification commands:** `npm run typecheck:ratchet` ; focused unit probes
- **conflict notes:** touches CI-gating ratchet script — HOLD-CHECK.
- **screen:** HOLD-CHECK — ratchet gate schema.

### q-mp-1190 · Scripts: `check-lint-ratchet` fail closed on non-numeric ceilings

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post04d5`)
- **depends-on:** tip-owner skim (ratchet gate); **no** ceiling-key clears
- **series:** script-tooling
- **verdict:** **HOLD-CHECK** — non-numeric ceiling can print FAIL while `failed` stays false (exit 0)
- **CI / package.json callers:** `package.json` → `lint:ratchet` (blocking `verify`)
- **target files:** `scripts/check-lint-ratchet.mjs`; unit fixtures if present
- **measured baseline:** `ceiling: "abc"`, `count: 10` → status string `FAIL` but `count > ceiling` is false → process still exits 0.
- **acceptance criteria:** Non-finite / non-integer ceilings are schema errors (exit non-zero) or rejected before compare; live numeric ceilings unchanged; **do not** lower any ceiling keys in this ticket.
- **verification commands:** `npm run lint:ratchet` ; focused unit probes
- **conflict notes:** HOLD-CHECK — CI-gating ratchet; no eqeqeq product clear.
- **screen:** HOLD-CHECK — ratchet gate schema.

### q-mp-1191 · Docs: `report-dead-code.mjs` header note unknown-flag exit 2

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post04d5`)
- **depends-on:** none; **do not** implement new argv theater
- **series:** docs-accuracy
- **verdict:** **SAFE** — header “Always exits 0 on a successful report run” omits unknown-flag exit **2**
- **CI / package.json callers:** n/a (comment only)
- **target files:** `scripts/report-dead-code.mjs` (file header)
- **measured baseline:** Header claims always exit 0 on successful report; `node scripts/report-dead-code.mjs --wat` → exit **2**.
- **acceptance criteria:** Header states report-only success → 0 and unknown flags → 2; **no** CLI behavior change in this ticket.
- **verification commands:** `rg -n 'Always exits 0|exit 2|Unknown flag' scripts/report-dead-code.mjs` ; `node scripts/report-dead-code.mjs --wat; echo $?`
- **conflict notes:** docs-only; argv implementation is prompt-skipped theater.
- **screen:** SAFE.

## Verdict summary

| Id          | Verdict        | Title (short)                                               |
| ----------- | -------------- | ----------------------------------------------------------- |
| `q-mp-1172` | **SAFE**       | summarizeKnip: non-array `files` must not use string length |
| `q-mp-1173` | **SAFE**       | summarizeKnip: null issue elements must not throw           |
| `q-mp-1174` | **SAFE**       | MD_LINK_RE: paren-in-path destinations                      |
| `q-mp-1175` | **SAFE**       | md links: strip `<destination>` angle brackets              |
| `q-mp-1176` | **SAFE**       | symbolInFile: `export type { Foo }`                         |
| `q-mp-1177` | **SAFE**       | PATH_RE: include `.mts` / `.d.mts`                          |
| `q-mp-1178` | **SAFE**       | parsePrecacheManifest: numeric revision                     |
| `q-mp-1179` | **SAFE**       | auditSourcemapsAndBase: single-quoted src/href              |
| `q-mp-1180` | **SAFE**       | tests: restore scrollIntoView prototype                     |
| `q-mp-1181` | **SAFE**       | tests: restore getContext after burn-wave13                 |
| `q-mp-1182` | **SAFE**       | classifyVitestRunResult: `No tests found` → error           |
| `q-mp-1183` | **SAFE**       | flake-rate-e2e: count Playwright `flaky`                    |
| `q-mp-1184` | **SAFE**       | check-build help: exit semantics honesty                    |
| `q-mp-1185` | **SAFE**       | demote formatSummaryMarkdown export                         |
| `q-mp-1186` | **SAFE**       | demote FUZZ_PLAY_SEEDS export                               |
| `q-mp-1187` | **SAFE**       | shard existing-games-controllers wall                       |
| `q-mp-1188` | **SAFE**       | shard burn-1008-registry-module-contract wall               |
| `q-mp-1189` | **HOLD-CHECK** | type-ratchet: reject non-number Phase-2 ceiling             |
| `q-mp-1190` | **HOLD-CHECK** | lint-ratchet: fail closed on non-numeric ceilings           |
| `q-mp-1191` | **SAFE**       | report-dead-code header: unknown-flag exit 2                |

**Screened HOLD-CHECK (2):** `1189`, `1190` — tip-owner should skim before fold (CI-gating ratchet schema).  
**No HOLD** product tickets queued (AI / board-3d / rules / copy left out of scope).

## Out of scope / not used here

Already claimed / in-flight / HOLD / no headroom / prompt-skipped families: ar `1147`–`1163` + open tip implementers `#1321`–`#1334`, aq `1122`–`1137`, ap/ao residuals, void/nnnull/nullish successors, eqeqeq product clear (`fiar/rules.ts` HOLD), lint-buckets eqeqeq probe, optional-chain product clears, knip demote / unusedTypes baseline drop, wiki **count** remasure, tip-name pointers, UI coverage rounds, soft-fail characterizations, mutation-audit **waves**, board-3d **src** / **mp3d e2e** wait clears, harness shards, demo coverage, page-ready / double-rAF / artifact-dir / mountPair / npm aliases / `--help`/`--dry-run`/argv / empty-input / lib main-entry / cli-help spawn speedups, license-classifier siblings, pwa-manifest-contract tweaks, check-workflows bool/scalar-on/permissions/cache-array/hashFiles, deep-playtest `waitForTimeout`, overnight mountPair/router batches, rounds ≤44 through `q-mp-1163`, CI `e2e-cross-browser` yaml named script (`800`), dismissOwl deep-playtest (`879`), stars-bars / nav-away mid-AI / memory-leak / runtime-perf / webkit-offline / probe-offline **wait** clears (prior HOLD/skip), emit-identity wave5 merge-base tip retarget, Queens & Guards product, AI timing / Hex Hard 450ms / Stars & Bars history cap, AI determinism/quality shard wall-time cuts (HOLD), cancelFabAiRequests knip LEAVE (AI HOLD), visual-baseline PNG refresh (`1050`), canvas-dpr WebKit skip (`1051`), offsetWidth (`1135`/`#1333`), menu quote/query (`1088`), boundaries inline type (`1089`), permissions read-all (`1091`), owl flake (`1092`), proprietary license (`1081`), precache size/integrity/spaced (`1149`/`1125`/`1126`/`#1334`), Affero/LGPL/EUPL/OSL/LICENCE/CPAL (`1127`–`1131`), summarizeKnip null root / non-array issues (`1154`/`1106b`/`#1331`), parenthetical md titles (`1152`/`#1329`), copy-pins matchers/banner (`1134`/`1157`/`1158`/`#1330`).

**Could not honestly fill to 25** without filler (more `--help`/`--dry-run`/argv/empty-input theater, cli-help spawn speedups, mountPair adoptions, npm aliases, tip-name pointer stamps, knip baseline remasure, Rank-3 demote theater, AI harness speed theater, license-classifier / pwa-manifest-contract / workflows-bool theater, wiki count cells, or HOLD board-3d/mp3d wait clears). Stopped at **20**.
