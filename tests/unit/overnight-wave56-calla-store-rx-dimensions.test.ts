/**
 * Wave 56 leftover after #256 — Calla store rect rx + width/height.
 * Distinct from wave50/52 store-active leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { renderBoard } from '../../src/games/calla/board-ui';

describe('Wave 56 calla — store rx dimensions', () => {
  it('renders both stores at 50×140 with rx=10', () => {
    const el = document.createElement('div');
    renderBoard(createInitialState(), el);
    const stores = el.querySelectorAll('.calla-store-rect');
    expect(stores.length).toBe(2);
    stores.forEach((rect) => {
      expect(rect.getAttribute('rx')).toBe('10');
      expect(rect.getAttribute('width')).toBe('50');
      expect(rect.getAttribute('height')).toBe('140');
    });
  });
});
