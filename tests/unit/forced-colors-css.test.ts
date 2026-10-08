/**
 * Keepers for forced-colors / color-scheme CSS (burn-1008-mp-forced-colors).
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const forcedCss = readFileSync(
  resolve(process.cwd(), 'src/ui/styles/forced-colors.css'),
  'utf8'
);
const mainTs = readFileSync(resolve(process.cwd(), 'src/main.ts'), 'utf8');
const gamePlay = readFileSync(
  resolve(process.cwd(), 'src/ui/styles/game-play.css'),
  'utf8'
);
const contig = readFileSync(
  resolve(process.cwd(), 'src/games/contig-60/board-ui.ts'),
  'utf8'
);
const fracFact = readFileSync(
  resolve(process.cwd(), 'src/games/frac-fact/board-ui.ts'),
  'utf8'
);
const graphUi = readFileSync(
  resolve(process.cwd(), 'src/core/graph/graph-ui.ts'),
  'utf8'
);
const fabCtrl = readFileSync(
  resolve(process.cwd(), 'src/games/fab-a-diffy/game-controller.ts'),
  'utf8'
);

describe('forced-colors CSS keepers', () => {
  it('imports forced-colors.css from main.ts', () => {
    expect(mainTs).toMatch(/forced-colors\.css/);
  });

  it('declares color-scheme light and forced-colors media block', () => {
    expect(forcedCss).toMatch(/color-scheme:\s*light/);
    expect(forcedCss).toMatch(/@media\s*\(\s*forced-colors:\s*active\s*\)/);
    expect(forcedCss).toMatch(/forced-color-adjust:\s*none/);
    expect(forcedCss).toMatch(/outline:\s*3px\s+solid\s+Highlight/);
    expect(forcedCss).toMatch(/\.game-card:focus-visible/);
    expect(forcedCss).toMatch(/\.hex-cell-p1/);
    expect(forcedCss).toMatch(/\.contig-cell-valid/);
  });

  it('mirrors Hex + Star Track reduced-motion under html[data-reduced-motion]', () => {
    expect(gamePlay).toMatch(
      /html\[data-reduced-motion='true'\]\s*\.hex-cell-p1/
    );
    expect(gamePlay).toMatch(
      /html\[data-reduced-motion='true'\]\s*\.star-track-goal/
    );
  });

  it('Contig + Frac Fact injectors gate transitions under reduced-motion', () => {
    expect(contig).toMatch(/prefers-reduced-motion:\s*reduce/);
    expect(fracFact).toMatch(/prefers-reduced-motion:\s*reduce/);
  });

  it('graph animateMove and Fab scroll honor reduced-motion', () => {
    expect(graphUi).toMatch(/graphPrefersReducedMotion/);
    expect(graphUi).toMatch(/effectiveDuration/);
    expect(fabCtrl).toMatch(/scrollBehaviorForMotion/);
  });
});
