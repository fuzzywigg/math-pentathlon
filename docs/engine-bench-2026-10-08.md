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
| 1 | fab-a-diffy | opening | legalMoves | 3.26 ms | 307 /s | 0 |
| 2 | pent-em-in | opening | legalMoves | 1.92 ms | 520 /s | 0 |
| 3 | fab-a-diffy | midgame | legalMoves | 811.9 µs | 1.2 k/s | 10 |
| 4 | pent-em-in | midgame | legalMoves | 783.6 µs | 1.3 k/s | 10 |
| 5 | fiar | opening | apply | 629.9 µs | 1.6 k/s | 0 |

## Full results (ns/op)

| Game | Pos | ply | legal# | over | legalMoves | apply | isOver | serialize | undo | redo |
|---|---|---:|---:|:---:|---:|---:|---:|---:|---:|---:|
| calla | opening | 0 | 5 |  | 111 ns | 222 ns | 53 ns | 11.3 µs | n/a | n/a |
| calla | midgame | 10 | 4 |  | 109 ns | 204 ns | 48 ns | 43.1 µs | 2.3 µs | 2.8 µs |
| calla | near-end | 22 | 1 |  | 83 ns | 269 ns | 52 ns | 79.1 µs | 5.8 µs | 5.9 µs |
| contig-60 | opening | 0 | 1 |  | 48 ns | 11.4 µs | 48 ns | 218.8 µs | n/a | n/a |
| contig-60 | midgame | 10 | 1 |  | 49 ns | 11.4 µs | 46 ns | 245.9 µs | 79.9 µs | 83.3 µs |
| contig-60 | near-end | 22 | 1 |  | 48 ns | 11.2 µs | 47 ns | 269.1 µs | 180.8 µs | 187.8 µs |
| fab-a-diffy | opening | 0 | 2030 |  | 3.26 ms | 3.0 µs | 46 ns | 301.2 µs | n/a | n/a |
| fab-a-diffy | midgame | 10 | 191 |  | 811.9 µs | 2.9 µs | 46 ns | 325.8 µs | 32.7 µs | 34.9 µs |
| fab-a-diffy | near-end | 19 | 0 | Y | 48 ns | n/a | 46 ns | 364.5 µs | 59.3 µs | 94.6 µs |
| fiar | opening | 0 | 80 |  | 2.3 µs | 629.9 µs | 55 ns | 380.8 µs | n/a | n/a |
| fiar | midgame | 9 | 31 |  | 1.0 µs | 5.6 µs | 54 ns | 414.9 µs | 833.7 µs | 738.7 µs |
| fiar | near-end | 18 | 56 |  | 321.1 µs | 14.5 µs | 105.2 µs | 446.7 µs | 825.1 µs | 837.8 µs |
| frac-fact | opening | 0 | 4 |  | 59 ns | 119 ns | 46 ns | 27.1 µs | n/a | n/a |
| frac-fact | midgame | 10 | 4 |  | 62 ns | 129 ns | 47 ns | 113.7 µs | 5.7 µs | 7.8 µs |
| frac-fact | near-end | 20 | 0 | Y | 51 ns | n/a | 53 ns | 185.0 µs | 12.2 µs | 12.2 µs |
| fraction-pinball | opening | 0 | 4 |  | 57 ns | 90 ns | 46 ns | 30.4 µs | n/a | n/a |
| fraction-pinball | midgame | 10 | 4 |  | 57 ns | 91 ns | 46 ns | 30.5 µs | 5.1 µs | 6.2 µs |
| fraction-pinball | near-end | 20 | 0 | Y | 47 ns | n/a | 48 ns | 24.0 µs | 10.0 µs | 10.4 µs |
| hex | opening | 0 | 25 |  | 256 ns | 401 ns | 46 ns | 18.3 µs | n/a | n/a |
| hex | midgame | 10 | 15 |  | 176 ns | 653 ns | 49 ns | 49.2 µs | 5.0 µs | 6.1 µs |
| hex | near-end | 17 | 0 | Y | 47 ns | n/a | 47 ns | 70.4 µs | 12.3 µs | 14.7 µs |
| hex-a-gone | opening | 0 | 5 |  | 368 ns | 102 ns | 52 ns | 106.3 µs | n/a | n/a |
| hex-a-gone | midgame | 10 | 34 |  | 446 ns | 493 ns | 52 ns | 118.2 µs | 2.2 µs | 2.2 µs |
| hex-a-gone | near-end | 22 | 29 |  | 396 ns | 610 ns | 52 ns | 136.3 µs | 5.0 µs | 5.3 µs |
| juggle | opening | 0 | 1 |  | 48 ns | 91 ns | 47 ns | 87.5 µs | n/a | n/a |
| juggle | midgame | 10 | 1 |  | 49 ns | 92 ns | 47 ns | 137.2 µs | 97.7 µs | 109.6 µs |
| juggle | near-end | 22 | 1 |  | 52 ns | 91 ns | 46 ns | 196.2 µs | 220.2 µs | 241.1 µs |
| kings-quadraphages | opening | 0 | 5 |  | 560 ns | 498 ns | 47 ns | 1.2 µs | n/a | n/a |
| kings-quadraphages | midgame | 10 | 8 |  | 7.3 µs | 1.4 µs | 48 ns | 1.3 µs | 90.5 µs | 105.3 µs |
| kings-quadraphages | near-end | 22 | 5 |  | 5.5 µs | 1.8 µs | 48 ns | 1.4 µs | 198.4 µs | 214.7 µs |
| kwatro-sinko | opening | 0 | 5 |  | 442 ns | 1.8 µs | 48 ns | 215.9 µs | n/a | n/a |
| kwatro-sinko | midgame | 9 | 12 |  | 411 ns | 1.8 µs | 48 ns | 262.0 µs | 20.0 µs | 22.1 µs |
| kwatro-sinko | near-end | 18 | 14 |  | 554 ns | 1.8 µs | 72 ns | 308.2 µs | 36.9 µs | 39.1 µs |
| par-55 | opening | 0 | 30 |  | 3.6 µs | 2.5 µs | 49 ns | 252.2 µs | n/a | n/a |
| par-55 | midgame | 10 | 0 | Y | 50 ns | n/a | 52 ns | 350.1 µs | 41.8 µs | 46.1 µs |
| par-55 | near-end | 10 | 0 | Y | 47 ns | n/a | 47 ns | 361.8 µs | 44.2 µs | 45.7 µs |
| pent-em-in | opening | 0 | 4472 |  | 1.92 ms | 22.8 µs | 66 ns | 307.1 µs | n/a | n/a |
| pent-em-in | midgame | 10 | 67 |  | 783.6 µs | 20.5 µs | 47 ns | 481.7 µs | 184.0 µs | 191.2 µs |
| pent-em-in | near-end | 16 | 0 | Y | 47 ns | n/a | 49 ns | 607.7 µs | 443.4 µs | 709.5 µs |
| prime-gold | opening | 0 | 1 |  | 47 ns | 128 ns | 48 ns | 229.7 µs | n/a | n/a |
| prime-gold | midgame | 10 | 1 |  | 55 ns | 137 ns | 51 ns | 250.8 µs | 171.6 µs | 205.1 µs |
| prime-gold | near-end | 22 | 1 |  | 50 ns | 133 ns | 48 ns | 281.1 µs | 405.6 µs | 436.0 µs |
| queens-guards | opening | 0 | 28 |  | 16.9 µs | 5.8 µs | 48 ns | 285.8 µs | n/a | n/a |
| queens-guards | midgame | 10 | 25 |  | 18.6 µs | 7.5 µs | 47 ns | 342.2 µs | 59.3 µs | 64.8 µs |
| queens-guards | near-end | 22 | 27 |  | 19.5 µs | 6.9 µs | 45 ns | 413.2 µs | 141.6 µs | 144.8 µs |
| ramrod | opening | 0 | 98 |  | 4.0 µs | 2.7 µs | 52 ns | 222.8 µs | n/a | n/a |
| ramrod | midgame | 10 | 10 |  | 2.8 µs | 3.0 µs | 48 ns | 327.2 µs | 29.9 µs | 33.4 µs |
| ramrod | near-end | 18 | 0 | Y | 46 ns | n/a | 47 ns | 398.7 µs | 52.8 µs | 56.8 µs |
| remainder-islands | opening | 0 | 1 |  | 48 ns | 237 ns | 46 ns | 119.3 µs | n/a | n/a |
| remainder-islands | midgame | 10 | 1 |  | 48 ns | 233 ns | 47 ns | 162.2 µs | 3.8 µs | 4.5 µs |
| remainder-islands | near-end | 22 | 1 |  | 49 ns | 235 ns | 51 ns | 222.1 µs | 8.7 µs | 9.1 µs |
| star-track | opening | 0 | 1 |  | 60 ns | 86 ns | 57 ns | 40.9 µs | n/a | n/a |
| star-track | midgame | 10 | 1 |  | 58 ns | 83 ns | 57 ns | 49.1 µs | 1.4 µs | 1.6 µs |
| star-track | near-end | 18 | 0 | Y | 56 ns | n/a | 59 ns | 54.8 µs | 2.4 µs | 2.5 µs |
| stars-bars | opening | 0 | 125 |  | 3.3 µs | 1.7 µs | 47 ns | 256.7 µs | n/a | n/a |
| stars-bars | midgame | 10 | 60 |  | 9.2 µs | 5.2 µs | 46 ns | 323.1 µs | 67.0 µs | 65.8 µs |
| stars-bars | near-end | 11 | 0 | Y | 52 ns | n/a | 47 ns | 316.7 µs | 66.1 µs | 70.5 µs |
| sum-dominoes | opening | 0 | 1 |  | 47 ns | 273.0 µs | 48 ns | 112.1 µs | n/a | n/a |
| sum-dominoes | midgame | 10 | 1 |  | 47 ns | 44.9 µs | 46 ns | 183.0 µs | 293.8 µs | 358.8 µs |
| sum-dominoes | near-end | 22 | 1 |  | 47 ns | 30.1 µs | 48 ns | 265.1 µs | 768.2 µs | 769.4 µs |

## Notes

- Undo/redo measure **prefix-replay** cost (no native engine undo API). Cost grows with ply depth.
- `serialize` is `adapter.roundTrip` (Map/Set-aware JSON, or kings dedicated codec).
- Report-only: not gated in CI. Re-run with `npm run bench:engines`.

Machine-readable twin: [`engine-bench-2026-10-08.json`](./engine-bench-2026-10-08.json)
