/**
 * Overnight HEAVY leftover after #234 — Calla store count labels. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { renderBoard } from '../../src/games/calla/board-ui';

describe('Wave 52 calla — store counts', () => {
  it('renders store counts for both callas', () => {
    const s = { ...createInitialState(), player1Calla: 7, player2Calla: 4 };
    const el = document.createElement('div');
    renderBoard(s, el);
    const p1 = el.querySelector('.calla-store-p1 .calla-store-count');
    const p2 = el.querySelector('.calla-store-p2 .calla-store-count');
    expect(p1?.textContent).toBe('7');
    expect(p2?.textContent).toBe('4');
  });
});
