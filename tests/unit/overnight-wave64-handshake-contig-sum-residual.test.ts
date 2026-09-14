/**
 * Wave 64 leftover after tip/#303 — Contig × Sum residual handshake.
 * Mount unsaturated tutorial exacts + inject/style pins (no other games). Tests-only.
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

describe('Wave 64 handshake — contig × sum residual', () => {
  it('mounts residual tutorial + inject + style leftovers for both', () => {
    const contigStep = contig60Tutorial.steps.find((s) => s.id === 'winning');
    const sumStep = sumDominoesTutorial.steps.find((s) => s.id === 'complete');
    expect(contigStep?.message).toContain('5 chips in a line');
    expect(sumStep?.message).toContain(
      'Now you know how to play Sum Dominoes & Dice!'
    );

    injectContigStyles();
    injectSDStyles();
    const contigCss = document.getElementById('contig-styles')?.textContent ?? '';
    const sumCss = document.getElementById('sd-styles')?.textContent ?? '';
    expect(contigCss).toContain('rgba(0,0,0,0.1)');
    expect(sumCss).toContain('rgba(255,255,255,0.1)');

    const style = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(style).toMatch(/\.contig-status\.player1/);
    expect(style).toMatch(/\.sd-roll-btn:hover:not\(:disabled\)/);
  });
});
