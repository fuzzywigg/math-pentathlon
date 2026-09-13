# Math Pentathlon — public learning-game wiki

Product-first docs for parents, educators, and builders. Live practice site: [https://math.pappas.work](https://math.pappas.work).

Source of truth for game names and divisions is `src/core/game-registry.ts`. There is **no Math Relay** in this tree.

## Outline

| Page | Audience |
|------|----------|
| [Overview](./overview.md) | What the product is |
| [Games](./games.md) | The 20 registered games by division |
| [Big Toads](./big-toads.md) | Shared core systems under `src/core/` |
| [Development](./development.md) | Install, test, branch, and deploy posture |
| [Accessibility](./accessibility.md) | Public a11y posture and shared helpers |
| [Roadmap](./roadmap.md) | Where to read deeper planning docs |

## Conventions

- Keep copy factual. Optional Aesop-style narrative belongs in story/tutorial surfaces, not here.
- Do not invent games or scoring claims beyond the registry and live site.
- Do not publish private family, school, or operational details.
- In-repo docs live under `docs/`; the public app is Cloudflare Pages at math.pappas.work (deployed from `alpha`).
