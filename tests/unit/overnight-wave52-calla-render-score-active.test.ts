/**
 * Overnight HEAVY leftover after #234 — Calla status score active chip. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { renderStatus } from '../../src/games/calla/board-ui';

describe('Wave 52 calla — score active chip', () => {
  it('marks current seat score chip active', () => {
    const el = document.createElement('div');
    renderStatus(createInitialState(), el, 'human-vs-human');
    expect(el.querySelector('.calla-score-p1.active')).toBeTruthy();
    expect(el.querySelector('.calla-score-p2.active')).toBeFalsy();
  });
});
