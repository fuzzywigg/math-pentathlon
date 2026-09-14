/**
 * Wave 60 leftover after tip/#279 — Calla pit circle radius 32.
 * Distinct from wave58 rx chrome. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { renderBoard } from '../../src/games/calla/board-ui';

describe('Wave 60 calla — pit radius 32', () => {
  it('renders .calla-pit-circle with r=32', () => {
    const el = document.createElement('div');
    renderBoard(createInitialState(), el);
    expect(el.querySelector('.calla-pit-circle')?.getAttribute('r')).toBe('32');
  });
});
