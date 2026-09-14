/**
 * Overnight HEAVY leftover after #234 — Calla valid-pit highlight on opening. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { renderBoard } from '../../src/games/calla/board-ui';

describe('Wave 52 calla — pit-valid opening', () => {
  it('marks current seat pits valid; opponent pits not', () => {
    const el = document.createElement('div');
    renderBoard(createInitialState(), el);
    const p1Valid = el.querySelectorAll('.calla-pit-p1.calla-pit-valid');
    const p2Valid = el.querySelectorAll('.calla-pit-p2.calla-pit-valid');
    expect(p1Valid.length).toBe(5);
    expect(p2Valid.length).toBe(0);
  });
});
