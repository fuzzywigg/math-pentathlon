# Batch fold r32 — q-mp-026t-b33

**Task:** `q-mp-026t-b33` (BATCH-FOLD; WIP gate refill)  
**Base tip:** `cursor/mp-tip-post1083` @ `4bfb2354`  
**Batch branch:** `cursor/mp-batch-r32`  
**Tip PR #1143:** still open into `alpha` at fold time (not merged).

## Outcome

At agent start, tip head already contained every round-32 worker draft
(`#1163`–`#1181`, including backlog `#1179`). File trees for each draft’s
scoped paths match tip except where later tip folds layered the same files
(`vitest.config.ts` nodePureFiles union; `scripts/check-perf.mjs` /
`render-perf.mjs` / `runtime-perf.mjs` after `#1165`/`#1166`/`#1177`).

This commit is a **containment attestation only** (no product re-fold). Tip
owner / Grok Bot can treat worker drafts `#1163`–`#1181` as contained on tip
and fold this note (or drop it) when clearing WIP.

## Drafts (included = already on tip)

| PR    | Tip commit | Topic                                           |
| ----- | ---------- | ----------------------------------------------- |
| #1163 | `26d17a63` | check-emit-identity `--files-from` errors       |
| #1164 | `ec9ac23a` | check:perf missing `dist/` → exit 2             |
| #1165 | `e4ef6700` | shared `page-ready` helpers                     |
| #1166 | `6518ee3b` | render-perf condition waits                     |
| #1167 | `e2506d77` | mountPair kings + contig AI-seat                |
| #1168 | `717e0cca` | copy-pins / knip unknown flags                  |
| #1169 | `d8155933` | canvas-dpr shared page helpers                  |
| #1170 | `115aa136` | gallery / lifecycle npm script names            |
| #1171 | `41f68783` | check-build early `--help`                      |
| #1172 | `be057661` | report-lint-buckets `--top`/`--rule`            |
| #1173 | `8ff25915` | report-ratchet-history help / dry-run           |
| #1174 | `01556616` | console-sweep condition waits                   |
| #1175 | `e8f4f768` | workflows / boundaries / licenses unknown flags |
| #1176 | `bd657865` | forced-colors `startHuman`                      |
| #1177 | `09eb3a16` | harness `MEM_LEAK_*` / `PERF_*` NaN             |
| #1178 | `7cadb51d` | offline probe early `--help`                    |
| #1179 | `e44bf593` | backlog Oct 10ag (round 33)                     |
| #1180 | `b921e719` | flake-rate `--out` validation                   |
| #1181 | `4bfb2354` | mutation-report `--max`/`--timeout`/`--games`   |

## Left out

None. HOLD-CHECKs passed for tip content:

1. **#1164** — `check:perf` is not referenced in `.github/workflows/*` and is
   not on the `verify` path; missing-`dist/` exit 2 cannot trip CI/verify.
2. **#1168 / #1175** — CI `npm run check:copy-pins -- --fail` still accepts
   `--fail` (report-only `continue-on-error`); `check:boundaries` (verify),
   `check:workflows`, `report:licenses --help`, and `report:knip` accept their
   live flags; unknown flags exit 2.
3. **#1181** — `node scripts/mutation-report.mjs --max=bogus` (and bad
   `--timeout` / `--games`) exit 2 with usage; `git status` clean for
   `*/rules.ts` and `src/` afterward.

## Hardrules screen

- Zero `src/` / `*/rules.ts` / `.github/workflows` changes in tip commits
  `26d17a63..4bfb2354`.
- Hex Hard `AI_PLAY_DEADLINE_MS.hard === 450` untouched
  (`tests/unit/ai-hard-midgame-identity.test.ts`).
- No player-facing copy / aria / AI timing edits in this batch scope.
