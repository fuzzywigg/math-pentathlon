/**
 * Wave 41 — Stars & Bars adjacency / pass / empty-hand leftovers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { CONFIG, type StarsState } from '../../src/games/stars-bars/types';
import {
  createInitialState,
  selectCard,
  placeCard,
  getValidPlacements,
  passTurn,
  hasValidMoves,
} from '../../src/games/stars-bars/rules';

afterEach(() => vi.restoreAllMocks());

describe('Wave 41 Stars — adjacency / pass', () => {
  it('empty board valid placements cover full BOARD_SIZE²', () => {
    const placements = getValidPlacements(createInitialState());
    expect(placements).toHaveLength(CONFIG.BOARD_SIZE * CONFIG.BOARD_SIZE);
  });

  it('after center place, only 8-neighborhood remains valid', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let state = createInitialState();
    state = selectCard(state, state.playerHands.player1[0].id);
    state = placeCard(state, 2, 2);
    const valid = getValidPlacements(state);
    expect(valid.every((p) => Math.abs(p.row - 2) <= 1 && Math.abs(p.col - 2) <= 1)).toBe(
      true
    );
    expect(valid.some((p) => p.row === 2 && p.col === 2)).toBe(false);
    expect(valid).toHaveLength(8);
  });

  it('passTurn flips seat, clears selection; gameOver identity', () => {
    let state = createInitialState();
    state = selectCard(state, state.playerHands.player1[0].id);
    expect(state.selectedCard).not.toBeNull();
    const next = passTurn(state);
    expect(next.currentPlayer).toBe('player2');
    expect(next.selectedCard).toBeNull();
    expect(next.phase).toBe('selectingCard');
    const over = {
      ...state,
      phase: 'gameOver' as const,
      winner: 'player1' as const,
    };
    expect(passTurn(over)).toBe(over);
  });

  it('empty hand → hasValidMoves false; opening hand true', () => {
    expect(hasValidMoves(createInitialState())).toBe(true);
    const empty: StarsState = {
      ...createInitialState(),
      playerHands: { player1: [], player2: [] },
    };
    expect(hasValidMoves(empty)).toBe(false);
  });

  it('both hands empty after place → gameOver by score compare', () => {
    const base = createInitialState();
    const p1Card = base.playerHands.player1[0];
    let state: StarsState = {
      ...base,
      playerHands: { player1: [p1Card], player2: [] },
      playerScores: { player1: 5, player2: 2 },
      deck: [],
      phase: 'selectingCard',
    };
    state = selectCard(state, p1Card.id);
    const next = placeCard(state, 1, 1);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
  });

  it('both hands empty with equal scores → winner null tie', () => {
    const base = createInitialState();
    const p1Card = base.playerHands.player1[0];
    let state: StarsState = {
      ...base,
      playerHands: { player1: [p1Card], player2: [] },
      playerScores: { player1: 4, player2: 4 },
      deck: [],
      phase: 'selectingCard',
    };
    state = selectCard(state, p1Card.id);
    const next = placeCard(state, 3, 3);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBeNull();
  });

  it('chain of adjacent placements shrinks free cells', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.2);
    let state = createInitialState();
    for (let i = 0; i < 3; i++) {
      const hand = state.playerHands[state.currentPlayer];
      expect(hand.length).toBeGreaterThan(0);
      state = selectCard(state, hand[0].id);
      const spot = getValidPlacements(state)[0];
      state = placeCard(state, spot.row, spot.col);
      expect(state.phase === 'selectingCard' || state.phase === 'gameOver').toBe(
        true
      );
    }
    expect(state.moveHistory.length).toBe(3);
  });
});
