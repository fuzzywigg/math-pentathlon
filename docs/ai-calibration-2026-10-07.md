# AI Calibration — 2026-10-07

Headless AI-vs-AI and AI-vs-random matrices across every game with an AI opponent.

## Method

- Engines: existing per-game AI modules under `src/games/*/ai.ts`
- Games per matchup: **50**
- Fixed base seed: `20261007` (match *i* uses seed `base + i * 1009`)
- RNG: mulberry32 via `createSeededRng` installed as `Math.random` for each game
- Search games (hex, queens-guards, fiar, fab-a-diffy): `deadlineMs=300` per decision (uncapped retry on null)
- Random opponent: uniform legal move where enumerated; else Easy policy as legal baseline
- Seat: policy under test is **player1**; opponent is **player2**
- Rules / scoring / end conditions: **unchanged**

## kings-quadraphages

### AI vs random

| Matchup | P1 win% | P2 win% | Draw% | Avg length | n |
|---|---:|---:|---:|---:|---:|
| easy-vs-random | 4.0% | 10.0% | 86.0% | 58.9 | 50 |
| medium-vs-random | 72.0% | 6.0% | 22.0% | 43.9 | 50 |
| hard-vs-random | 100.0% | 0.0% | 0.0% | 22.8 | 50 |

### AI vs AI

| Matchup | P1 win% | P2 win% | Draw% | Avg length | n |
|---|---:|---:|---:|---:|---:|
| easy-vs-medium | 2.0% | 74.0% | 24.0% | 45.1 | 50 |
| easy-vs-hard | 0.0% | 100.0% | 0.0% | 27.7 | 50 |
| medium-vs-easy | 80.0% | 0.0% | 20.0% | 46.6 | 50 |
| medium-vs-hard | 8.0% | 92.0% | 0.0% | 35.5 | 50 |
| hard-vs-easy | 100.0% | 0.0% | 0.0% | 21.7 | 50 |
| hard-vs-medium | 96.0% | 4.0% | 0.0% | 28.8 | 50 |

### Flags

- None (Hard ≥ Easy vs random; difficulty bands separable at 5pp).

## hex

### AI vs random

| Matchup | P1 win% | P2 win% | Draw% | Avg length | n |
|---|---:|---:|---:|---:|---:|
| easy-vs-random | 100.0% | 0.0% | 0.0% | 22.2 | 50 |
| medium-vs-random | 100.0% | 0.0% | 0.0% | 21.8 | 50 |
| hard-vs-random | 100.0% | 0.0% | 0.0% | 21.8 | 50 |

### AI vs AI

| Matchup | P1 win% | P2 win% | Draw% | Avg length | n |
|---|---:|---:|---:|---:|---:|
| easy-vs-medium | 36.0% | 64.0% | 0.0% | 30.2 | 50 |
| easy-vs-hard | 46.0% | 54.0% | 0.0% | 30.0 | 50 |
| medium-vs-easy | 48.0% | 52.0% | 0.0% | 29.6 | 50 |
| medium-vs-hard | 46.0% | 54.0% | 0.0% | 29.2 | 50 |
| hard-vs-easy | 42.0% | 58.0% | 0.0% | 30.5 | 50 |
| hard-vs-medium | 36.0% | 64.0% | 0.0% | 30.3 | 50 |

### Flags

- **indistinguishable**: hex: easy vs medium win rates indistinguishable (100.0% vs 100.0%) vs random
- **indistinguishable**: hex: medium vs hard win rates indistinguishable (100.0% vs 100.0%) vs random
- **indistinguishable**: hex: easy vs hard win rates indistinguishable (100.0% vs 100.0%) vs random

## star-track

### AI vs random

| Matchup | P1 win% | P2 win% | Draw% | Avg length | n |
|---|---:|---:|---:|---:|---:|
| easy-vs-random | 62.0% | 38.0% | 0.0% | 6.3 | 50 |
| medium-vs-random | 98.0% | 2.0% | 0.0% | 5.6 | 50 |
| hard-vs-random | 98.0% | 2.0% | 0.0% | 5.5 | 50 |

### AI vs AI

