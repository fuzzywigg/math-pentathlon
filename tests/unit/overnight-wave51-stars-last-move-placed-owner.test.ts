/**
 * Overnight HEAVY leftovers after #234 — Stars last-move + owner after place. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  selectCard,
  placeCard,
  getValidPlacements,
} from '../../src/games/stars-bars/rules';
import { renderBoard } from '../../src/games/stars-bars/board-ui';

describe('Wave 51 stars — last-move owner', () => {
  it('marks last-move and owner class on placed cell', () => {
    let state = createInitialState();
    const card = state.playerHands.player1[0]!;
    state = selectCard(state, card.id);
    const { row, col } = getValidPlacements(state)[0]!;
    state = placeCard(state, row, col);
    const el = renderBoard(state, () => undefined);
    const cell = el.querySelector(
      `.stars-cell[data-row="${row}"][data-col="${col}"]`
    )!;
    expect(cell.classList.contains('last-move')).toBe(true);
    expect(cell.classList.contains('player1')).toBe(true);
    expect(cell.querySelector('svg')).toBeTruthy();
  });
});
