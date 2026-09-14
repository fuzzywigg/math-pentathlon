/**
 * Overnight HEAVY leftover after #234 — Calla last-sown pit class chrome. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { renderBoard } from '../../src/games/calla/board-ui';

describe('Wave 52 calla — pit-last class', () => {
  it('marks the lastSownPit side/index with calla-pit-last', () => {
    const s = {
      ...createInitialState(),
      lastSownPit: { side: 'player1' as const, index: 2 },
    };
    const el = document.createElement('div');
    renderBoard(s, el);
    const last = el.querySelector('.calla-pit-last') as SVGElement | null;
    expect(last).toBeTruthy();
    expect(last?.getAttribute('data-side')).toBe('player1');
    expect(last?.getAttribute('data-pit-index')).toBe('2');
  });
});