| Matchup | P1 win% | P2 win% | Draw% | Avg length | n |
|---|---:|---:|---:|---:|---:|
| easy-vs-medium | 24.0% | 76.0% | 0.0% | 6.3 | 50 |
| easy-vs-hard | 16.0% | 84.0% | 0.0% | 6.1 | 50 |
| medium-vs-easy | 88.0% | 12.0% | 0.0% | 5.8 | 50 |
| medium-vs-hard | 48.0% | 52.0% | 0.0% | 5.9 | 50 |
| hard-vs-easy | 94.0% | 6.0% | 0.0% | 5.5 | 50 |
| hard-vs-medium | 76.0% | 24.0% | 0.0% | 5.7 | 50 |

### Flags

- **indistinguishable**: star-track: medium vs hard win rates indistinguishable (98.0% vs 98.0%) vs random

## hex-a-gone

### AI vs random

| Matchup | P1 win% | P2 win% | Draw% | Avg length | n |
|---|---:|---:|---:|---:|---:|
| easy-vs-random | 48.0% | 52.0% | 0.0% | 13.4 | 50 |
| medium-vs-random | 46.0% | 54.0% | 0.0% | 12.6 | 50 |
| hard-vs-random | 44.0% | 56.0% | 0.0% | 12.6 | 50 |

### AI vs AI

| Matchup | P1 win% | P2 win% | Draw% | Avg length | n |
|---|---:|---:|---:|---:|---:|
| easy-vs-medium | 34.0% | 66.0% | 0.0% | 13.2 | 50 |
| easy-vs-hard | 30.0% | 70.0% | 0.0% | 13.1 | 50 |
| medium-vs-easy | 58.0% | 42.0% | 0.0% | 12.9 | 50 |
| medium-vs-hard | 10.0% | 90.0% | 0.0% | 12.1 | 50 |
| hard-vs-easy | 54.0% | 46.0% | 0.0% | 12.8 | 50 |
| hard-vs-medium | 16.0% | 84.0% | 0.0% | 12.2 | 50 |

### Flags

- **indistinguishable**: hex-a-gone: easy vs medium win rates indistinguishable (48.0% vs 46.0%) vs random
- **indistinguishable**: hex-a-gone: medium vs hard win rates indistinguishable (46.0% vs 44.0%) vs random
- **indistinguishable**: hex-a-gone: easy vs hard win rates indistinguishable (48.0% vs 44.0%) vs random

## calla

### AI vs random

| Matchup | P1 win% | P2 win% | Draw% | Avg length | n |
|---|---:|---:|---:|---:|---:|
| easy-vs-random | 80.0% | 18.0% | 2.0% | 22.1 | 50 |
| medium-vs-random | 88.0% | 10.0% | 2.0% | 18.7 | 50 |
| hard-vs-random | 90.0% | 10.0% | 0.0% | 20.5 | 50 |

### AI vs AI

| Matchup | P1 win% | P2 win% | Draw% | Avg length | n |
|---|---:|---:|---:|---:|---:|
| easy-vs-medium | 10.0% | 82.0% | 8.0% | 19.9 | 50 |
| easy-vs-hard | 2.0% | 94.0% | 4.0% | 19.2 | 50 |
| medium-vs-easy | 96.0% | 4.0% | 0.0% | 18.2 | 50 |
| medium-vs-hard | 54.0% | 42.0% | 4.0% | 19.1 | 50 |
| hard-vs-easy | 94.0% | 2.0% | 4.0% | 17.7 | 50 |
| hard-vs-medium | 68.0% | 28.0% | 4.0% | 22.6 | 50 |

### Flags

- **indistinguishable**: calla: medium vs hard win rates indistinguishable (88.0% vs 90.0%) vs random

## fiar

### AI vs random

| Matchup | P1 win% | P2 win% | Draw% | Avg length | n |
|---|---:|---:|---:|---:|---:|
| easy-vs-random | 86.0% | 14.0% | 0.0% | 18.9 | 50 |
| medium-vs-random | 92.0% | 8.0% | 0.0% | 29.3 | 50 |
| hard-vs-random | 96.0% | 4.0% | 0.0% | 29.0 | 50 |

### AI vs AI

