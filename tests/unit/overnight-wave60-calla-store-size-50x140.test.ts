/**
 * Wave 60 leftover after tip/#279 — Calla store rect 50×140.
 * Distinct from wave58 store rx. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { renderBoard } from '../../src/games/calla/board-ui';

describe('Wave 60 calla — store size 50x140', () => {
  it('renders .calla-store-rect width 50 height 140', () => {
    const el = document.createElement('div');
    renderBoard(createInitialState(), el);
    const rect = el.querySelector('.calla-store-rect');
    expect(rect?.getAttribute('width')).toBe('50');
    expect(rect?.getAttribute('height')).toBe('140');
  });
});
