# Game visuals gallery (2026-10)

iPad Pro 11 start-screen and mid-game human-vs-human captures for the twenty registered games. PNGs live under [`docs/visuals/2026-10/`](../visuals/2026-10/) (source index: [README](../visuals/2026-10/README.md)).

These are distinct from the shell/route shots under [`images/`](./images/) (landing, Hex shell, Kings board, stats) and from the Chromium lifecycle set linked in [game lifecycle](../dev/engines/game-lifecycle.md).

## Three visual entrypoints

Easy to pick the wrong suite — named `package.json` scripts and this docs capture use different configs:

| Entrypoint                | Purpose                                                                                                     | How to run                                                    |
| ------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| Docs / iPad capture       | Regenerates PNGs under `docs/visuals/2026-10/` (this page). Not CI.                                         | `npm run docs:visuals-2026-10`                                |
| Opt-in 2D visual          | Local regression baselines in `tests/visual/__screenshots__/`. Not CI.                                      | `npm run test:visual` → `playwright.visual.config.ts`         |
| CI report-only e2e visual | `visual-desktop` / `visual-phone` in `playwright.config.ts`; baselines under `tests/e2e/visual-baselines/`. | `npm run test:e2e:visual`                                     |

Named-script cheat sheet: [Development](./development.md) (visual bullets). Do not use bare `npx playwright test -c playwright.visual.config.ts` when you mean the docs gallery, or the reverse.

Regenerate this gallery only (not CI; does not refresh regression baselines):

```bash
npm run docs:visuals-2026-10
```

## Division I — Grades K–1

### Kings & Quadraphages

![Kings & Quadraphages start](../visuals/2026-10/kings-quadraphages-start.png)

![Kings & Quadraphages mid-game](../visuals/2026-10/kings-quadraphages-mid.png)

### Hex

![Hex start](../visuals/2026-10/hex-start.png)

![Hex mid-game](../visuals/2026-10/hex-mid.png)

### Star Track

![Star Track start](../visuals/2026-10/star-track-start.png)

![Star Track mid-game](../visuals/2026-10/star-track-mid.png)

### Hex-a-Gone!

![Hex-a-Gone start](../visuals/2026-10/hex-a-gone-start.png)

![Hex-a-Gone mid-game](../visuals/2026-10/hex-a-gone-mid.png)

### Calla

![Calla start](../visuals/2026-10/calla-start.png)

![Calla mid-game](../visuals/2026-10/calla-mid.png)

## Division II — Grades 2–3

### Sum Dominoes & Dice

![Sum Dominoes start](../visuals/2026-10/sum-dominoes-start.png)

![Sum Dominoes mid-game](../visuals/2026-10/sum-dominoes-mid.png)

### Par 55

![Par 55 start](../visuals/2026-10/par-55-start.png)

![Par 55 mid-game](../visuals/2026-10/par-55-mid.png)

### Ramrod

![Ramrod start](../visuals/2026-10/ramrod-start.png)

![Ramrod mid-game](../visuals/2026-10/ramrod-mid.png)

### Kwatro-Sinko

![Kwatro-Sinko start](../visuals/2026-10/kwatro-sinko-start.png)

![Kwatro-Sinko mid-game](../visuals/2026-10/kwatro-sinko-mid.png)

### FIAR

![FIAR start](../visuals/2026-10/fiar-start.png)

![FIAR mid-game](../visuals/2026-10/fiar-mid.png)

## Division III — Grades 4–5

### Juggle

![Juggle start](../visuals/2026-10/juggle-start.png)

![Juggle mid-game](../visuals/2026-10/juggle-mid.png)

### Contig 60

![Contig 60 start](../visuals/2026-10/contig-60-start.png)

![Contig 60 mid-game](../visuals/2026-10/contig-60-mid.png)

### Stars & Bars

![Stars & Bars start](../visuals/2026-10/stars-bars-start.png)

![Stars & Bars mid-game](../visuals/2026-10/stars-bars-mid.png)

### Fab-a-Diffy

![Fab-a-Diffy start](../visuals/2026-10/fab-a-diffy-start.png)

![Fab-a-Diffy mid-game](../visuals/2026-10/fab-a-diffy-mid.png)

### Queens & Guards

![Queens & Guards start](../visuals/2026-10/queens-guards-start.png)

![Queens & Guards mid-game](../visuals/2026-10/queens-guards-mid.png)

## Division IV — Grades 6–7

### Prime Gold

![Prime Gold start](../visuals/2026-10/prime-gold-start.png)

![Prime Gold mid-game](../visuals/2026-10/prime-gold-mid.png)

### Remainder Islands

![Remainder Islands start](../visuals/2026-10/remainder-islands-start.png)

![Remainder Islands mid-game](../visuals/2026-10/remainder-islands-mid.png)

### Pent'Em In

![Pent'Em In start](../visuals/2026-10/pent-em-in-start.png)

![Pent'Em In mid-game](../visuals/2026-10/pent-em-in-mid.png)

### Frac Fact

![Frac Fact start](../visuals/2026-10/frac-fact-start.png)

![Frac Fact mid-game](../visuals/2026-10/frac-fact-mid.png)

### Fraction Pinball

![Fraction Pinball start](../visuals/2026-10/fraction-pinball-start.png)

![Fraction Pinball mid-game](../visuals/2026-10/fraction-pinball-mid.png)

## Related

- [Games](./games.md) — registry list by division
- [Architecture](./architecture.md) — shell/route screenshots under `images/`
- [iPad visuals index](../visuals/2026-10/README.md) — file table + regenerate command