| Matchup | P1 win% | P2 win% | Draw% | Avg length | n |
|---|---:|---:|---:|---:|---:|
| easy-vs-medium | 64.0% | 36.0% | 0.0% | 36.5 | 50 |
| easy-vs-hard | 58.0% | 42.0% | 0.0% | 22.9 | 50 |
| medium-vs-easy | 56.0% | 44.0% | 0.0% | 29.5 | 50 |
| medium-vs-hard | 26.0% | 38.0% | 36.0% | 223.8 | 50 |
| hard-vs-easy | 70.0% | 30.0% | 0.0% | 22.6 | 50 |
| hard-vs-medium | 46.0% | 40.0% | 14.0% | 157.9 | 50 |

### Flags

- **indistinguishable**: fiar: medium vs hard win rates indistinguishable (92.0% vs 96.0%) vs random

## queens-guards

### AI vs random

| Matchup | P1 win% | P2 win% | Draw% | Avg length | n |
|---|---:|---:|---:|---:|---:|
| easy-vs-random | 100.0% | 0.0% | 0.0% | 68.5 | 50 |
| medium-vs-random | 100.0% | 0.0% | 0.0% | 66.0 | 50 |
| hard-vs-random | 100.0% | 0.0% | 0.0% | 67.1 | 50 |

### AI vs AI

| Matchup | P1 win% | P2 win% | Draw% | Avg length | n |
|---|---:|---:|---:|---:|---:|
| easy-vs-medium | 36.0% | 46.0% | 18.0% | 112.8 | 50 |
| easy-vs-hard | 18.0% | 72.0% | 10.0% | 102.8 | 50 |
| medium-vs-easy | 78.0% | 2.0% | 20.0% | 149.0 | 50 |
| medium-vs-hard | 52.0% | 28.0% | 20.0% | 120.1 | 50 |
| hard-vs-easy | 96.0% | 0.0% | 4.0% | 98.1 | 50 |
| hard-vs-medium | 88.0% | 0.0% | 12.0% | 127.6 | 50 |

### Flags

- **indistinguishable**: queens-guards: easy vs medium win rates indistinguishable (100.0% vs 100.0%) vs random
- **indistinguishable**: queens-guards: medium vs hard win rates indistinguishable (100.0% vs 100.0%) vs random
- **indistinguishable**: queens-guards: easy vs hard win rates indistinguishable (100.0% vs 100.0%) vs random

## contig-60

### AI vs random

| Matchup | P1 win% | P2 win% | Draw% | Avg length | n |
|---|---:|---:|---:|---:|---:|
| easy-vs-random | 52.0% | 34.0% | 14.0% | 27.7 | 50 |
| medium-vs-random | 68.0% | 30.0% | 2.0% | 25.7 | 50 |
| hard-vs-random | 76.0% | 22.0% | 2.0% | 25.0 | 50 |

### AI vs AI

| Matchup | P1 win% | P2 win% | Draw% | Avg length | n |
|---|---:|---:|---:|---:|---:|
| easy-vs-medium | 22.0% | 70.0% | 8.0% | 27.7 | 50 |
| easy-vs-hard | 24.0% | 74.0% | 2.0% | 28.6 | 50 |
| medium-vs-easy | 70.0% | 28.0% | 2.0% | 28.6 | 50 |
| medium-vs-hard | 58.0% | 40.0% | 2.0% | 30.6 | 50 |
| hard-vs-easy | 70.0% | 26.0% | 4.0% | 27.8 | 50 |
| hard-vs-medium | 62.0% | 32.0% | 6.0% | 28.6 | 50 |

### Flags

- None (Hard ≥ Easy vs random; difficulty bands separable at 5pp).

## juggle

### AI vs random

| Matchup | P1 win% | P2 win% | Draw% | Avg length | n |
|---|---:|---:|---:|---:|---:|
| easy-vs-random | 54.0% | 46.0% | 0.0% | 58.2 | 50 |
| medium-vs-random | 88.0% | 12.0% | 0.0% | 47.7 | 50 |
| hard-vs-random | 94.0% | 6.0% | 0.0% | 45.4 | 50 |

### AI vs AI

