/**
 * Wave 47 leftover after #214/#215 — Hex-a-Gone passTurn / canPlayerMove / stuck leftovers. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  type BlockShape,
} from '../../src/games/hex-a-gone/types';
import {
  selectBlock,
  passTurn,
  canPlayerMove,
  isGameOver,
} from '../../src/games/hex-a-gone/rules';

describe('Wave 47 hex-a-gone deepen 3 — hex-a-gone — passTurn no-op / canPlayerMove / mutual stuck', () => {
  it('passTurn with blocks selected is a no-op', () => {
    let state = createInitialState();
    state = selectBlock(state, 'hexagon');
    expect(state.turnSelection.blocks.length).toBeGreaterThan(0);
    expect(passTurn(state)).toBe(state);
  });

  it('passTurn with empty selection flips seat when opponent can move', () => {
    const state = createInitialState();
    expect(canPlayerMove(state)).toBe(true);
    const next = passTurn(state);
    expect(next.currentPlayer).toBe('player2');
    expect(next.phase).toBe('selectBlocks');
    expect(isGameOver(next)).toBe(false);
  });

  it('canPlayerMove false when board empty of free cells or bank empty', () => {
    const full = createInitialState();
    for (const cell of full.board) cell.filled = true;
    expect(canPlayerMove(full)).toBe(false);

    const noBank = {
      ...createInitialState(),
      bank: {
        hexagon: 0,
        trapezoid: 0,
        rhombus: 0,
        triangle: 0,
        square: 0,
      },
    };
    expect(canPlayerMove(noBank)).toBe(false);
  });

  it('mutual stuck via passTurn when board full ends game', () => {
    const state = createInitialState();
    for (const cell of state.board) {
      cell.filled = true;
    }
    // Seed last mover so winner resolves from history
    const withHistory = {
      ...state,
      moveHistory: [
        {
          player: 'player1' as const,
          blocksPlaced: ['triangle' as BlockShape],
          moveNumber: 1,
        },
      ],
    };
    expect(canPlayerMove(withHistory)).toBe(false);
    const ended = passTurn(withHistory);
    expect(ended.phase).toBe('gameOver');
    expect(isGameOver(ended)).toBe(true);
    expect(ended.winner).toBe('player1');
  });

  it('passTurn identity when already gameOver', () => {
    const over = {
      ...createInitialState(),
      phase: 'gameOver' as const,
      winner: 'player2' as const,
    };
    expect(passTurn(over)).toBe(over);
  });
});
