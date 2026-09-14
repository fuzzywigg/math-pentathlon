/**
 * Wave 60 leftover after #282 — Contig × Sum inject/tutorial handshake. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';
import { contig60Tutorial } from '../../src/games/contig-60/tutorial';
import { sumDominoesTutorial } from '../../src/games/sum-dominoes/tutorial';
import { getGameById } from '../../src/core/game-registry';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 60 handshake — contig × sum inject/tutorial', () => {
  it('mounts residual inject + tutorial + registry leftovers', () => {
    injectContigStyles();
    injectSDStyles();
    const contigCss = document.getElementById('contig-styles')?.textContent ?? '';
    const sumCss = document.getElementById('sd-styles')?.textContent ?? '';
    expect(contigCss).toMatch(/gap:\s*2px/);
    expect(sumCss).toMatch(/#81c784/);

    const contigById = Object.fromEntries(contig60Tutorial.steps.map((s) => [s.id, s]));
    const sumById = Object.fromEntries(sumDominoesTutorial.steps.map((s) => [s.id, s]));
    expect(contigById.winning?.message).toMatch(/By points/);
    expect(sumById.passing?.message).toMatch(/both players pass consecutively/);

    expect(getGameById('contig-60')?.icon).toBe('🎲');
    expect(getGameById('sum-dominoes')?.icon).toBe('🁣');
  });
});
