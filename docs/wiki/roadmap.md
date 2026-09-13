# Roadmap

Public pointers only. Prefer **code + registry** when planning docs lag the tree.

## In-repo planning docs

| Doc | Contents |
|-----|----------|
| [`ROADMAP.md`](../../ROADMAP.md) | Big Toad dependency matrix and shared-system build order |
| [`OWL-SYSTEM-ROADMAP.md`](../../OWL-SYSTEM-ROADMAP.md) | Ollie the Owl engagement / mascot system plan |
| [Big Toads wiki page](./big-toads.md) | Current `src/core/` system index |

## Product snapshot (code truth)

- **20** games registered and available in `src/core/game-registry.ts`
- Shared systems already present under `src/core/` (dice, alignment, fractions, polyomino, attributes, graph, hex, expressions)
- Live practice edition: [https://math.pappas.work](https://math.pappas.work)
- Trunk: `alpha`

Older roadmap language that still says “games remaining” or similar may predate the full catalog. When in doubt, open the registry and `src/games/`.

## Stewardship notes

- Docs and UI polish are safe agent work; scoring, schema, and `alpha` → `main` promotions escalate (`AGENTS.md`).
- Accessibility continues via shared `board-a11y` helpers — see [Accessibility](./accessibility.md).
- Do not invent catalog games (including Math Relay) in roadmap copy.
