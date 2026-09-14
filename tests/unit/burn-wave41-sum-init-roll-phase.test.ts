/**
 * Wave 41 — Sum Dominoes createInitialState invariants + doRollDice phase leftovers. Tests-only. No product inventing.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { CONFIG } from '../../src/games/sum-dominoes/types';
import {
  createInitialState,
  doRollDice,
  canPlayDomino,
} from '../../src/games/sum-dominoes/rules';
import { getDiceSum } from '../../src/games/sum-dominoes/types';

afterEach(() => vi.restoreAllMocks());

describe('Wave 41 Sum Dominoes — createInitialState invariants', () => {
  it('hands are disjoint owners of STARTING_HAND_SIZE each', () => {
    const state = createInitialState();
    expect(state.hands.player1).toHaveLength(CONFIG.STARTING_HAND_SIZE);
    expect(state.hands.player2).toHaveLength(CONFIG.STARTING_HAND_SIZE);
    expect(state.hands.player1.every((d) => d.owner === 'player1')).toBe(true);
    expect(state.hands.player2.every((d) => d.owner === 'player2')).toBe(true);
    const ids = new Set([
      ...state.hands.player1.map((d) => d.id),
      ...state.hands.player2.map((d) => d.id),
    ]);
    expect(ids.size).toBe(CONFIG.STARTING_HAND_SIZE * 2);
  });

  it('board is BOARD_SIZE² with a center seed and empty corners', () => {
    const state = createInitialState();
    expect(state.board).toHaveLength(CONFIG.BOARD_SIZE);
    expect(state.board[0]).toHaveLength(CONFIG.BOARD_SIZE);
    const seed = state.board[CONFIG.CENTER_ROW][CONFIG.CENTER_COL];
    expect(seed).not.toBeNull();
    expect(seed!.orientation).toBe('horizontal');
    expect(seed!.position).toEqual({
      row: CONFIG.CENTER_ROW,
      col: CONFIG.CENTER_COL,
    });
    // createInitialState only stamps the origin cell (not the second face cell)
    expect(state.board[0][0]).toBeNull();
    expect(state.board[CONFIG.BOARD_SIZE - 1][CONFIG.BOARD_SIZE - 1]).toBeNull();
  });

  it('phase/seat/dice/pass defaults', () => {
    const state = createInitialState();
    expect(state.phase).toBe('rolling');
    expect(state.currentPlayer).toBe('player1');
    expect(state.currentDice).toBeNull();
    expect(state.selectedDomino).toBeNull();
    expect(state.winner).toBeNull();
    expect(state.passCount).toBe(0);
    expect(state.moveHistory).toEqual([]);
  });
});

describe('Wave 41 Sum Dominoes — doRollDice phase leftovers', () => {
  it('identity reject outside rolling', () => {
    const base = createInitialState();
    for (const phase of ['placing', 'passing', 'gameOver'] as const) {
      const state = { ...base, phase, currentDice: [3, 3] as [number, number] };
      expect(doRollDice(state)).toBe(state);
    }
  });

  it('rolling → placing or passing consistent with canPlayDomino', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const state = createInitialState();
    const next = doRollDice(state);
    expect(next.currentDice).not.toBeNull();
    const sum = getDiceSum(next.currentDice!);
    const playable = next.hands.player1.some((d) =>
      canPlayDomino(next, d, sum)
    );
    expect(next.phase).toBe(playable ? 'placing' : 'passing');
  });

  it('forced [1,1] roll lands in placing or passing based on hand complements', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0); // dice [1,1] sum 2
    const next = doRollDice(createInitialState());
    expect(next.currentDice).toEqual([1, 1]);
    expect(['placing', 'passing']).toContain(next.phase);
  });
});
