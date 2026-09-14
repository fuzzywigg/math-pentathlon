/**
 * Wave 58 leftover after #267 — Queens valid-move destination aria.
 * Distinct from wave56 opening queen leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/queens-guards/types';
import { selectPiece } from '../../src/games/queens-guards/rules';
import { renderBoard } from '../../src/games/queens-guards/board-ui';

describe('Wave 58 queens — valid move aria', () => {
  it('empty adjacent cell announces valid move after select', () => {
    const state = selectPiece(createInitialState(), { ring: 5, position: 7 });
    const svg = renderBoard(state, () => undefined);
    const label =
      svg.querySelector('[data-cell-key="5-6"]')?.getAttribute('aria-label') ?? '';
    expect(label).toBe('ring 5 pos 6, empty, valid move');
  });
});
