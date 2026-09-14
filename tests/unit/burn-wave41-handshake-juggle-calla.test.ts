/**
 * Wave 41 HEAVY — handshake: juggle × calla phase / seat invariants.
 * Extra cross-engine coverage. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState as juggleInit,
  checkWinner as juggleCheckWinner,
} from '../../src/games/juggle/rules';
import { getOpponent as juggleOpponent } from '../../src/games/juggle/types';
import {
  createInitialState as callaInit,
  getOpponent as callaOpponent,
} from '../../src/games/calla/types';
import { isGameOver as callaIsGameOver } from '../../src/games/calla/rules';

describe('Wave 41 handshake — juggle × calla phase invariants', () => {
  it('openings: player1; juggle rolling; calla selectPit; neither over', () => {
    const j = juggleInit();
    const c = callaInit();
    expect(j.currentPlayer).toBe(c.currentPlayer);
    expect(j.currentPlayer).toBe('player1');
    expect(j.phase).toBe('rolling');
    expect(c.phase).toBe('selectPit');
    expect(juggleCheckWinner(j.boards)).toBeNull();
    expect(callaIsGameOver(c)).toBe(false);
  });

  it('opponent helpers stay aligned', () => {
    expect(juggleOpponent('player1')).toBe(callaOpponent('player1'));
    expect(juggleOpponent('player2')).toBe(callaOpponent('player2'));
  });

  it('juggle empty boards do not win; calla empty stores do not end game', () => {
    const j = juggleInit();
    const c = callaInit();
    expect(juggleCheckWinner(j.boards)).toBeNull();
    expect(c.player1Calla).toBe(0);
    expect(c.player2Calla).toBe(0);
    expect(callaIsGameOver(c)).toBe(false);
  });

  it('forced calla gameOver does not affect fresh juggle', () => {
    const c = {
      ...callaInit(),
      phase: 'gameOver' as const,
      winner: 'player1' as const,
    };
    expect(callaIsGameOver(c)).toBe(true);
    const j = juggleInit();
    expect(j.phase).toBe('rolling');
    expect(juggleCheckWinner(j.boards)).toBeNull();
  });
});
