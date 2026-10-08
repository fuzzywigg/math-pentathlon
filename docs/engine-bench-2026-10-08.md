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
| 1 | fab-a-diffy | opening | legalMoves | 2.80 ms | 357 /s | 0 |
| 2 | pent-em-in | opening | legalMoves | 1.67 ms | 600 /s | 0 |
| 3 | pent-em-in | midgame | legalMoves | 733.8 µs | 1.4 k/s | 10 |
| 4 | fab-a-diffy | midgame | legalMoves | 616.7 µs | 1.6 k/s | 10 |
| 5 | fiar | opening | apply | 598.4 µs | 1.7 k/s | 0 |

## Full results (ns/op)

| Game | Pos | ply | legal# | over | legalMoves | apply | isOver | serialize | undo | redo |
|---|---|---:|---:|:---:|---:|---:|---:|---:|---:|---:|
| calla | opening | 0 | 5 |  | 108 ns | 222 ns | 51 ns | 11.5 µs | n/a | n/a |
| calla | midgame | 10 | 4 |  | 102 ns | 200 ns | 55 ns | 43.7 µs | 2.5 µs | 3.0 µs |
| calla | near-end | 22 | 1 |  | 79 ns | 273 ns | 49 ns | 80.2 µs | 6.5 µs | 6.3 µs |
| contig-60 | opening | 0 | 1 |  | 47 ns | 11.3 µs | 48 ns | 218.5 µs | n/a | n/a |
| contig-60 | midgame | 10 | 1 |  | 50 ns | 12.4 µs | 46 ns | 247.9 µs | 78.6 µs | 81.3 µs |
| contig-60 | near-end | 22 | 1 |  | 48 ns | 11.1 µs | 50 ns | 266.2 µs | 177.3 µs | 183.6 µs |
| fab-a-diffy | opening | 0 | 2030 |  | 2.80 ms | 2.9 µs | 49 ns | 295.8 µs | n/a | n/a |
| fab-a-diffy | midgame | 10 | 191 |  | 616.7 µs | 2.9 µs | 48 ns | 327.3 µs | 32.5 µs | 34.9 µs |
| fab-a-diffy | near-end | 19 | 0 | Y | 48 ns | n/a | 47 ns | 355.0 µs | 59.7 µs | 95.0 µs |
| fiar | opening | 0 | 80 |  | 2.2 µs | 598.4 µs | 66 ns | 390.2 µs | n/a | n/a |
| fiar | midgame | 9 | 31 |  | 1.0 µs | 5.1 µs | 58 ns | 424.3 µs | 801.8 µs | 724.4 µs |
| fiar | near-end | 18 | 56 |  | 310.0 µs | 14.0 µs | 104.8 µs | 454.0 µs | 804.1 µs | 827.4 µs |
| frac-fact | opening | 0 | 4 |  | 57 ns | 120 ns | 47 ns | 26.9 µs | n/a | n/a |
| frac-fact | midgame | 10 | 4 |  | 59 ns | 128 ns | 47 ns | 112.9 µs | 5.9 µs | 7.8 µs |
| frac-fact | near-end | 20 | 0 | Y | 48 ns | n/a | 46 ns | 184.1 µs | 12.7 µs | 12.5 µs |
| fraction-pinball | opening | 0 | 4 |  | 58 ns | 87 ns | 48 ns | 30.7 µs | n/a | n/a |
| fraction-pinball | midgame | 10 | 4 |  | 60 ns | 86 ns | 49 ns | 30.5 µs | 5.0 µs | 6.2 µs |
| fraction-pinball | near-end | 20 | 0 | Y | 47 ns | n/a | 46 ns | 24.0 µs | 10.4 µs | 11.0 µs |
| hex | opening | 0 | 25 |  | 259 ns | 424 ns | 46 ns | 17.6 µs | n/a | n/a |
| hex | midgame | 10 | 15 |  | 191 ns | 674 ns | 46 ns | 50.2 µs | 5.1 µs | 6.4 µs |
| hex | near-end | 17 | 0 | Y | 49 ns | n/a | 49 ns | 73.9 µs | 12.4 µs | 14.7 µs |
| hex-a-gone | opening | 0 | 5 |  | 346 ns | 97 ns | 53 ns | 105.2 µs | n/a | n/a |
| hex-a-gone | midgame | 10 | 34 |  | 457 ns | 508 ns | 52 ns | 116.8 µs | 2.2 µs | 2.2 µs |
| hex-a-gone | near-end | 22 | 29 |  | 416 ns | 619 ns | 51 ns | 136.8 µs | 5.0 µs | 5.3 µs |
| juggle | opening | 0 | 1 |  | 53 ns | 87 ns | 46 ns | 86.6 µs | n/a | n/a |
| juggle | midgame | 10 | 1 |  | 47 ns | 92 ns | 46 ns | 138.1 µs | 99.1 µs | 107.7 µs |
| juggle | near-end | 22 | 1 |  | 50 ns | 90 ns | 45 ns | 196.4 µs | 214.8 µs | 235.9 µs |
| kings-quadraphages | opening | 0 | 5 |  | 502 ns | 470 ns | 48 ns | 1.1 µs | n/a | n/a |
| kings-quadraphages | midgame | 10 | 8 |  | 6.3 µs | 1.3 µs | 46 ns | 1.3 µs | 88.5 µs | 97.9 µs |
| kings-quadraphages | near-end | 22 | 5 |  | 5.0 µs | 1.8 µs | 46 ns | 1.4 µs | 183.9 µs | 204.0 µs |
| kwatro-sinko | opening | 0 | 5 |  | 387 ns | 1.7 µs | 46 ns | 216.2 µs | n/a | n/a |
| kwatro-sinko | midgame | 9 | 12 |  | 431 ns | 1.7 µs | 47 ns | 263.8 µs | 20.2 µs | 21.9 µs |
| kwatro-sinko | near-end | 18 | 14 |  | 510 ns | 1.8 µs | 52 ns | 312.2 µs | 37.5 µs | 39.3 µs |
| par-55 | opening | 0 | 30 |  | 3.1 µs | 2.4 µs | 46 ns | 248.3 µs | n/a | n/a |
| par-55 | midgame | 10 | 0 | Y | 48 ns | n/a | 62 ns | 348.5 µs | 40.8 µs | 42.4 µs |
| par-55 | near-end | 10 | 0 | Y | 47 ns | n/a | 46 ns | 349.5 µs | 42.8 µs | 49.0 µs |
| pent-em-in | opening | 0 | 4472 |  | 1.67 ms | 18.7 µs | 46 ns | 287.6 µs | n/a | n/a |
| pent-em-in | midgame | 10 | 67 |  | 733.8 µs | 17.6 µs | 46 ns | 463.8 µs | 166.4 µs | 180.1 µs |
| pent-em-in | near-end | 16 | 0 | Y | 47 ns | n/a | 46 ns | 569.8 µs | 407.5 µs | 660.6 µs |
| prime-gold | opening | 0 | 1 |  | 48 ns | 126 ns | 46 ns | 209.3 µs | n/a | n/a |
| prime-gold | midgame | 10 | 1 |  | 48 ns | 129 ns | 46 ns | 251.3 µs | 154.1 µs | 187.0 µs |
| prime-gold | near-end | 22 | 1 |  | 47 ns | 127 ns | 46 ns | 265.2 µs | 367.6 µs | 406.2 µs |
| queens-guards | opening | 0 | 28 |  | 17.1 µs | 6.0 µs | 46 ns | 286.1 µs | n/a | n/a |
| queens-guards | midgame | 10 | 25 |  | 18.6 µs | 7.8 µs | 46 ns | 350.7 µs | 60.8 µs | 66.4 µs |
| queens-guards | near-end | 22 | 27 |  | 20.3 µs | 7.0 µs | 46 ns | 406.8 µs | 141.6 µs | 149.1 µs |
| ramrod | opening | 0 | 98 |  | 3.8 µs | 2.8 µs | 45 ns | 225.3 µs | n/a | n/a |
| ramrod | midgame | 10 | 10 |  | 2.4 µs | 3.0 µs | 45 ns | 330.1 µs | 30.7 µs | 33.6 µs |
| ramrod | near-end | 18 | 0 | Y | 47 ns | n/a | 47 ns | 404.8 µs | 52.9 µs | 56.0 µs |
| remainder-islands | opening | 0 | 1 |  | 48 ns | 241 ns | 46 ns | 113.4 µs | n/a | n/a |
| remainder-islands | midgame | 10 | 1 |  | 51 ns | 233 ns | 46 ns | 160.9 µs | 3.8 µs | 4.4 µs |
| remainder-islands | near-end | 22 | 1 |  | 52 ns | 237 ns | 50 ns | 217.9 µs | 8.7 µs | 9.0 µs |
| star-track | opening | 0 | 1 |  | 53 ns | 85 ns | 52 ns | 41.1 µs | n/a | n/a |
| star-track | midgame | 10 | 1 |  | 57 ns | 84 ns | 53 ns | 51.0 µs | 1.5 µs | 1.6 µs |
| star-track | near-end | 18 | 0 | Y | 57 ns | n/a | 51 ns | 55.0 µs | 2.4 µs | 2.6 µs |
| stars-bars | opening | 0 | 125 |  | 3.2 µs | 1.7 µs | 46 ns | 252.3 µs | n/a | n/a |
| stars-bars | midgame | 10 | 60 |  | 8.9 µs | 5.2 µs | 46 ns | 305.9 µs | 61.7 µs | 64.4 µs |
| stars-bars | near-end | 11 | 0 | Y | 47 ns | n/a | 48 ns | 311.1 µs | 64.3 µs | 69.9 µs |
| sum-dominoes | opening | 0 | 1 |  | 48 ns | 260.3 µs | 48 ns | 112.7 µs | n/a | n/a |
| sum-dominoes | midgame | 10 | 1 |  | 48 ns | 41.7 µs | 46 ns | 182.8 µs | 277.7 µs | 303.1 µs |
| sum-dominoes | near-end | 22 | 1 |  | 47 ns | 28.2 µs | 48 ns | 264.4 µs | 762.6 µs | 728.1 µs |

## Notes

- Undo/redo measure **prefix-replay** cost (no native engine undo API). Cost grows with ply depth.
- `serialize` is `adapter.roundTrip` (Map/Set-aware JSON, or kings dedicated codec).
- Report-only: not gated in CI. Re-run with `npm run bench:engines`.

Machine-readable twin: [`engine-bench-2026-10-08.json`](./engine-bench-2026-10-08.json)
