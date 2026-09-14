/**
 * Wave 41 HEAVY — handshake: kwatro-sinko × calla getOpponent / seat helpers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState as kwaInit } from '../../src/games/kwatro-sinko/rules';
import { getOpponent as kwaOpponent } from '../../src/games/kwatro-sinko/types';
import {
  createInitialState as callaInit,
  getOpponent as callaOpponent,
  getPlayerPits,
  getPlayerCalla,
  isSideEmpty,
} from '../../src/games/calla/types';

describe('Wave 41 handshake — kwatro × calla seat helpers', () => {
  it('getOpponent is symmetric and identical across engines', () => {
    for (const seat of ['player1', 'player2'] as const) {
      expect(kwaOpponent(seat)).toBe(callaOpponent(seat));
      expect(kwaOpponent(kwaOpponent(seat))).toBe(seat);
    }
  });

  it('both openings seat player1 with no winner', () => {
    const k = kwaInit();
    const c = callaInit();
    expect(k.currentPlayer).toBe('player1');
    expect(c.currentPlayer).toBe('player1');
    expect(k.winner).toBeNull();
    expect(c.winner).toBeNull();
    expect(k.phase).not.toBe('gameOver');
    expect(c.phase).not.toBe('gameOver');
  });

  it('kwatro selectingChip vs calla selectPit — both interactive openings', () => {
    const k = kwaInit();
    const c = callaInit();
    expect(k.phase).toBe('selectingChip');
    expect(c.phase).toBe('selectPit');
    expect(k.selectedChip).toBeNull();
    expect(c.animatingPit).toBeNull();
  });

  it('calla pit helpers: both sides full; stores empty at open', () => {
    const c = callaInit();
    expect(isSideEmpty(c, 'player1')).toBe(false);
    expect(isSideEmpty(c, 'player2')).toBe(false);
    expect(getPlayerPits(c, 'player1').every((n) => n > 0)).toBe(true);
    expect(getPlayerCalla(c, 'player1')).toBe(0);
    expect(getPlayerCalla(c, 'player2')).toBe(0);
    // Opponent of current seat matches kwatro helper
    expect(callaOpponent(c.currentPlayer)).toBe(kwaOpponent(c.currentPlayer));
  });

  it('kwatro chips map non-empty; selected null at open', () => {
    const k = kwaInit();
    expect(k.chips.size).toBeGreaterThan(0);
    expect(k.nodes.size).toBeGreaterThan(0);
    expect(k.selectedChip).toBeNull();
    expect(kwaOpponent(k.currentPlayer)).toBe('player2');
  });
});
