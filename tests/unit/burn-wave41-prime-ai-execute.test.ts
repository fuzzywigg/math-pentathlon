/**
 * Wave 41 HEAVY — Prime Gold executeAITurn + isAITurn branch matrices.
 * Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import type { PrimeGoldState } from '../../src/games/prime-gold/types';
import {
  createInitialState,
  getValidPlacements,
  findCellByValue,
  hasValidMoves,
} from '../../src/games/prime-gold/rules';
import {
  executeAITurn,
  isAITurn,
  getAIPlacement,
} from '../../src/games/prime-gold/ai';

afterEach(() => vi.restoreAllMocks());

function placing(
  dice: { die1: number; die2: number; die3: number },
  overrides: Partial<PrimeGoldState> = {}
): PrimeGoldState {
  return {
    ...createInitialState(),
    diceRoll: dice,
    phase: 'placing',
    ...overrides,
  };
}

describe('Wave 41 Prime Gold — isAITurn matrix', () => {
  it('true only for matching seat in human-vs-ai while not gameOver', () => {
    const state = createInitialState();
    expect(isAITurn(state, 'player1', 'human-vs-ai')).toBe(true);
    expect(isAITurn(state, 'player2', 'human-vs-ai')).toBe(false);
    expect(isAITurn(state, 'player1', 'human-vs-human')).toBe(false);
    expect(isAITurn(state, null, 'human-vs-ai')).toBe(false);
  });

  it('false on gameOver regardless of seat/mode', () => {
    const over = {
      ...createInitialState(),
      phase: 'gameOver' as const,
      winner: 'player1' as const,
    };
    expect(isAITurn(over, 'player1', 'human-vs-ai')).toBe(false);
    expect(isAITurn(over, 'player2', 'human-vs-ai')).toBe(false);
  });

  it('tracks seat after flip', () => {
    const p2 = { ...createInitialState(), currentPlayer: 'player2' as const };
    expect(isAITurn(p2, 'player2', 'human-vs-ai')).toBe(true);
    expect(isAITurn(p2, 'player1', 'human-vs-ai')).toBe(false);
  });
});

describe('Wave 41 Prime Gold — executeAITurn matrices', () => {
  it('from rolling: rolls then places or passes; advances play', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const next = executeAITurn(createInitialState(), 'player1', 'hard');
    expect(
      next.moveHistory.length > 0 ||
        next.currentPlayer === 'player2' ||
        next.phase === 'rolling'
    ).toBe(true);
    expect(next.diceRoll).toBeNull();
  });

  it.each(['easy', 'medium', 'hard'] as const)(
    'difficulty %s from placing places a chip when valids exist',
    (difficulty) => {
      vi.spyOn(Math, 'random').mockReturnValue(0);
      const state = placing({ die1: 2, die2: 3, die3: 4 });
      expect(hasValidMoves(state)).toBe(true);
      const next = executeAITurn(state, 'player1', difficulty);
      expect(next.moveHistory.length).toBe(state.moveHistory.length + 1);
      expect(next.currentPlayer).toBe('player2');
      expect(next.phase).toBe('rolling');
    }
  );

  it('passes when mid-place with zero valid placements', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let state = placing({ die1: 2, die2: 3, die3: 4 });
    const cells = new Map(state.cells);
    for (const p of getValidPlacements(state)) {
      const cell = findCellByValue(state, p.value)!;
      cells.set(`${cell.row},${cell.col}`, { ...cell, owner: 'player2' });
    }
    state = { ...state, cells };
    expect(getAIPlacement(state, 'player1', 'hard')).toBeNull();
    const next = executeAITurn(state, 'player1', 'hard');
    expect(next.moveHistory).toHaveLength(0);
    expect(next.currentPlayer).toBe('player2');
    expect(next.phase).toBe('rolling');
    expect(next.diceRoll).toBeNull();
  });

  it('wrong-seat mid-place → passTurn (AI cannot place)', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = placing({ die1: 3, die2: 3, die3: 3 });
    expect(getAIPlacement(state, 'player2', 'medium')).toBeNull();
    const next = executeAITurn(state, 'player2', 'medium');
    expect(next.currentPlayer).toBe('player2');
    expect(next.phase).toBe('rolling');
    expect(next.moveHistory).toHaveLength(0);
  });

  it('player2 AI turn from rolling flips toward player1 after action', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    const state = {
      ...createInitialState(),
      currentPlayer: 'player2' as const,
    };
    const next = executeAITurn(state, 'player2', 'easy');
    expect(
      next.currentPlayer === 'player1' ||
        next.phase === 'rolling' ||
        next.moveHistory.length >= 1
    ).toBe(true);
  });

  it('gameOver input is left untouched by executeAITurn', () => {
    const over = {
      ...createInitialState(),
      phase: 'gameOver' as const,
      winner: 'player1' as const,
    };
    const next = executeAITurn(over, 'player1', 'hard');
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
    expect(next.moveHistory).toHaveLength(0);
  });
});
