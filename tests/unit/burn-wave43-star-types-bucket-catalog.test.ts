/**
 * Wave 43 TOKENMAXX — Star Track bucket/catalog leftovers (non-AI). Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  TRACK_LENGTH,
  CHAINS_PER_LENGTH,
  createChainBucket,
  createInitialState,
  getOpponent,
  getPlayerPosition,
} from '../../src/games/star-track/types';

afterEach(() => vi.restoreAllMocks());

describe('Wave 43 star-track — types/bucket', () => {
  it('catalog constants and 24-chain bucket', () => {
    expect(TRACK_LENGTH).toBe(12);
    expect(CHAINS_PER_LENGTH).toBe(4);
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const bucket = createChainBucket();
    expect(bucket).toHaveLength(24);
    for (let len = 1; len <= 6; len++) {
      expect(bucket.filter((c) => c.length === len)).toHaveLength(4);
    }
    expect(new Set(bucket.map((c) => c.id)).size).toBe(24);
  });

  it('initial state + helpers', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = createInitialState();
    expect(state.phase).toBe('drawChains');
    expect(state.player1Position).toBe(0);
    expect(state.player2Position).toBe(0);
    expect(state.drawnChains).toBeNull();
    expect(state.chainBucket).toHaveLength(24);
    expect(getOpponent('player1')).toBe('player2');
    expect(getPlayerPosition(state, 'player1')).toBe(0);
    expect(getPlayerPosition({ ...state, player2Position: 5 }, 'player2')).toBe(5);
  });
});
