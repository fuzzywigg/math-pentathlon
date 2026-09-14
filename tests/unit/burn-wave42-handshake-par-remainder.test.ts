/**
 * Wave 42 HEAVY — handshake: par-55 × remainder-islands openings.
 * Leftover engines (not #187 set). Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { createInitialState as parInit } from '../../src/games/par-55/rules';
import { getOpponent as parOpp, CONFIG as parConfig } from '../../src/games/par-55/types';
import {
  createInitialState as remInit,
  getOpponent as remOpp,
  getPlayerChips,
  INITIAL_CHIPS_PER_PLAYER,
} from '../../src/games/remainder-islands/types';

describe('Wave 42 handshake — par-55 × remainder openings', () => {
  it('both open player1 / no winner', () => {
    const p = parInit();
    const r = remInit();
    expect(p.currentPlayer).toBe('player1');
    expect(r.currentPlayer).toBe('player1');
    expect(p.winner).toBeNull();
    expect(r.winner).toBeNull();
  });

  it('par selectingBlock with hands; remainder rolling with chips', () => {
    const p = parInit();
    const r = remInit();
    expect(p.phase).toBe('selectingBlock');
    expect(p.hands.player1.length).toBeGreaterThan(0);
    expect(p.hands.player2.length).toBeGreaterThan(0);
    expect(parConfig.TARGET_SCORE).toBe(55);
    expect(r.phase).toBe('rolling');
    expect(getPlayerChips(r, 'player1')).toBe(INITIAL_CHIPS_PER_PLAYER);
    expect(getPlayerChips(r, 'player2')).toBe(INITIAL_CHIPS_PER_PLAYER);
    expect(r.currentRoll).toBeNull();
  });

  it('opponent helpers agree', () => {
    expect(parOpp('player1')).toBe(remOpp('player1'));
    expect(parOpp('player2')).toBe(remOpp('player2'));
  });

  it('neither opens gameOver or selecting island/block mid-turn', () => {
    expect(parInit().selectedBlock).toBeNull();
    expect(remInit().selectedIsland).toBeNull();
    expect(parInit().phase).not.toBe('gameOver');
    expect(remInit().phase).not.toBe('selectIsland');
  });
});
