/**
 * Wave 41 — Contig 60 passTurn / checkWinner / hasValidMoves matrix.
 * Pass phase gate, elimination, alignment, dice-null. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  CONFIG,
} from '../../src/games/contig-60/types';
import {
  passTurn,
  checkWinner,
  hasValidMoves,
} from '../../src/games/contig-60/rules';

describe('Wave 41 contig-60 — pass / winner / hasValidMoves', () => {
  it('passTurn identity outside calculating', () => {
    for (const phase of ['rolling', 'placing', 'gameOver'] as const) {
      const state = {
        ...createInitialState(),
        phase,
        currentDice: [2, 2, 2] as [number, number, number],
      };
      expect(passTurn(state)).toBe(state);
    }
  });

  it('passTurn flips seat and clears dice; three solo passes do not eliminate', () => {
    const base = {
      ...createInitialState(),
      phase: 'calculating' as const,
      currentDice: [1, 1, 1] as [number, number, number],
    };
    const once = passTurn(base);
    expect(once.currentPlayer).toBe('player2');
    expect(once.phase).toBe('rolling');
    expect(once.consecutivePasses.player1).toBe(1);
    expect(once.currentDice).toBeNull();

    const thirdSolo = {
      ...base,
      consecutivePasses: {
        player1: 2,
        player2: 0,
      },
    };
    const afterThird = passTurn(thirdSolo);
    expect(afterThird.phase).toBe('rolling');
    expect(afterThird.winner).toBeNull();
    expect(afterThird.consecutivePasses.player1).toBe(3);
  });

  it('hasValidMoves false without dice; true with open board + dice', () => {
    expect(hasValidMoves(createInitialState())).toBe(false);
    const withDice = {
      ...createInitialState(),
      phase: 'calculating' as const,
      currentDice: [1, 2, 3] as [number, number, number],
    };
    expect(hasValidMoves(withDice)).toBe(true);

    for (const cell of withDice.cells.values()) {
      cell.owner = 'player1';
    }
    expect(hasValidMoves(withDice)).toBe(false);
  });

  it('checkWinner null opening; 5-in-a-row wins; full board ignores scores', () => {
    expect(checkWinner(createInitialState())).toBeNull();

    const align = createInitialState();
    for (let col = 0; col < 5; col++) {
      align.cells.get(align.grid[0][col]!)!.owner = 'player2';
    }
    expect(checkWinner(align)).toBe('player2');

    const full = createInitialState();
    let i = 0;
    for (const cell of full.cells.values()) {
      cell.owner = i % 2 === 0 ? 'player1' : 'player2';
      i++;
    }
    // Break any accidental 5-in-a-row on row0 by alternating already;
    // ensure scores decide if alignment missed
    const scored = {
      ...full,
      scores: { player1: 10, player2: 3 },
    };
    const flipped = {
      ...full,
      scores: { player1: 3, player2: 10 },
    };
    const w = checkWinner(scored);
    expect(w).not.toBeNull();
    expect(checkWinner(flipped)).toBe(w);
  });

  it('full board unequal scores settle without using the scoreboard', () => {
    const state = createInitialState();
    for (const cell of state.cells.values()) {
      cell.owner = 'player2';
    }
    let n = 0;
    for (let r = 0; r < CONFIG.GRID_ROWS; r++) {
      for (let c = 0; c < CONFIG.GRID_COLS; c++) {
        const v = state.grid[r][c]!;
        if (n % 3 === 0) {
          state.cells.get(v)!.owner = 'player1';
        }
        n++;
      }
    }
    const a = checkWinner({
      ...state,
      scores: { player1: 1, player2: 99 },
    });
    const b = checkWinner({
      ...state,
      scores: { player1: 99, player2: 1 },
    });
    expect(a).not.toBeNull();
    expect(a).toBe(b);
  });
});
