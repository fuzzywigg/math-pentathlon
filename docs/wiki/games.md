# Games

Canonical list from `src/core/game-registry.ts`. All twenty games are marked `available: true` in the registry. Play them at [https://math.pappas.work](https://math.pappas.work).

There is **no Math Relay** in this tree.

## Division I — Grades K–1

| Game | Focus (registry description) |
|------|------------------------------|
| Kings & Quadraphages | Trap the opponent’s King with Quadraphages |
| Hex | Connect opposite sides with an unbroken chain |
| Star Track | Move across a star-shaped board with chain links |
| Hex-a-Gone! | Cover hex spaces with pattern blocks |
| Calla | Distribute cubes to capture and earn free turns |

## Division II — Grades 2–3

| Game | Focus (registry description) |
|------|------------------------------|
| Sum Dominoes & Dice | Match domino faces to dice sums |
| Par 55 | Attribute logic blocks on pentagon bases |
| Ramrod | Cuisenaire rods and sum boxes |
| Kwatro-Sinko | Alignments totaling four or five |
| FIAR | Four in a row along pathways |

## Division III — Grades 4–5

| Game | Focus (registry description) |
|------|------------------------------|
| Juggle | Polyominoes on a 9×9 grid |
| Contig 60 | Number sentences from dice rolls |
| Stars & Bars | Geometric attribute classification |
| Fab-a-Diffy | Fraction bars, equivalence, operations |
| Queens & Guards | Hexagonal checkers/chess-style strategy |

## Division IV — Grades 6–7

| Game | Focus (registry description) |
|------|------------------------------|
| Prime Gold | Exponents, factorials, primes, alignment |
| Remainder Islands | Division and remainders on hex islands |
| Pent'Em In | Pentominoes and transformational geometry |
| Frac Fact | Fraction bars matched to answer bars |
| Fraction Pinball | Fraction–decimal conversion |

## Implementation map

Each game lives under `src/games/<id>/` (typically `game-state.ts`, `rules.ts`, `board-ui.ts`, `game-controller.ts`). Shared systems are documented in [Big Toads](./big-toads.md).
