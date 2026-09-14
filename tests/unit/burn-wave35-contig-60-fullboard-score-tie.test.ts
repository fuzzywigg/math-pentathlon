/**
 * Wave 35 — Contig 60 alignment-vs-score priority / empty valids / pass.
 * Full-board score-settle without 5-in-a-row is awkward on 6x10 with diagonal
 * WIN_BY_ALIGNMENT; covered indirectly via unequal-score loss when alignment hits.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/contig-60/types';
import {
  checkWinner,
  hasValidMoves,
  doRollDice,
  placeChip,
  passTurn,
  calculatePoints,
} from '../../src/games/contig-60/rules';
import { getAIPlacement, isAITurn } from '../../src/games/contig-60/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 35 Contig 60 — score/alignment/valids', () => {
  it('opening checkWinner is null', () => {
    expect(checkWinner(createInitialState())).toBeNull();
  });

  it('5-in-a-row beats scoreboard numbers', () => {
    const state = createInitialState();
    for (let col = 0; col < 5; col++) {
      const v = state.grid[0][col];
      if (v !== null) state.cells.get(v)!.owner = 'player1';
    }
    expect(
      checkWinner({
        ...state,
        scores: { player1: 0, player2: 99 },
      })
    ).toBe('player1');
  });

  it('partial board with equal scores stays null without alignment', () => {
    const state = createInitialState();
    // Mark only two isolated cells
    const values = [...state.cells.keys()].slice(0, 2);
    state.cells.get(values[0])!.owner = 'player1';
    state.cells.get(values[1])!.owner = 'player2';
    expect(
      checkWinner({ ...state, scores: { player1: 5, player2: 5 } })
    ).toBeNull();
  });

  it('calculatePoints is non-negative on opening for a board value', () => {
    const state = createInitialState();
    const value = [...state.cells.keys()][0];
    expect(calculatePoints(state, value)).toBeGreaterThanOrEqual(0);
  });

  it('calculating with all owned cells → hasValidMoves false + AI null', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.4);
    let state = doRollDice(createInitialState());
    for (const cell of state.cells.values()) {
      cell.owner = 'player2';
    }
    expect(hasValidMoves(state)).toBe(false);
    expect(getAIPlacement(state, 'player1', 'hard')).toBeNull();
  });

  it('placeChip identity for rolling phase', () => {
    const state = createInitialState();
    expect(placeChip(state, 1)).toBe(state);
  });

  it('passTurn from calculating flips seat; isAITurn hvh false', () => {
    const state = {
      ...createInitialState(),
      phase: 'calculating' as const,
      currentDice: [1, 2, 3] as [number, number, number],
    };
    const next = passTurn(state);
    expect(next.currentPlayer).toBe('player2');
    expect(next.phase).toBe('rolling');
    expect(isAITurn(createInitialState(), 'player1', 'human-vs-human')).toBe(false);
  });
});
