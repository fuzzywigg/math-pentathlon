/**
 * Overnight TOKENMAXX — Hex easy best-move on almost-full 3x3. Tests-only.
 * Tiny board only — avoids hard 11x11 timeout risk.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { getBestMove } from '../../src/games/hex/ai';

afterEach(() => vi.restoreAllMocks());

describe('Overnight hex — easy almost full', () => {
  it('easy picks one of two empties after history>=2', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const s = createInitialState(3);
    // Fill all but (2,2) and (1,0)
    const fills: [number, number, 'player1' | 'player2'][] = [
      [0, 0, 'player1'],
      [0, 1, 'player2'],
      [0, 2, 'player1'],
      [1, 1, 'player2'],
      [1, 2, 'player1'],
      [2, 0, 'player2'],
      [2, 1, 'player1'],
    ];
    for (const [r, c, p] of fills) s.board[r][c] = p;
    s.moveHistory = [
      { player: 'player1', position: { row: 0, col: 0 }, moveNumber: 1 },
      { player: 'player2', position: { row: 0, col: 1 }, moveNumber: 2 },
    ];
    s.currentPlayer = 'player2';
    const move = getBestMove(s, 'player2', 'easy');
    expect(move).not.toBeNull();
    const key = `${move!.row},${move!.col}`;
    expect(['2,2', '1,0']).toContain(key);
  });
});
