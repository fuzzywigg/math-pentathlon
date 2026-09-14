/**
 * Wave 58 leftover after #267 — Sum board role=grid (thin residual).
 * Distinct from wave57 heavy sum chrome. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/sum-dominoes/rules';
import { renderBoard } from '../../src/games/sum-dominoes/board-ui';

describe('Wave 58 sum — board role grid', () => {
  it('sd-board exposes role=grid', () => {
    const el = renderBoard(createInitialState(), () => undefined);
    expect(el.classList.contains('sd-board')).toBe(true);
    expect(el.getAttribute('role')).toBe('grid');
  });
});
