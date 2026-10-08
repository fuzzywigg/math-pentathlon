# Rules-engine microbench — 2026-10-08

Task: `burn-1008-mp-engine-bench`

## Method

- Reuse GameFuzzAdapter legalMoves/apply/isOver/roundTrip (no AI calls)
- Positions from seeded deterministic playouts (opening / midgame / near-end)
- Undo/redo = prefix replay from seeded create (undo-audit pattern)
- Vitest node project via vitest.engines-bench.config.ts

Seed `20261008`; warmup ~40 ms; measure ~120 ms per sample (min 32 iters).

## Top-5 hotspots (highest ns/op among legalMoves / apply / isOver / serialize)

| Rank | Game | Position | Op | ns/op | ops/s | ply |
|---:|---|---|---|---:|---:|---:|
| 1 | fab-a-diffy | opening | legalMoves | 3.08 ms | 325 /s | 0 |
| 2 | pent-em-in | opening | legalMoves | 1.72 ms | 580 /s | 0 |
| 3 | fab-a-diffy | midgame | legalMoves | 803.0 µs | 1.2 k/s | 10 |
| 4 | pent-em-in | midgame | legalMoves | 715.1 µs | 1.4 k/s | 10 |
| 5 | fiar | opening | apply | 605.6 µs | 1.7 k/s | 0 |

## Full results (ns/op)

