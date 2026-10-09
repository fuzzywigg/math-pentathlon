# Math Pentathlon — public learning-game wiki

Product-first docs for parents, educators, and builders. Live practice site: [https://math.pappas.work](https://math.pappas.work).

Source of truth for game names and divisions is `src/core/game-registry.ts`. There is **no Math Relay** in this tree.

## Outline

| Page | Audience |
|------|----------|
| [Overview](./overview.md) | What the product is |
| [Architecture](./architecture.md) | Mermaid map + live screenshots of shell/routes |
| [injectStyles / board CSS (`q-mp-122`)](../dev/engines/inject-styles-board-css.md) | Contributor ownership map: inject vs `game-play.css` |
| [Games](./games.md) | The 20 registered games by division |
| [Game registry](./game-registry.md) | `GameInfo` shape, divisions, menu/route wiring |
| [How to add a game](./adding-a-game.md) | Module, registry, mount, and test checklist |
| [Big Toads](./big-toads.md) | Shared core systems under `src/core/` |
| [Development](./development.md) | Install, CI, and testing layers with live counts (axe, visual, playtest, bench) — also [CONTRIBUTING.md](../../CONTRIBUTING.md) + [`docs/dev/testing-layers-2026-10-09.md`](../dev/testing-layers-2026-10-09.md) |
| [Accessibility](./accessibility.md) | Public a11y posture and shared helpers |
| [Roadmap](./roadmap.md) | Where to read deeper planning docs |

## Screenshots in this wiki

Captured from the running Vite app (`npm run dev`) on the docs tip. Files live under [`images/`](./images/).

| Image | Surface |
| ----- | ------- |
| `landing.png` / `landing-full.png` | Home / registry menu |
| `hex-shell.png` / `hex-board.png` | Hex shared shell + opening board |
| `hex-new-game-modal.png` | New Game dialog (axe surface) |
| `kings-board.png` | Kings & Quadraphages board chrome |
| `stats-progress.png` | `/#/stats` progress dashboard |

## Conventions

- Keep copy factual. Optional Aesop-style narrative belongs in story/tutorial surfaces, not here.
- Do not invent games or scoring claims beyond the registry and live site.
- Do not publish private family, school, or operational details.
- In-repo docs live under `docs/`; the public app is Cloudflare Pages at math.pappas.work (deployed from `alpha`).
