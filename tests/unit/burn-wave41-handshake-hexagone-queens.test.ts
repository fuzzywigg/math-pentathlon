/**
 * Wave 41 HEAVY — handshake: hex-a-gone × queens-guards openings /
 * isGameOver / checkWinner.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState as hexInit,
  getOpponent as hexOpponent,
} from '../../src/games/hex-a-gone/types';
import { isGameOver as hexIsGameOver } from '../../src/games/hex-a-gone/rules';
import {
  createInitialState as qgInit,
  getOpponent as qgOpponent,
} from '../../src/games/queens-guards/types';
import {
  checkWinner as qgCheckWinner,
  hasValidMoves as qgHasValidMoves,
} from '../../src/games/queens-guards/rules';

describe('Wave 41 handshake — hex-a-gone × queens-guards openings', () => {
  it('both seat player1; neither over at open', () => {
    const h = hexInit();
    const q = qgInit();
    expect(h.currentPlayer).toBe('player1');
    expect(q.currentPlayer).toBe('player1');
    expect(h.winner).toBeNull();
    expect(q.winner).toBeNull();
    expect(hexIsGameOver(h)).toBe(false);
    expect(qgCheckWinner(q)).toBeNull();
  });

  it('opponent helpers match across engines', () => {
    expect(hexOpponent('player1')).toBe(qgOpponent('player1'));
    expect(hexOpponent('player2')).toBe(qgOpponent('player2'));
  });

  it('hex opens selectBlocks; queens has pieces and valid moves', () => {
    const h = hexInit();
    const q = qgInit();
    expect(h.phase).toBe('selectBlocks');
    expect(h.phase).not.toBe('gameOver');
    expect(h.board.length).toBeGreaterThan(0);
    expect(h.placedBlocks).toEqual([]);
    expect(q.cells.size).toBeGreaterThan(0);
    expect(q.selectedPiece).toBeNull();
    expect(qgHasValidMoves(q)).toBe(true);
  });

  it('forced hex gameOver is detected; queens still open', () => {
    const h = {
      ...hexInit(),
      phase: 'gameOver' as const,
      winner: 'player1' as const,
    };
    const q = qgInit();
    expect(hexIsGameOver(h)).toBe(true);
    expect(qgCheckWinner(q)).toBeNull();
    expect(hexOpponent(h.winner!)).toBe(qgOpponent('player1'));
  });

  it('hex winner-null with gameOver phase still counts as over', () => {
    const h = { ...hexInit(), phase: 'gameOver' as const, winner: null };
    // isGameOver: phase === gameOver OR winner !== null
    expect(hexIsGameOver(h)).toBe(true);
    expect(qgCheckWinner(qgInit())).toBeNull();
  });
});
