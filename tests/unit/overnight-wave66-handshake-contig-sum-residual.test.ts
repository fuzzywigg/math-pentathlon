/**
 * Wave 66 leftover after tip/#316 — Contig × Sum residual handshake.
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

describe('Wave 66 handshake — contig × sum residual', () => {
  it('mounts residual tutorial + inject + style leftovers for both', () => {
    const contigStep = contig60Tutorial.steps.find((s) => s.id === 'welcome');
    const sumStep = sumDominoesTutorial.steps.find((s) => s.id === 'matching-rules');
    expect(contigStep?.message).toContain('<strong>Contig 60</strong>');
    expect(sumStep?.message).toContain(
      'Example: You rolled 8. Place [3|5] next to a [5|2] so 3+5=8'
    );

    injectContigStyles();
    injectSDStyles();
    const contigCss = document.getElementById('contig-styles')?.textContent ?? '';
    const sumCss = document.getElementById('sd-styles')?.textContent ?? '';
    expect(contigCss).toContain('rgba(0,0,0,0.15)');
    expect(sumCss).toContain('rgba(0,0,0,0.3)');

    const style = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(style).toMatch(/\.contig-game-area/);
    expect(style).toMatch(/\.sd-hands-container/);
  });
});
