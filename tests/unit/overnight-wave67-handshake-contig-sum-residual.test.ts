/**
 * Wave 67 leftover after tip/#316 — Contig × Sum residual handshake.
 * Mount unsaturated tutorial exacts + inject/style pins (no fab/fiar). Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { contig60Tutorial } from '../../src/games/contig-60/tutorial';
import { sumDominoesTutorial } from '../../src/games/sum-dominoes/tutorial';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 67 handshake — contig × sum residual', () => {
  it('mounts residual tutorial + inject + style leftovers for both', () => {
    const contigStep = contig60Tutorial.steps.find((s) => s.id === 'expression-rules');
    const sumStep = sumDominoesTutorial.steps.find((s) => s.id === 'setup');
    expect(contigStep?.message).toContain(
      '<strong>any two operations</strong> (can repeat)'
    );
    expect(sumStep?.message).toContain(
      'A starting domino is placed in the center of the board'
    );

    injectContigStyles();
    injectSDStyles();
    const contigCss = document.getElementById('contig-styles')?.textContent ?? '';
    const sumCss = document.getElementById('sd-styles')?.textContent ?? '';
    expect(contigCss).toContain('#fff3e0');
    expect(sumCss).toContain('#2d5a27');

    const style = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(style).toMatch(/\.contig-score-p2/);
    expect(style).toMatch(/\.sd-main-layout/);
  });
});