| Matchup | P1 win% | P2 win% | Draw% | Avg length | n |
|---|---:|---:|---:|---:|---:|
| easy-vs-medium | 30.0% | 70.0% | 0.0% | 44.2 | 50 |
| easy-vs-hard | 30.0% | 70.0% | 0.0% | 43.9 | 50 |
| medium-vs-easy | 76.0% | 24.0% | 0.0% | 43.8 | 50 |
| medium-vs-hard | 50.0% | 50.0% | 0.0% | 40.7 | 50 |
| hard-vs-easy | 76.0% | 24.0% | 0.0% | 43.6 | 50 |
| hard-vs-medium | 52.0% | 48.0% | 0.0% | 40.8 | 50 |

### Flags

- None (Hard ≥ Easy vs random; difficulty bands separable at 5pp).

## fab-a-diffy

### AI vs random

| Matchup | P1 win% | P2 win% | Draw% | Avg length | n |
|---|---:|---:|---:|---:|---:|
| easy-vs-random | 50.0% | 0.0% | 50.0% | 19.9 | 50 |
| medium-vs-random | 42.0% | 0.0% | 58.0% | 20.3 | 50 |
| hard-vs-random | 50.0% | 0.0% | 50.0% | 20.1 | 50 |

### AI vs AI

| Matchup | P1 win% | P2 win% | Draw% | Avg length | n |
|---|---:|---:|---:|---:|---:|
| easy-vs-medium | 54.0% | 0.0% | 46.0% | 20.1 | 50 |
| easy-vs-hard | 52.0% | 0.0% | 48.0% | 20.2 | 50 |
| medium-vs-easy | 52.0% | 0.0% | 48.0% | 20.1 | 50 |
| medium-vs-hard | 38.0% | 0.0% | 62.0% | 20.3 | 50 |
| hard-vs-easy | 58.0% | 0.0% | 42.0% | 20.0 | 50 |
| hard-vs-medium | 60.0% | 0.0% | 40.0% | 20.2 | 50 |

### Flags

- **indistinguishable**: fab-a-diffy: easy vs hard win rates indistinguishable (50.0% vs 50.0%) vs random

## sum-dominoes

### AI vs random

| Matchup | P1 win% | P2 win% | Draw% | Avg length | n |
|---|---:|---:|---:|---:|---:|
| easy-vs-random | 52.0% | 48.0% | 0.0% | 13.0 | 50 |
| medium-vs-random | 54.0% | 46.0% | 0.0% | 12.9 | 50 |
| hard-vs-random | 50.0% | 50.0% | 0.0% | 12.9 | 50 |

### AI vs AI

| Matchup | P1 win% | P2 win% | Draw% | Avg length | n |
|---|---:|---:|---:|---:|---:|
| easy-vs-medium | 52.0% | 48.0% | 0.0% | 13.3 | 50 |
| easy-vs-hard | 52.0% | 48.0% | 0.0% | 13.3 | 50 |
| medium-vs-easy | 48.0% | 52.0% | 0.0% | 13.3 | 50 |
| medium-vs-hard | 46.0% | 54.0% | 0.0% | 13.3 | 50 |
| hard-vs-easy | 48.0% | 52.0% | 0.0% | 13.3 | 50 |
| hard-vs-medium | 46.0% | 54.0% | 0.0% | 13.3 | 50 |

### Flags

- **indistinguishable**: sum-dominoes: easy vs medium win rates indistinguishable (52.0% vs 54.0%) vs random
- **indistinguishable**: sum-dominoes: medium vs hard win rates indistinguishable (54.0% vs 50.0%) vs random
- **indistinguishable**: sum-dominoes: easy vs hard win rates indistinguishable (52.0% vs 50.0%) vs random

## par-55

### AI vs random

| Matchup | P1 win% | P2 win% | Draw% | Avg length | n |
|---|---:|---:|---:|---:|---:|
| easy-vs-random | 36.0% | 62.0% | 2.0% | 10.0 | 50 |
| medium-vs-random | 64.0% | 22.0% | 14.0% | 10.0 | 50 |
| hard-vs-random | 70.0% | 20.0% | 10.0% | 10.0 | 50 |

