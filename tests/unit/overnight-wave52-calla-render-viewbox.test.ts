/**
 * Overnight HEAVY leftover after #234 — Calla board viewBox dimensions. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { renderBoard } from '../../src/games/calla/board-ui';

describe('Wave 52 calla — viewBox', () => {
  it('uses 500×200 viewBox on calla-board svg', () => {
    const el = document.createElement('div');
    renderBoard(createInitialState(), el);
    const svg = el.querySelector('svg.calla-board');
    expect(svg?.getAttribute('viewBox')).toBe('0 0 500 200');
    expect(el.querySelector('.calla-board-bg')).toBeTruthy();
  });
});
