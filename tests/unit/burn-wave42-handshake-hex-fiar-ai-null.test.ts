/**
 * Wave 42 — Handshake: Hex full-board null ↔ FIAR gameOver null.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState as hexInit } from '../../src/games/hex/types';
import { getBestMove } from '../../src/games/hex/ai';
import { createInitialState as fiarInit } from '../../src/games/fiar/types';
import { getAIMove } from '../../src/games/fiar/ai';

describe('Wave 42 handshake — Hex×FIAR AI null', () => {
  it('both engines return null on terminal/no-move states', () => {
    const hexFull = {
      ...hexInit(2),
      board: [
        ['player1', 'player2'],
        ['player2', 'player1'],
      ] as ReturnType<typeof hexInit>['board'],
    };
    expect(getBestMove(hexFull, 'player1', 'easy')).toBeNull();

    const fiarOver = {
      ...fiarInit(),
      phase: 'gameOver' as const,
      winner: 'player2' as const,
    };
    expect(getAIMove(fiarOver, 'player1', 'easy')).toBeNull();
  });
});
