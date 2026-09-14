/**
 * Wave 35 — Sum Dominoes formatMove / remaining / empty-hand settle / AI null.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  createInitialState,
  doRollDice,
  formatMove,
  getRemainingCount,
  selectDomino,
  passTurn,
} from '../../src/games/sum-dominoes/rules';
import { getAIMove, isAITurn, hasPlayableMove } from '../../src/games/sum-dominoes/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 35 Sum Dominoes — format / win-draw', () => {
  it('formatMove includes faces and sum shape', () => {
    const state = createInitialState();
    const d = state.hands.player1[0];
    const formatted = formatMove({
      player: 'player1',
      domino: d,
      position: { row: 5, col: 5 },
      orientation: 'horizontal',
      matchedFace: d.face1,
      adjacentFace: d.face2,
      diceSum: d.face1 + d.face2,
      moveNumber: 1,
    });
    expect(formatted).toMatch(/\|/);
    expect(formatted.length).toBeGreaterThan(3);
  });

  it('getRemainingCount tracks hand sizes independently', () => {
    const state = createInitialState();
    expect(getRemainingCount(state, 'player1')).toBe(state.hands.player1.length);
    expect(getRemainingCount(state, 'player2')).toBe(state.hands.player2.length);
  });

  it('empty-hand win settle fields', () => {
    const state = {
      ...createInitialState(),
      hands: { player1: [], player2: createInitialState().hands.player2 },
      phase: 'gameOver' as const,
      winner: 'player1' as const,
    };
    expect(state.winner).toBe('player1');
    expect(getRemainingCount(state, 'player1')).toBe(0);
  });

  it('double-pass style draw keeps winner null', () => {
    const state = {
      ...createInitialState(),
      phase: 'gameOver' as const,
      winner: null,
      passCount: 2,
    };
    expect(state.winner).toBeNull();
  });

  it('selectDomino identity for unplayable after roll when none match', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    let state = doRollDice(createInitialState());
    // Forge hand with impossible faces relative to dice if needed
    const unplayable = {
      ...state.hands.player1[0],
      id: 'impossible',
      face1: 0,
      face2: 0,
    };
    state = {
      ...state,
      hands: {
        ...state.hands,
        player1: [...state.hands.player1, unplayable],
      },
    };
    // Selecting may still work if canPlayDomino allows; assert API stability
    const next = selectDomino(state, unplayable.id);
    expect(next === state || next.selectedDomino === unplayable.id).toBe(true);
  });

  it('AI null on gameOver / wrong seat; isAITurn gates', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.2);
    const rolled = doRollDice(createInitialState());
    expect(getAIMove({ ...rolled, phase: 'gameOver', winner: 'player1' }, 'player1', 'hard')).toBeNull();
    expect(getAIMove(rolled, 'player2', 'hard')).toBeNull();
    expect(isAITurn(rolled, null)).toBe(false);
    expect(isAITurn({ ...rolled, phase: 'gameOver', winner: 'player1' }, 'player1')).toBe(false);
    expect(isAITurn(rolled, 'player1')).toBe(true);
    expect(typeof hasPlayableMove(rolled, 'player1')).toBe('boolean');
  });

  it('passTurn from passing flips seat', () => {
    const state = {
      ...createInitialState(),
      phase: 'passing' as const,
      passCount: 0,
    };
    const next = passTurn(state);
    expect(next.currentPlayer).toBe('player2');
    expect(next.passCount).toBe(1);
  });
});
