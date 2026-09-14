/**
 * Wave 42 — handshake: remainder dice total × hex makeMove seat.
 * Pure engines: roll bounds meet legal place. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { rollDice } from '../../src/games/remainder-islands/rules';
import { createInitialState as hexInit } from '../../src/games/hex/types';
import { makeMove, isValidMove } from '../../src/games/hex/rules';

afterEach(() => vi.restoreAllMocks());

describe('Wave 42 handshake — remainder dice × hex move', () => {
  it('dice total 2..12; hex opening move always legal', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const roll = rollDice();
    expect(roll.total).toBeGreaterThanOrEqual(2);
    expect(roll.total).toBeLessThanOrEqual(12);
    const hex = hexInit(5);
    const pos = { row: 2, col: 2 };
    expect(isValidMove(hex, pos)).toBe(true);
    const next = makeMove(hex, pos);
    expect(next.board[2][2]).toBe('player1');
    expect(next.currentPlayer).toBe('player2');
  });

  it('high dice seed and hex OOB reject stay independent', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.999);
    expect(rollDice().total).toBe(12);
    const hex = hexInit(4);
    expect(isValidMove(hex, { row: -1, col: 0 })).toBe(false);
    expect(makeMove(hex, { row: -1, col: 0 })).toBe(hex);
  });
});
