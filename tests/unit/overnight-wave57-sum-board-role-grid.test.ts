/**
 * Wave 57 leftover after #267 — Sum board root role=grid.
 * Distinct from wave56 empty A1 aria leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/sum-dominoes/rules';
import { renderBoard } from '../../src/games/sum-dominoes/board-ui';

describe('Wave 57 sum — board role grid', () => {
  it('marks .sd-board with role=grid', () => {
    const el = renderBoard(createInitialState(), () => undefined);
    expect(el.className).toBe('sd-board');
    expect(el.getAttribute('role')).toBe('grid');
  });
});
