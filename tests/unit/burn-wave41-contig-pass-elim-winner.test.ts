/**
 * Wave 41 — Contig 60 pass elimination + checkWinner branch leftovers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  CONFIG,
  BOARD_NUMBERS,
} from '../../src/games/contig-60/types';
import type { ContigState, Player } from '../../src/games/contig-60/types';
import {
  passTurn,
  placeChip,
  checkWinner,
} from '../../src/games/contig-60/rules';

function withDice(
  dice: [number, number, number],
  overrides: Partial<ContigState> = {}
): ContigState {
  return {
    ...createInitialState(),
    phase: 'calculating',
    currentDice: dice,
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
    const cell = cells.get(value)!;
    cells.set(value, { ...cell, owner });
  }
  return { ...state, cells };
}

describe('Wave 41 Contig — pass / elim / winner', () => {
  it('passTurn outside calculating is identity', () => {
    const s = createInitialState();
    expect(passTurn(s)).toBe(s);
    expect(passTurn({ ...s, phase: 'gameOver' })).toEqual({
      ...s,
      phase: 'gameOver',
    });
  });

  it('single pass increments consecutivePasses and flips seat', () => {
    const state = withDice([1, 2, 3]);
    const next = passTurn(state);
    expect(next.consecutivePasses.player1).toBe(1);
    expect(next.consecutivePasses.player2).toBe(0);
    expect(next.currentPlayer).toBe('player2');
    expect(next.phase).toBe('rolling');
    expect(next.currentDice).toBeNull();
  });

  it.each([
    { passes: CONFIG.MAX_CONSECUTIVE_PASSES - 1, seat: 'player1' as const },
    { passes: CONFIG.MAX_CONSECUTIVE_PASSES - 1, seat: 'player2' as const },
  ])('MAX passes eliminate $seat → opponent wins', ({ passes, seat }) => {
    const state = withDice([3, 3, 3], {
      currentPlayer: seat,
      consecutivePasses: {
        player1: seat === 'player1' ? passes : 0,
        player2: seat === 'player2' ? passes : 0,
      },
    });
    const ended = passTurn(state);
    expect(ended.phase).toBe('gameOver');
    expect(ended.winner).toBe(seat === 'player1' ? 'player2' : 'player1');
    expect(ended.consecutivePasses[seat]).toBe(CONFIG.MAX_CONSECUTIVE_PASSES);
  });

  it('vertical five-in-row for player2', () => {
    const s = createInitialState();
    const cells = new Map(s.cells);
    for (let row = 0; row < CONFIG.WIN_BY_ALIGNMENT; row++) {
      const value = s.grid[row][0]!;
      cells.set(value, { ...cells.get(value)!, owner: 'player2' });
    }
    expect(checkWinner({ ...s, cells })).toBe('player2');
  });

  it('diagonal down-right five-in-row for player1', () => {
    const s = createInitialState();
    const cells = new Map(s.cells);
    for (let i = 0; i < CONFIG.WIN_BY_ALIGNMENT; i++) {
      const value = s.grid[i][i]!;
      cells.set(value, { ...cells.get(value)!, owner: 'player1' });
    }
    expect(checkWinner({ ...s, cells })).toBe('player1');
  });

  it('full board score compare: higher score wins; equal stays null', () => {
    const s = createInitialState();
    const cells = new Map(s.cells);
    // 4-wide column stripes offset by row — avoids 5-in-a-row so score branch runs
    for (let row = 0; row < BOARD_NUMBERS.length; row++) {
      for (let col = 0; col < BOARD_NUMBERS[row].length; col++) {
        const value = BOARD_NUMBERS[row][col];
        cells.set(value, {
          ...cells.get(value)!,
          owner:
            (Math.floor(col / 4) + row) % 2 === 0 ? 'player1' : 'player2',
        });
      }
    }
    expect(
      checkWinner({
        ...s,
        cells,
        scores: { player1: 10, player2: 3 },
      })
    ).toBe('player1');
    expect(
      checkWinner({
        ...s,
        cells,
        scores: { player1: 3, player2: 10 },
      })
    ).toBe('player2');
    expect(
      checkWinner({
        ...s,
        cells,
        scores: { player1: 5, player2: 5 },
      })
    ).toBeNull();
  });

  it('placeChip that completes five-in-row ends game', () => {
    let state = withDice([1, 2, 2]);
    state = claim(state, [1, 2, 3, 4], 'player1');
    const next = placeChip(state, 5, '(1+2)*2');
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
    expect(next.cells.get(5)?.owner).toBe('player1');
  });
});
