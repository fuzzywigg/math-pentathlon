import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  ContigState,
  createInitialState,
  getValidPlacements,
} from '../../src/games/contig-60/types';
import {
  getAIPlacement,
  executeAITurn,
  isAITurn,
} from '../../src/games/contig-60/ai';

afterEach(() => {
  vi.restoreAllMocks();
});

function withOwned(
  values: number[],
  owner: 'player1' | 'player2',
  base = createInitialState()
): ContigState {
  const cells = new Map(base.cells);
  for (const value of values) {
    const cell = cells.get(value);
    if (!cell) throw new Error(`missing ${value}`);
    cells.set(value, { ...cell, owner });
  }
  return { ...base, cells };
}

describe('Contig 60 AI', () => {
  it('isAITurn only true in human-vs-ai for the AI seat', () => {
    const state = createInitialState();
    expect(isAITurn(state, 'player2', 'human-vs-human')).toBe(false);
    expect(isAITurn(state, null, 'human-vs-ai')).toBe(false);
    expect(isAITurn(state, 'player2', 'human-vs-ai')).toBe(false); // P1 to move
    expect(
      isAITurn(
        { ...state, currentPlayer: 'player2' },
        'player2',
        'human-vs-ai'
      )
    ).toBe(true);
    expect(
      isAITurn({ ...state, phase: 'gameOver' }, 'player2', 'human-vs-ai')
    ).toBe(false);
  });

  it('getAIPlacement returns null outside calculating / wrong seat / no dice', () => {
    const state = createInitialState();
    expect(getAIPlacement(state, 'player1', 'hard')).toBeNull();

    const calculating: ContigState = {
      ...state,
      phase: 'calculating',
      currentDice: [2, 3, 4],
      currentPlayer: 'player2',
    };
    expect(getAIPlacement(calculating, 'player1', 'hard')).toBeNull();

    expect(
      getAIPlacement(
        { ...calculating, currentPlayer: 'player1', currentDice: null },
        'player1',
        'hard'
      )
    ).toBeNull();
  });

  it('getAIPlacement returns a valid board placement for hard', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99); // avoid randomness branch
    const state: ContigState = {
      ...createInitialState(),
      phase: 'calculating',
      currentDice: [2, 3, 4],
      currentPlayer: 'player1',
    };

    const move = getAIPlacement(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    const allowed = getValidPlacements(state, [2, 3, 4]).map((p) => p.result);
    expect(allowed).toContain(move!.value);
    expect(typeof move!.expression).toBe('string');
  });

  it('prefers immediate five-in-a-row win when available', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    // Four in a row on top row; 5 completes it. Dice that can make 5: [1,2,2]
    let state = withOwned([1, 2, 3, 4], 'player1');
    state = {
      ...state,
      phase: 'calculating',
      currentDice: [1, 2, 2],
      currentPlayer: 'player1',
    };

    const move = getAIPlacement(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    expect(move!.value).toBe(5);
  });

  it('executeAITurn rolls and places (or passes) for AI player', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0); // dice all 1
    const state = {
      ...createInitialState(),
      currentPlayer: 'player2' as const,
      phase: 'rolling' as const,
    };

    const next = executeAITurn(state, 'player2', 'hard');
    // After AI turn: either placed (back to rolling for P1) or passed / game over
    expect(['rolling', 'gameOver']).toContain(next.phase);
    expect(next.currentPlayer).toBe('player1');
  });

  it('executeAITurn passes when no legal placements', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0); // [1,1,1]
    // Claim every result reachable by [1,1,1]
    const rolling = createInitialState();
    // Pre-compute with a temporary calculating state
    const probe: ContigState = {
      ...rolling,
      phase: 'calculating',
      currentDice: [1, 1, 1],
    };
    const results = getValidPlacements(probe, [1, 1, 1]).map((p) => p.result);
    let state = withOwned(results, 'player1', rolling);
    state = { ...state, currentPlayer: 'player2', phase: 'rolling' };

    const next = executeAITurn(state, 'player2', 'medium');
    expect(next.consecutivePasses.player2).toBe(1);
    expect(next.currentPlayer).toBe('player1');
    expect(next.phase).toBe('rolling');
  });
});
