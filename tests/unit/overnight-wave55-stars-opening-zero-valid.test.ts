/**
 * Wave 55 leftover after #250 — Stars selectingCard phase has zero .valid cells. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/stars-bars/rules';
import { renderBoard } from '../../src/games/stars-bars/board-ui';

describe('Wave 55 stars — opening valids', () => {
  it('no valid cells before a card is selected', () => {
    const el = renderBoard(createInitialState(), () => undefined);
    expect(el.querySelectorAll('.stars-cell.valid')).toHaveLength(0);
  });
});
