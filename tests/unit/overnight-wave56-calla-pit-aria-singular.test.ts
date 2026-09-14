/**
 * Wave 56 leftover after #256 — Calla singular pit aria (1 cube).
 * Distinct from wave50 opening /3 cubes/. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { renderBoard } from '../../src/games/calla/board-ui';

describe('Wave 56 calla — singular pit aria', () => {
  it('labels a one-cube pit as "1 cube" not "cubes"', () => {
    const s = createInitialState();
    s.player1Pits = [1, 0, 0, 0, 0];
    const el = document.createElement('div');
    renderBoard(s, el);
    const pit = el.querySelector(
      '.calla-pit-p1[data-pit-index="0"]'
    ) as SVGGElement | null;
    const label = pit?.getAttribute('aria-label') ?? '';
    expect(label).toMatch(/1 cube/);
    expect(label).not.toMatch(/1 cubes/);
  });
});
