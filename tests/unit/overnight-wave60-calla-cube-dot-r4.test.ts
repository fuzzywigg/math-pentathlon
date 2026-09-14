/**
 * Wave 60 leftover after tip/#279 — Calla cube-dot radius 4.
 * Distinct from wave50 cube count chrome. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { renderBoard } from '../../src/games/calla/board-ui';

describe('Wave 60 calla — cube dot r4', () => {
  it('renders opening .calla-cube dots with r=4', () => {
    const el = document.createElement('div');
    renderBoard(createInitialState(), el);
    const cube = el.querySelector('.calla-cube');
    expect(cube).toBeTruthy();
    expect(cube?.getAttribute('r')).toBe('4');
  });
});
