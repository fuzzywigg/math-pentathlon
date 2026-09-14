/**
 * Wave 40 — contig-60 phase noops + consecutive-pass elimination leftovers after #176.
 * Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  createInitialState,
  CONFIG,
} from '../../src/games/contig-60/types';
import {
  doRollDice,
  placeChip,
  passTurn,
  calculatePoints,
  hasValidMoves,
} from '../../src/games/contig-60/rules';

beforeEach(() => {
  vi.spyOn(Math, 'random').mockReturnValue(0.5);
});
afterEach(() => vi.restoreAllMocks());

describe('Wave 40 contig-60 — phase / pass elim', () => {
  it('wrong-phase roll/place/pass are noops; null dice has no moves', () => {
    const s0 = createInitialState();
    expect(doRollDice({ ...s0, phase: 'calculating' })).toEqual({
      ...s0,
      phase: 'calculating',
    });
    expect(placeChip(s0, 1, '1')).toEqual(s0);
    expect(passTurn(s0)).toEqual(s0);
    expect(hasValidMoves(s0)).toBe(false);
  });

  it('isolated calculatePoints is 0; MAX passes eliminate', () => {
    let s = createInitialState();
    s = doRollDice(s);
    expect(calculatePoints(s, 1)).toBe(0);
    // Force consecutive passes to elimination threshold
    s = {
      ...s,
      phase: 'calculating',
      consecutivePasses: {
        player1: CONFIG.MAX_CONSECUTIVE_PASSES - 1,
        player2: 0,
      },
      currentPlayer: 'player1',
    };
    const ended = passTurn(s);
    expect(ended.phase).toBe('gameOver');
    expect(ended.winner).toBe('player2');
  });
});