### AI vs AI

| Matchup | P1 win% | P2 win% | Draw% | Avg length | n |
|---|---:|---:|---:|---:|---:|
| easy-vs-medium | 2.0% | 98.0% | 0.0% | 10.0 | 50 |
| easy-vs-hard | 0.0% | 100.0% | 0.0% | 10.0 | 50 |
| medium-vs-easy | 74.0% | 22.0% | 4.0% | 10.0 | 50 |
| medium-vs-hard | 14.0% | 80.0% | 6.0% | 10.0 | 50 |
| hard-vs-easy | 78.0% | 16.0% | 6.0% | 10.0 | 50 |
| hard-vs-medium | 28.0% | 72.0% | 0.0% | 10.0 | 50 |

### Flags

- None (Hard ≥ Easy vs random; difficulty bands separable at 5pp).

## ramrod

### AI vs random

| Matchup | P1 win% | P2 win% | Draw% | Avg length | n |
|---|---:|---:|---:|---:|---:|
| easy-vs-random | 54.0% | 46.0% | 0.0% | 12.8 | 50 |
| medium-vs-random | 84.0% | 16.0% | 0.0% | 11.2 | 50 |
| hard-vs-random | 80.0% | 20.0% | 0.0% | 10.8 | 50 |

### AI vs AI

| Matchup | P1 win% | P2 win% | Draw% | Avg length | n |
|---|---:|---:|---:|---:|---:|
| easy-vs-medium | 6.0% | 94.0% | 0.0% | 11.3 | 50 |
| easy-vs-hard | 8.0% | 92.0% | 0.0% | 11.1 | 50 |
| medium-vs-easy | 80.0% | 20.0% | 0.0% | 11.6 | 50 |
| medium-vs-hard | 32.0% | 68.0% | 0.0% | 11.5 | 50 |
| hard-vs-easy | 90.0% | 10.0% | 0.0% | 11.3 | 50 |
| hard-vs-medium | 52.0% | 48.0% | 0.0% | 11.8 | 50 |

### Flags

- **indistinguishable**: ramrod: medium vs hard win rates indistinguishable (84.0% vs 80.0%) vs random

## kwatro-sinko

### AI vs random

| Matchup | P1 win% | P2 win% | Draw% | Avg length | n |
|---|---:|---:|---:|---:|---:|
| easy-vs-random | 44.0% | 56.0% | 0.0% | 17.1 | 50 |
| medium-vs-random | 92.0% | 8.0% | 0.0% | 11.5 | 50 |
| hard-vs-random | 98.0% | 2.0% | 0.0% | 11.4 | 50 |

### AI vs AI

| Matchup | P1 win% | P2 win% | Draw% | Avg length | n |
|---|---:|---:|---:|---:|---:|
| easy-vs-medium | 4.0% | 96.0% | 0.0% | 13.4 | 50 |
| easy-vs-hard | 0.0% | 100.0% | 0.0% | 12.3 | 50 |
| medium-vs-easy | 96.0% | 4.0% | 0.0% | 11.5 | 50 |
| medium-vs-hard | 78.0% | 22.0% | 0.0% | 10.9 | 50 |
| hard-vs-easy | 100.0% | 0.0% | 0.0% | 11.2 | 50 |
| hard-vs-medium | 100.0% | 0.0% | 0.0% | 10.9 | 50 |

### Flags

- None (Hard ≥ Easy vs random; difficulty bands separable at 5pp).

## prime-gold

### AI vs random

| Matchup | P1 win% | P2 win% | Draw% | Avg length | n |
|---|---:|---:|---:|---:|---:|
| easy-vs-random | 0.0% | 0.0% | 100.0% | 400.0 | 50 |
| medium-vs-random | 0.0% | 0.0% | 100.0% | 336.0 | 50 |
| hard-vs-random | 0.0% | 0.0% | 100.0% | 357.2 | 50 |

### AI vs AI

