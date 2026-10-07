# AI move think-time — 2026-10-07

Unit-level bench (no browser) over hand-built mid-game states.

## Method

- Samples: 11 seeded trials per game × difficulty × scenario
- Percentiles: p50 / p95 of wall `performance.now()` ms
- Timed engines (`hex`, `queens-guards`, `fab-a-diffy`): play budget `AI_PLAY_DEADLINE_MS[difficulty]`
- Other engines: sync chooser with seeded `Math.random` (mulberry32)
- Hard flag threshold: **p95 > 500ms**

## Hard flags

None — every Hard scenario has p95 ≤ 500ms after remediation.

## Remediation (this change)

- **hex** / **queens-guards**: Hard `AI_PLAY_DEADLINE_MS` lowered to **450ms** (≤500ms wall target with abort slack).
- Hand-built mid-game Hard moves stay identical to unlimited Hard search (asserted in `ai-hard-midgame-identity.test.ts`).
- No rules or scoring changes.

## Results

| Game | Scenario | Diff | Timed | n | p50 (ms) | p95 (ms) | max (ms) | Hard flag |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: | --- |
| calla | mid-8ply | easy | no | 11 | 0.0 | 0.5 | 0.5 |  |
| calla | mid-8ply | medium | no | 11 | 0.1 | 0.4 | 0.4 |  |
| calla | mid-8ply | hard | no | 11 | 0.4 | 1.5 | 1.5 |  |
| hex | mid-6stone | easy | yes | 11 | 110.2 | 142.8 | 142.8 |  |
| hex | mid-6stone | medium | yes | 11 | 542.4 | 556.8 | 556.8 |  |
| hex | mid-6stone | hard | yes | 11 | 450.0 | 450.3 | 450.3 |  |
| queens-guards | mid-4ply | easy | yes | 11 | 707.8 | 743.0 | 743.0 |  |
| queens-guards | mid-4ply | medium | yes | 11 | 1500.1 | 1500.2 | 1500.2 |  |
| queens-guards | mid-4ply | hard | yes | 11 | 450.2 | 450.5 | 450.5 |  |
| fab-a-diffy | mid-3ply | easy | yes | 11 | 277.1 | 292.6 | 292.6 |  |
| fab-a-diffy | mid-3ply | medium | yes | 11 | 280.3 | 288.2 | 288.2 |  |
| fab-a-diffy | mid-3ply | hard | yes | 11 | 276.7 | 327.1 | 327.1 |  |
| fiar | placement-early | easy | no | 11 | 1.2 | 6.4 | 6.4 |  |
| fiar | placement-early | medium | no | 11 | 8.9 | 23.4 | 23.4 |  |
| fiar | placement-early | hard | no | 11 | 11.2 | 12.3 | 12.3 |  |
| fiar | movement-mid | easy | no | 11 | 13.3 | 16.4 | 16.4 |  |
| fiar | movement-mid | medium | no | 11 | 255.9 | 264.0 | 264.0 |  |
| fiar | movement-mid | hard | no | 11 | 256.7 | 265.4 | 265.4 |  |
| kings-quadraphages | opening-supply | easy | no | 11 | 0.0 | 0.4 | 0.4 |  |
| kings-quadraphages | opening-supply | medium | no | 11 | 0.3 | 0.8 | 0.8 |  |
| kings-quadraphages | opening-supply | hard | no | 11 | 0.8 | 2.8 | 2.8 |  |
| pent-em-in | opening-hand | easy | no | 11 | 208.7 | 294.3 | 294.3 |  |
| pent-em-in | opening-hand | medium | no | 11 | 199.3 | 209.0 | 209.0 |  |
| pent-em-in | opening-hand | hard | no | 11 | 199.7 | 236.9 | 236.9 |  |
| kwatro-sinko | opening | easy | no | 11 | 0.1 | 1.1 | 1.1 |  |
| kwatro-sinko | opening | medium | no | 11 | 0.0 | 0.1 | 0.1 |  |
| kwatro-sinko | opening | hard | no | 11 | 0.0 | 0.1 | 0.1 |  |
| stars-bars | opening | easy | no | 11 | 0.4 | 1.1 | 1.1 |  |
| stars-bars | opening | medium | no | 11 | 0.1 | 0.2 | 0.2 |  |
| stars-bars | opening | hard | no | 11 | 0.1 | 0.1 | 0.1 |  |
| par-55 | opening | easy | no | 11 | 0.1 | 0.7 | 0.7 |  |
| par-55 | opening | medium | no | 11 | 0.1 | 0.1 | 0.1 |  |
| par-55 | opening | hard | no | 11 | 0.1 | 0.1 | 0.1 |  |
| ramrod | opening | easy | no | 11 | 0.1 | 2.7 | 2.7 |  |
| ramrod | opening | medium | no | 11 | 0.1 | 0.1 | 0.1 |  |
| ramrod | opening | hard | no | 11 | 0.1 | 0.1 | 0.1 |  |
| sum-dominoes | after-roll | easy | no | 11 | 0.9 | 4.9 | 4.9 |  |
| sum-dominoes | after-roll | medium | no | 11 | 0.7 | 1.2 | 1.2 |  |
| sum-dominoes | after-roll | hard | no | 11 | 0.5 | 1.0 | 1.0 |  |
| prime-gold | after-roll | easy | no | 11 | 0.1 | 1.2 | 1.2 |  |
| prime-gold | after-roll | medium | no | 11 | 0.1 | 0.1 | 0.1 |  |
| prime-gold | after-roll | hard | no | 11 | 0.1 | 0.3 | 0.3 |  |
| contig-60 | after-roll | easy | no | 11 | 0.2 | 0.9 | 0.9 |  |
| contig-60 | after-roll | medium | no | 11 | 0.2 | 0.2 | 0.2 |  |
| contig-60 | after-roll | hard | no | 11 | 0.2 | 0.2 | 0.2 |  |
| juggle | placing | easy | no | 11 | 0.9 | 2.8 | 2.8 |  |
| juggle | placing | medium | no | 11 | 2.8 | 25.9 | 25.9 |  |
| juggle | placing | hard | no | 11 | 2.4 | 2.8 | 2.8 |  |
| hex-a-gone | placing | easy | no | 11 | 0.3 | 1.5 | 1.5 |  |
| hex-a-gone | placing | medium | no | 11 | 0.2 | 0.5 | 0.5 |  |
| hex-a-gone | placing | hard | no | 11 | 0.2 | 0.4 | 0.4 |  |
| hex-a-gone | selection | easy | no | 11 | 0.1 | 0.2 | 0.2 |  |
| hex-a-gone | selection | medium | no | 11 | 0.1 | 0.1 | 0.1 |  |
| hex-a-gone | selection | hard | no | 11 | 0.1 | 0.1 | 0.1 |  |
| remainder-islands | select-mid | easy | no | 11 | 0.0 | 0.4 | 0.4 |  |
| remainder-islands | select-mid | medium | no | 11 | 0.0 | 0.0 | 0.0 |  |
| remainder-islands | select-mid | hard | no | 11 | 0.0 | 0.0 | 0.0 |  |
| star-track | select-chain | easy | no | 11 | 0.0 | 0.2 | 0.2 |  |
| star-track | select-chain | medium | no | 11 | 0.0 | 0.0 | 0.0 |  |
| star-track | select-chain | hard | no | 11 | 0.0 | 0.0 | 0.0 |  |
| frac-fact | answer | easy | no | 11 | 0.0 | 0.1 | 0.1 |  |
| frac-fact | answer | medium | no | 11 | 0.0 | 0.0 | 0.0 |  |
| frac-fact | answer | hard | no | 11 | 0.0 | 0.0 | 0.0 |  |
| fraction-pinball | answer | easy | no | 11 | 0.0 | 0.1 | 0.1 |  |
| fraction-pinball | answer | medium | no | 11 | 0.0 | 0.0 | 0.0 |  |
| fraction-pinball | answer | hard | no | 11 | 0.0 | 0.0 | 0.0 |  |

## Mid-game state recipes

| Game | Recipe |
| --- | --- |
| calla | 8 plies via `getValidPits()[i%n]` |
| hex | 6 fixed center stones |
| queens-guards | 4× easy `applyAIMove` |
| fab-a-diffy | 3× easy `applyAIMoveSteps` |
| fiar | early placement + `placeToMovement` |
| juggle / hex-a-gone | walk to placing phase |
| remainder-islands | forged mid ownership + roll |
| dice games | after forced roll |
| quiz games | `startGame` answering |
| others | opening hand / supply (stable mid chooser) |
