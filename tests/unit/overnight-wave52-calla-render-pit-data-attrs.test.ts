/**
 * Overnight HEAVY leftover after #234 — Calla pit data-side / data-pit-index. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, PITS_PER_SIDE } from '../../src/games/calla/types';
import { renderBoard } from '../../src/games/calla/board-ui';

describe('Wave 52 calla — pit data attrs', () => {
  it('tags every pit with side and index attrs', () => {
    const el = document.createElement('div');
    renderBoard(createInitialState(), el);
    const pits = el.querySelectorAll('.calla-pit');
    expect(pits.length).toBe(PITS_PER_SIDE * 2);
    for (const pit of pits) {
      expect(['player1', 'player2']).toContain(pit.getAttribute('data-side'));
      const idx = Number(pit.getAttribute('data-pit-index'));
      expect(idx).toBeGreaterThanOrEqual(0);
      expect(idx).toBeLessThan(PITS_PER_SIDE);
    }
  });
});