| Matchup | P1 win% | P2 win% | Draw% | Avg length | n |
|---|---:|---:|---:|---:|---:|
| easy-vs-medium | 0.0% | 2.0% | 98.0% | 221.1 | 50 |
| easy-vs-hard | 0.0% | 2.0% | 98.0% | 221.0 | 50 |
| medium-vs-easy | 2.0% | 0.0% | 98.0% | 213.8 | 50 |
| medium-vs-hard | 0.0% | 2.0% | 98.0% | 221.0 | 50 |
| hard-vs-easy | 0.0% | 0.0% | 100.0% | 227.9 | 50 |
| hard-vs-medium | 0.0% | 0.0% | 100.0% | 213.7 | 50 |

### Flags

- **indistinguishable**: prime-gold: easy vs medium win rates indistinguishable (0.0% vs 0.0%) vs random
- **indistinguishable**: prime-gold: medium vs hard win rates indistinguishable (0.0% vs 0.0%) vs random
- **indistinguishable**: prime-gold: easy vs hard win rates indistinguishable (0.0% vs 0.0%) vs random

## pent-em-in

### AI vs random

| Matchup | P1 win% | P2 win% | Draw% | Avg length | n |
|---|---:|---:|---:|---:|---:|
| easy-vs-random | 52.0% | 48.0% | 0.0% | 15.1 | 50 |
| medium-vs-random | 50.0% | 50.0% | 0.0% | 15.2 | 50 |
| hard-vs-random | 62.0% | 38.0% | 0.0% | 14.9 | 50 |

### AI vs AI

| Matchup | P1 win% | P2 win% | Draw% | Avg length | n |
|---|---:|---:|---:|---:|---:|
| easy-vs-medium | 44.0% | 56.0% | 0.0% | 15.2 | 50 |
| easy-vs-hard | 56.0% | 44.0% | 0.0% | 15.3 | 50 |
| medium-vs-easy | 44.0% | 56.0% | 0.0% | 15.1 | 50 |
| medium-vs-hard | 38.0% | 62.0% | 0.0% | 14.9 | 50 |
| hard-vs-easy | 44.0% | 56.0% | 0.0% | 15.0 | 50 |
| hard-vs-medium | 34.0% | 66.0% | 0.0% | 14.9 | 50 |

### Flags

- **indistinguishable**: pent-em-in: easy vs medium win rates indistinguishable (52.0% vs 50.0%) vs random

## frac-fact

### AI vs random

| Matchup | P1 win% | P2 win% | Draw% | Avg length | n |
|---|---:|---:|---:|---:|---:|
| easy-vs-random | 82.0% | 4.0% | 14.0% | 10.0 | 50 |
| medium-vs-random | 96.0% | 0.0% | 4.0% | 10.0 | 50 |
| hard-vs-random | 98.0% | 0.0% | 2.0% | 10.0 | 50 |

### AI vs AI

| Matchup | P1 win% | P2 win% | Draw% | Avg length | n |
|---|---:|---:|---:|---:|---:|
| easy-vs-medium | 4.0% | 96.0% | 0.0% | 10.0 | 50 |
| easy-vs-hard | 0.0% | 100.0% | 0.0% | 10.0 | 50 |
| medium-vs-easy | 94.0% | 4.0% | 2.0% | 10.0 | 50 |
| medium-vs-hard | 6.0% | 32.0% | 62.0% | 10.0 | 50 |
| hard-vs-easy | 100.0% | 0.0% | 0.0% | 10.0 | 50 |
| hard-vs-medium | 24.0% | 2.0% | 74.0% | 10.0 | 50 |

### Flags

- **indistinguishable**: frac-fact: medium vs hard win rates indistinguishable (96.0% vs 98.0%) vs random

## remainder-islands

### AI vs random

| Matchup | P1 win% | P2 win% | Draw% | Avg length | n |
|---|---:|---:|---:|---:|---:|
| easy-vs-random | 100.0% | 0.0% | 0.0% | 24.0 | 50 |
| medium-vs-random | 100.0% | 0.0% | 0.0% | 24.0 | 50 |
| hard-vs-random | 100.0% | 0.0% | 0.0% | 24.0 | 50 |

### AI vs AI

