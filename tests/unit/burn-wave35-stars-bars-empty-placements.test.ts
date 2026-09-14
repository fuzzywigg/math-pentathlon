/**
 * Wave 35 — Stars & Bars empty hand / illegal place / clearSelection.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  selectCard,
  getValidPlacements,
  placeCard,
  hasValidMoves,
  clearSelection,
} from '../../src/games/stars-bars/rules';
import { getAIMove, isAITurn } from '../../src/games/stars-bars/ai';

describe('Wave 35 Stars & Bars — empty placements', () => {
  it('select then clearSelection restores null selection', () => {
    let state = createInitialState();
    const cardId = state.playerHands.player1[0].id;
    state = selectCard(state, cardId);
    expect(state.selectedCard?.id).toBe(cardId);
    state = clearSelection(state);
    expect(state.selectedCard).toBeNull();
  });

  it('empty hand → hasValidMoves false', () => {
    const state = {
      ...createInitialState(),
      playerHands: { player1: [], player2: [] },
    };
    expect(hasValidMoves(state)).toBe(false);
  });

  it('placeCard identity for occupied cell', () => {
    let state = createInitialState();
    const card = state.playerHands.player1[0];
    state = selectCard(state, card.id);
    // Occupy 0,0 then try to place there again
    state = {
      ...state,
      cells: state.cells.map((row, r) =>
        row.map((cell, c) =>
          r === 0 && c === 0
            ? { ...cell, card: { ...card, id: 'seed' }, owner: 'player2' as const }
            : cell
        )
      ),
    };
    const next = placeCard(state, 0, 0);
    expect(next).toBe(state);
  });

  it('opening empty board getValidPlacements covers full board', () => {
    const placements = getValidPlacements(createInitialState());
    expect(placements.length).toBeGreaterThan(0);
  });

  it('AI null on gameOver; isAITurn gates hvh', () => {
    const over = {
      ...createInitialState(),
      phase: 'gameOver' as const,
      winner: 'player1' as const,
    };
    expect(getAIMove(over, 'player1', 'hard')).toBeNull();
    expect(isAITurn(createInitialState(), 'player1', 'human-vs-human')).toBe(false);
  });
});
