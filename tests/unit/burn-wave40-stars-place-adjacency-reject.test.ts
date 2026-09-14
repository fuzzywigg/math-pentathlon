/**
 * Wave 40 — Stars & Bars select/place adjacency reject leftovers.
 * After #177; tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  selectCard,
  clearSelection,
  placeCard,
  getValidPlacements,
  passTurn,
} from '../../src/games/stars-bars/rules';

describe('Wave 40 stars — place adjacency rejects', () => {
  it('selectCard rejects ghost id and gameOver', () => {
    const state = createInitialState();
    expect(selectCard(state, '__ghost__')).toBe(state);
    const over = { ...state, phase: 'gameOver' as const };
    const card = state.playerHands.player1[0];
    expect(selectCard(over, card.id)).toBe(over);
  });

  it('placeCard rejects wrong phase / no selection / occupied', () => {
    const state = createInitialState();
    expect(placeCard(state, 0, 0)).toBe(state);

    const card = state.playerHands.player1[0];
    const selected = selectCard(state, card.id);
    expect(selected.phase).toBe('placingCard');
    // First card: all cells valid
    const placed = placeCard(selected, 0, 0);
    expect(placed).not.toBe(selected);
    expect(placed.cells[0][0].card).toBeTruthy();

    // Second placement must be adjacent — pick far corner if board large enough
    const card2 = placed.playerHands[placed.currentPlayer][0];
    const sel2 = selectCard(placed, card2.id);
    const valids = getValidPlacements(sel2);
    expect(valids.length).toBeGreaterThan(0);
    // Find an invalid empty cell if any
    let rejected = false;
    for (let r = 0; r < placed.cells.length && !rejected; r++) {
      for (let c = 0; c < placed.cells[r].length; c++) {
        if (placed.cells[r][c].card) continue;
        if (!valids.some((v) => v.row === r && v.col === c)) {
          expect(placeCard(sel2, r, c)).toBe(sel2);
          rejected = true;
          break;
        }
      }
    }
    // Occupied cell
    expect(placeCard(sel2, 0, 0)).toBe(sel2);
  });

  it('clearSelection + passTurn at gameOver identity', () => {
    const state = createInitialState();
    const card = state.playerHands.player1[0];
    const selected = selectCard(state, card.id);
    const cleared = clearSelection(selected);
    expect(cleared.selectedCard).toBeNull();
    expect(cleared.phase).toBe('selectingCard');

    const over = { ...state, phase: 'gameOver' as const };
    expect(passTurn(over)).toBe(over);
  });
});