| Matchup | P1 win% | P2 win% | Draw% | Avg length | n |
|---|---:|---:|---:|---:|---:|
| easy-vs-medium | 40.0% | 52.0% | 8.0% | 24.0 | 50 |
| easy-vs-hard | 40.0% | 52.0% | 8.0% | 24.0 | 50 |
| medium-vs-easy | 52.0% | 46.0% | 2.0% | 24.0 | 50 |
| medium-vs-hard | 46.0% | 52.0% | 2.0% | 24.0 | 50 |
| hard-vs-easy | 52.0% | 46.0% | 2.0% | 24.0 | 50 |
| hard-vs-medium | 46.0% | 52.0% | 2.0% | 24.0 | 50 |

### Flags

- **indistinguishable**: remainder-islands: easy vs medium win rates indistinguishable (100.0% vs 100.0%) vs random
- **indistinguishable**: remainder-islands: medium vs hard win rates indistinguishable (100.0% vs 100.0%) vs random
- **indistinguishable**: remainder-islands: easy vs hard win rates indistinguishable (100.0% vs 100.0%) vs random

## fraction-pinball

### AI vs random

| Matchup | P1 win% | P2 win% | Draw% | Avg length | n |
|---|---:|---:|---:|---:|---:|
| easy-vs-random | 46.0% | 38.0% | 16.0% | 20.0 | 50 |
| medium-vs-random | 86.0% | 10.0% | 4.0% | 20.0 | 50 |
| hard-vs-random | 90.0% | 10.0% | 0.0% | 20.0 | 50 |

### AI vs AI

| Matchup | P1 win% | P2 win% | Draw% | Avg length | n |
|---|---:|---:|---:|---:|---:|
| easy-vs-medium | 4.0% | 94.0% | 2.0% | 20.0 | 50 |
| easy-vs-hard | 0.0% | 98.0% | 2.0% | 20.0 | 50 |
| medium-vs-easy | 96.0% | 0.0% | 4.0% | 20.0 | 50 |
| medium-vs-hard | 34.0% | 52.0% | 14.0% | 20.0 | 50 |
| hard-vs-easy | 100.0% | 0.0% | 0.0% | 20.0 | 50 |
| hard-vs-medium | 60.0% | 28.0% | 12.0% | 20.0 | 50 |

### Flags

- **indistinguishable**: fraction-pinball: medium vs hard win rates indistinguishable (86.0% vs 90.0%) vs random

## stars-bars

### AI vs random

| Matchup | P1 win% | P2 win% | Draw% | Avg length | n |
|---|---:|---:|---:|---:|---:|
| easy-vs-random | 100.0% | 0.0% | 0.0% | 8.9 | 50 |
| medium-vs-random | 100.0% | 0.0% | 0.0% | 8.8 | 50 |
| hard-vs-random | 100.0% | 0.0% | 0.0% | 8.9 | 50 |

### AI vs AI

| Matchup | P1 win% | P2 win% | Draw% | Avg length | n |
|---|---:|---:|---:|---:|---:|
| easy-vs-medium | 32.0% | 68.0% | 0.0% | 8.6 | 50 |
| easy-vs-hard | 26.0% | 74.0% | 0.0% | 8.6 | 50 |
| medium-vs-easy | 84.0% | 16.0% | 0.0% | 8.9 | 50 |
| medium-vs-hard | 44.0% | 56.0% | 0.0% | 8.4 | 50 |
| hard-vs-easy | 82.0% | 18.0% | 0.0% | 8.8 | 50 |
| hard-vs-medium | 54.0% | 46.0% | 0.0% | 8.5 | 50 |

### Flags

- **indistinguishable**: stars-bars: easy vs medium win rates indistinguishable (100.0% vs 100.0%) vs random
- **indistinguishable**: stars-bars: medium vs hard win rates indistinguishable (100.0% vs 100.0%) vs random
- **indistinguishable**: stars-bars: easy vs hard win rates indistinguishable (100.0% vs 100.0%) vs random

## Summary flags

