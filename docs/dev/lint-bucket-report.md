# Lint-bucket summary (report-only helper)

**Task id:** `q-mp-280`  
**Posture:** local / tip-owner helper only. Not wired into CI gates. Never writes `docs/dev/lint-ratchet-ceilings.json`.  
**Script:** [`scripts/report-lint-buckets.mjs`](../../scripts/report-lint-buckets.mjs)  
**npm alias:** `npm run report:lint-buckets`

## Purpose

Backlog and triage agents repeatedly hand-roll the same ESLint overlay probe used by `npm run lint:ratchet` to answer “where is the debt for rule X?”. This helper prints:

1. **Per-rule totals** for every key in [`lint-ratchet-ceilings.json`](./lint-ratchet-ceilings.json) (same probe as [`scripts/check-lint-ratchet.mjs`](../../scripts/check-lint-ratchet.mjs))
2. **Path buckets** (e.g. `src/games/<game>`, `src/core/<area>`, `src/ui/three`, `src/demos`, `src/pwa`, `src/` for root files like `main.ts`)
3. **Densest files** (top N paths by hit count)

Use it to pick clearable buckets before opening a ceiling-clear PR. One agent per lint ceiling key still applies — this script does not claim a key.

## Commands

```bash
npm run report:lint-buckets
node scripts/report-lint-buckets.mjs
npm run report:lint-buckets -- --rule curly
npm run report:lint-buckets -- --top 5
npm run report:lint-buckets -- --json
```

| Flag            | Meaning                                                |
| --------------- | ------------------------------------------------------ |
| `--rule <id>`   | Restrict output to one ceiling ruleId                  |
| `--top N`       | Max buckets / densest files per rule (default **10**)  |
| `--json`        | Machine-readable summary (still exit **0** on success) |
| `-h` / `--help` | Usage                                                  |

Runs offline against the local tree (`eslint src` + probe config under the repo root; probe file is deleted in `finally`). Exit **1** only on probe/parse failure or unknown `--rule`.

## Relationship to other lint docs

| Tool / doc                                                                                       | Role                                                                                |
| ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| `npm run lint:ratchet`                                                                           | **Enforcing** ceiling check (CI lint job)                                           |
| [`lint-ratchet-ceilings.json`](./lint-ratchet-ceilings.json)                                     | Ceiling numbers (ratchets only go down)                                             |
| [`eslint-off-rules-inventory.md`](./eslint-off-rules-inventory.md)                               | Human inventory of ceilinged rules                                                  |
| [`eslint-non-ceilinged-residuals-2026-10-09.md`](./eslint-non-ceilinged-residuals-2026-10-09.md) | Non-ceilinged overlay residuals (post748 stamp)                                     |
| [`eslint-non-ceilinged-residuals-post914-2026-10-10.md`](./eslint-non-ceilinged-residuals-post914-2026-10-10.md) | Non-ceilinged overlay residuals refresh (`q-mp-464`) @ tip `post914` (`753052a6`)   |
| [`lint-bucket-snapshot-post830-2026-10-10.md`](./lint-bucket-snapshot-post830-2026-10-10.md)     | Dated tip snapshot (`q-mp-364`) + chart @ `97487de6`                                |
| [`lint-bucket-snapshot-post865-2026-10-10.md`](./lint-bucket-snapshot-post865-2026-10-10.md)     | Dated tip snapshot (`q-mp-416`) + chart @ `7f8a7147` (void **53**)                  |
| [`lint-bucket-snapshot-post898-2026-10-10.md`](./lint-bucket-snapshot-post898-2026-10-10.md)     | Dated tip snapshot (`q-mp-441`) + chart @ `9b19c5e8` (void **52** / nnnull **241**) |
| **This helper**                                                                                  | Fast bucket report for refill / triage                                              |

## Sample shape (stable columns)

Text mode prints one block per rule:

```text
<ruleId>: <count> / ceiling <ceiling>
  path buckets:
    <n>  src/games/<game>
    <n>  src/core/<area>
  densest files (top 10):
    <n>  src/.../file.ts
```

JSON mode emits `{ task, ceilingsPath, ceilings, rules: { [ruleId]: { total, ceiling, headroom, buckets, files } } }`.

## Hard-rule notes

- No `src/` behavior edits from this helper.
- Do not raise ceilings from report output; lower only after a measured cleanup with tip-owner fold.
- Do not clear debt in `*/rules.ts`, AI search/scoring/difficulty/timing paths, or player-facing copy from a bucket report alone — follow HOLD notes in the inventory docs.
