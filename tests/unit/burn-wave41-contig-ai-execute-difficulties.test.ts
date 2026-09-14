/**
 * Wave 41 — Contig 60 AI placement + executeAITurn difficulty leftovers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  createInitialState,
  getValidPlacements,
} from '../../src/games/contig-60/types';
import type { ContigState, Player } from '../../src/games/contig-60/types';
import {
  getAIPlacement,
  executeAITurn,
  isAITurn,
} from '../../src/games/contig-60/ai';

afterEach(() => vi.restoreAllMocks());

function calculating(
  dice: [number, number, number],
  overrides: Partial<ContigState> = {}
): ContigState {
  return {
    ...createInitialState(),
    phase: 'calculating',
    currentDice: dice,
    currentPlayer: 'player1',
    ...overrides,
  };
}

function claim(
  state: ContigState,
  values: number[],
  owner: Player
): ContigState {
  const cells = new Map(state.cells);
  for (const value of values) {
    cells.set(value, { ...cells.get(value)!, owner });
  }
  return { ...state, cells };
}

describe('Wave 41 Contig AI — isAITurn / getAIPlacement gates', () => {
  it('isAITurn matrix across mode/seat/gameOver', () => {
    const s = createInitialState();
    expect(isAITurn(s, 'player1', 'human-vs-ai')).toBe(true);
    expect(isAITurn(s, 'player2', 'human-vs-ai')).toBe(false);
    expect(isAITurn(s, 'player1', 'human-vs-human')).toBe(false);
    expect(isAITurn(s, null, 'human-vs-ai')).toBe(false);
    expect(
      isAITurn({ ...s, phase: 'gameOver' }, 'player1', 'human-vs-ai')
    ).toBe(false);
  });

  it('getAIPlacement null when wrong phase, seat, or no dice', () => {
    expect(getAIPlacement(createInitialState(), 'player1', 'hard')).toBeNull();
    expect(
      getAIPlacement(calculating([2, 3, 4], { currentPlayer: 'player2' }), 'player1')
    ).toBeNull();
    expect(
      getAIPlacement(calculating([2, 3, 4], { currentDice: null }), 'player1')
    ).toBeNull();
  });

  it('getAIPlacement null when board claims all reachable results', () => {
    let state = calculating([1, 1, 1]);
    const all = getValidPlacements(state, [1, 1, 1]).map((p) => p.result);
    state = claim(state, all, 'player2');
    expect(getAIPlacement(state, 'player1', 'medium')).toBeNull();
  });
});

describe('Wave 41 Contig AI — difficulty / execute matrices', () => {
  it.each(['easy', 'medium', 'hard'] as const)(
    'difficulty %s returns a legal placement for [2,3,4]',
    (difficulty) => {
      vi.spyOn(Math, 'random').mockReturnValue(0.99);
      const state = calculating([2, 3, 4]);
      const allowed = getValidPlacements(state, [2, 3, 4]).map((p) => p.result);
      const move = getAIPlacement(state, 'player1', difficulty);
      expect(move).not.toBeNull();
      expect(allowed).toContain(move!.value);
      expect(move!.expression.length).toBeGreaterThan(0);
    }
  );

  it('randomness branch still picks from top options', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = calculating([2, 3, 4]);
    const move = getAIPlacement(state, 'player1', 'easy');
    expect(move).not.toBeNull();
    const allowed = getValidPlacements(state, [2, 3, 4]).map((p) => p.result);
    expect(allowed).toContain(move!.value);
  });

  it('executeAITurn from rolling places or passes and leaves calculating', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const next = executeAITurn(createInitialState(), 'player1', 'hard');
    expect(['rolling', 'gameOver']).toContain(next.phase);
    expect(next.currentDice).toBeNull();
    expect(
      next.moveHistory.length >= 1 || next.consecutivePasses.player1 >= 1
    ).toBe(true);
  });

  it('executeAITurn mid-calculating places when valids exist', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const state = calculating([2, 3, 4]);
    const next = executeAITurn(state, 'player1', 'medium');
    expect(next.moveHistory.length).toBe(1);
    expect(next.currentPlayer).toBe('player2');
    expect(next.phase).toBe('rolling');
  });

  it('executeAITurn mid-calculating passes when jammed', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let state = calculating([1, 1, 1]);
    const all = getValidPlacements(state, [1, 1, 1]).map((p) => p.result);
    state = claim(state, all, 'player2');
    const next = executeAITurn(state, 'player1', 'easy');
    expect(next.moveHistory).toHaveLength(0);
    expect(next.consecutivePasses.player1).toBe(1);
    expect(next.currentPlayer).toBe('player2');
  });

  it('hard prefers completing five-in-row when dice allow', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    let state = claim(calculating([1, 2, 2]), [1, 2, 3, 4], 'player1');
    const move = getAIPlacement(state, 'player1', 'hard');
    expect(move?.value).toBe(5);
  });
});