- **indistinguishable**: hex: easy vs medium win rates indistinguishable (100.0% vs 100.0%) vs random
- **indistinguishable**: hex: medium vs hard win rates indistinguishable (100.0% vs 100.0%) vs random
- **indistinguishable**: hex: easy vs hard win rates indistinguishable (100.0% vs 100.0%) vs random
- **indistinguishable**: star-track: medium vs hard win rates indistinguishable (98.0% vs 98.0%) vs random
- **indistinguishable**: hex-a-gone: easy vs medium win rates indistinguishable (48.0% vs 46.0%) vs random
- **indistinguishable**: hex-a-gone: medium vs hard win rates indistinguishable (46.0% vs 44.0%) vs random
- **indistinguishable**: hex-a-gone: easy vs hard win rates indistinguishable (48.0% vs 44.0%) vs random
- **indistinguishable**: calla: medium vs hard win rates indistinguishable (88.0% vs 90.0%) vs random
- **indistinguishable**: fiar: medium vs hard win rates indistinguishable (92.0% vs 96.0%) vs random
- **indistinguishable**: queens-guards: easy vs medium win rates indistinguishable (100.0% vs 100.0%) vs random
- **indistinguishable**: queens-guards: medium vs hard win rates indistinguishable (100.0% vs 100.0%) vs random
- **indistinguishable**: queens-guards: easy vs hard win rates indistinguishable (100.0% vs 100.0%) vs random
- **indistinguishable**: fab-a-diffy: easy vs hard win rates indistinguishable (50.0% vs 50.0%) vs random
- **indistinguishable**: sum-dominoes: easy vs medium win rates indistinguishable (52.0% vs 54.0%) vs random
- **indistinguishable**: sum-dominoes: medium vs hard win rates indistinguishable (54.0% vs 50.0%) vs random
- **indistinguishable**: sum-dominoes: easy vs hard win rates indistinguishable (52.0% vs 50.0%) vs random
- **indistinguishable**: ramrod: medium vs hard win rates indistinguishable (84.0% vs 80.0%) vs random
- **indistinguishable**: prime-gold: easy vs medium win rates indistinguishable (0.0% vs 0.0%) vs random
- **indistinguishable**: prime-gold: medium vs hard win rates indistinguishable (0.0% vs 0.0%) vs random
- **indistinguishable**: prime-gold: easy vs hard win rates indistinguishable (0.0% vs 0.0%) vs random
- **indistinguishable**: pent-em-in: easy vs medium win rates indistinguishable (52.0% vs 50.0%) vs random
- **indistinguishable**: frac-fact: medium vs hard win rates indistinguishable (96.0% vs 98.0%) vs random
- **indistinguishable**: remainder-islands: easy vs medium win rates indistinguishable (100.0% vs 100.0%) vs random
- **indistinguishable**: remainder-islands: medium vs hard win rates indistinguishable (100.0% vs 100.0%) vs random
- **indistinguishable**: remainder-islands: easy vs hard win rates indistinguishable (100.0% vs 100.0%) vs random
- **indistinguishable**: fraction-pinball: medium vs hard win rates indistinguishable (86.0% vs 90.0%) vs random
- **indistinguishable**: stars-bars: easy vs medium win rates indistinguishable (100.0% vs 100.0%) vs random
- **indistinguishable**: stars-bars: medium vs hard win rates indistinguishable (100.0% vs 100.0%) vs random
- **indistinguishable**: stars-bars: easy vs hard win rates indistinguishable (100.0% vs 100.0%) vs random

## Notes

- Heuristic tuning is only warranted when a level is clearly broken (Easy ≫ Hard or collapsed bands).
- Unit guard: `tests/unit/ai-calibration-difficulty-order.test.ts` asserts Hard ≥ Easy on a small seeded sample per game.
- Generated in 9902.7s via `CALIBRATION_WALL_CLOCK=1 CALIBRATION_DEADLINE_MS=150 CALIBRATION_GAMES=50 npx vite-node scripts/run-ai-calibration.ts`.
- Search deadlines can compress Hard vs Medium separation (both often saturate vs random).
- `prime-gold` hit the harness ply cap (`avgLen≈400`) with 100% draws — games did not reach a native `gameOver` under mutual pass loops; treat those rows as inconclusive, not balanced AI.
- Tuned this pass (heuristics only): Kwatro-Sinko opponent-reply penalty + numbered-pad pressure; FIAR Hard placement depth uncapped from 1; Pent'Em In space scoring inverted toward entrapment.