| Game | Pos | ply | legal# | over | legalMoves | apply | isOver | serialize | undo | redo |
|---|---|---:|---:|:---:|---:|---:|---:|---:|---:|---:|
| calla | opening | 0 | 5 |  | 103 ns | 200 ns | 53 ns | 11.6 µs | n/a | n/a |
| calla | midgame | 10 | 4 |  | 102 ns | 187 ns | 48 ns | 43.4 µs | 2.3 µs | 2.8 µs |
| calla | near-end | 22 | 1 |  | 78 ns | 238 ns | 48 ns | 80.2 µs | 5.8 µs | 5.6 µs |
| contig-60 | opening | 0 | 1 |  | 47 ns | 12.3 µs | 49 ns | 219.4 µs | n/a | n/a |
| contig-60 | midgame | 10 | 1 |  | 51 ns | 11.2 µs | 46 ns | 242.5 µs | 77.4 µs | 82.3 µs |
| contig-60 | near-end | 22 | 1 |  | 50 ns | 11.2 µs | 50 ns | 269.7 µs | 177.1 µs | 184.1 µs |
| fab-a-diffy | opening | 0 | 2030 |  | 3.08 ms | 3.0 µs | 53 ns | 292.2 µs | n/a | n/a |
| fab-a-diffy | midgame | 10 | 191 |  | 803.0 µs | 3.0 µs | 47 ns | 328.5 µs | 32.8 µs | 34.9 µs |
| fab-a-diffy | near-end | 19 | 0 | Y | 48 ns | n/a | 46 ns | 354.5 µs | 59.8 µs | 95.2 µs |
| fiar | opening | 0 | 80 |  | 2.3 µs | 605.6 µs | 54 ns | 398.0 µs | n/a | n/a |
| fiar | midgame | 9 | 31 |  | 1.1 µs | 5.3 µs | 52 ns | 426.9 µs | 801.4 µs | 726.9 µs |
| fiar | near-end | 18 | 56 |  | 308.5 µs | 13.8 µs | 102.2 µs | 453.1 µs | 798.1 µs | 818.6 µs |
| frac-fact | opening | 0 | 4 |  | 59 ns | 113 ns | 46 ns | 27.1 µs | n/a | n/a |
| frac-fact | midgame | 10 | 4 |  | 59 ns | 122 ns | 46 ns | 113.3 µs | 5.5 µs | 7.7 µs |
| frac-fact | near-end | 20 | 0 | Y | 47 ns | n/a | 46 ns | 185.7 µs | 12.0 µs | 12.0 µs |
| fraction-pinball | opening | 0 | 4 |  | 58 ns | 90 ns | 48 ns | 30.3 µs | n/a | n/a |
| fraction-pinball | midgame | 10 | 4 |  | 59 ns | 91 ns | 48 ns | 30.5 µs | 5.1 µs | 6.0 µs |
| fraction-pinball | near-end | 20 | 0 | Y | 47 ns | n/a | 46 ns | 24.2 µs | 10.0 µs | 10.4 µs |
| hex | opening | 0 | 25 |  | 268 ns | 413 ns | 46 ns | 17.7 µs | n/a | n/a |
| hex | midgame | 10 | 15 |  | 182 ns | 654 ns | 46 ns | 49.5 µs | 4.9 µs | 6.1 µs |
| hex | near-end | 17 | 0 | Y | 47 ns | n/a | 47 ns | 70.5 µs | 12.1 µs | 14.3 µs |
| hex-a-gone | opening | 0 | 5 |  | 352 ns | 100 ns | 51 ns | 105.1 µs | n/a | n/a |
| hex-a-gone | midgame | 10 | 34 |  | 450 ns | 498 ns | 54 ns | 117.0 µs | 2.2 µs | 2.2 µs |
| hex-a-gone | near-end | 22 | 29 |  | 394 ns | 603 ns | 51 ns | 136.7 µs | 4.9 µs | 5.2 µs |
| juggle | opening | 0 | 1 |  | 49 ns | 91 ns | 46 ns | 86.1 µs | n/a | n/a |
| juggle | midgame | 10 | 1 |  | 49 ns | 89 ns | 46 ns | 137.6 µs | 95.4 µs | 109.3 µs |
| juggle | near-end | 22 | 1 |  | 49 ns | 88 ns | 46 ns | 195.0 µs | 218.7 µs | 238.5 µs |
| kings-quadraphages | opening | 0 | 5 |  | 536 ns | 472 ns | 46 ns | 1.1 µs | n/a | n/a |
| kings-quadraphages | midgame | 10 | 8 |  | 6.3 µs | 1.3 µs | 47 ns | 1.3 µs | 81.4 µs | 97.7 µs |
| kings-quadraphages | near-end | 22 | 5 |  | 4.8 µs | 1.7 µs | 48 ns | 1.4 µs | 183.3 µs | 197.5 µs |
| kwatro-sinko | opening | 0 | 5 |  | 439 ns | 1.8 µs | 49 ns | 215.0 µs | n/a | n/a |
| kwatro-sinko | midgame | 9 | 12 |  | 407 ns | 1.7 µs | 47 ns | 263.4 µs | 21.0 µs | 22.8 µs |
| kwatro-sinko | near-end | 18 | 14 |  | 515 ns | 1.8 µs | 47 ns | 311.9 µs | 38.4 µs | 40.2 µs |
| par-55 | opening | 0 | 30 |  | 3.3 µs | 2.5 µs | 46 ns | 247.2 µs | n/a | n/a |
| par-55 | midgame | 10 | 0 | Y | 48 ns | n/a | 46 ns | 349.1 µs | 40.9 µs | 43.1 µs |
| par-55 | near-end | 10 | 0 | Y | 49 ns | n/a | 46 ns | 348.3 µs | 40.3 µs | 42.8 µs |
| pent-em-in | opening | 0 | 4472 |  | 1.72 ms | 18.4 µs | 47 ns | 281.7 µs | n/a | n/a |
| pent-em-in | midgame | 10 | 67 |  | 715.1 µs | 17.3 µs | 46 ns | 463.6 µs | 165.2 µs | 178.1 µs |
| pent-em-in | near-end | 16 | 0 | Y | 48 ns | n/a | 46 ns | 570.1 µs | 401.6 µs | 649.6 µs |
| prime-gold | opening | 0 | 1 |  | 51 ns | 125 ns | 46 ns | 211.9 µs | n/a | n/a |
| prime-gold | midgame | 10 | 1 |  | 48 ns | 122 ns | 46 ns | 236.6 µs | 154.9 µs | 188.4 µs |
| prime-gold | near-end | 22 | 1 |  | 53 ns | 123 ns | 46 ns | 266.2 µs | 377.9 µs | 402.7 µs |
| queens-guards | opening | 0 | 28 |  | 16.2 µs | 5.7 µs | 46 ns | 284.0 µs | n/a | n/a |
| queens-guards | midgame | 10 | 25 |  | 18.0 µs | 7.9 µs | 46 ns | 338.6 µs | 58.2 µs | 64.0 µs |
| queens-guards | near-end | 22 | 27 |  | 19.3 µs | 6.8 µs | 46 ns | 411.0 µs | 136.2 µs | 143.8 µs |
| ramrod | opening | 0 | 98 |  | 3.4 µs | 2.7 µs | 46 ns | 227.6 µs | n/a | n/a |
| ramrod | midgame | 10 | 10 |  | 2.4 µs | 2.9 µs | 46 ns | 329.4 µs | 29.8 µs | 33.0 µs |
| ramrod | near-end | 18 | 0 | Y | 47 ns | n/a | 48 ns | 400.8 µs | 51.6 µs | 54.5 µs |
| remainder-islands | opening | 0 | 1 |  | 47 ns | 242 ns | 47 ns | 115.8 µs | n/a | n/a |
| remainder-islands | midgame | 10 | 1 |  | 48 ns | 236 ns | 46 ns | 162.6 µs | 3.7 µs | 4.3 µs |
| remainder-islands | near-end | 22 | 1 |  | 51 ns | 238 ns | 46 ns | 219.7 µs | 8.5 µs | 8.8 µs |
| star-track | opening | 0 | 1 |  | 55 ns | 82 ns | 51 ns | 40.9 µs | n/a | n/a |
| star-track | midgame | 10 | 1 |  | 55 ns | 85 ns | 54 ns | 48.8 µs | 1.4 µs | 1.5 µs |
| star-track | near-end | 18 | 0 | Y | 52 ns | n/a | 51 ns | 54.0 µs | 2.3 µs | 2.4 µs |
| stars-bars | opening | 0 | 125 |  | 3.1 µs | 1.6 µs | 46 ns | 250.7 µs | n/a | n/a |
| stars-bars | midgame | 10 | 60 |  | 8.6 µs | 5.2 µs | 46 ns | 306.1 µs | 62.9 µs | 63.2 µs |
| stars-bars | near-end | 11 | 0 | Y | 49 ns | n/a | 46 ns | 310.7 µs | 63.1 µs | 68.8 µs |
| sum-dominoes | opening | 0 | 1 |  | 50 ns | 265.6 µs | 46 ns | 111.4 µs | n/a | n/a |
| sum-dominoes | midgame | 10 | 1 |  | 49 ns | 42.4 µs | 46 ns | 182.8 µs | 286.5 µs | 332.2 µs |
| sum-dominoes | near-end | 22 | 1 |  | 50 ns | 28.4 µs | 46 ns | 262.5 µs | 725.6 µs | 732.7 µs |

## Notes

- Undo/redo measure **prefix-replay** cost (no native engine undo API). Cost grows with ply depth.
- `serialize` is `adapter.roundTrip` (Map/Set-aware JSON, or kings dedicated codec).
- Report-only: not gated in CI. Re-run with `npm run bench:engines`.

Machine-readable twin: [`engine-bench-2026-10-08.json`](./engine-bench-2026-10-08.json)
