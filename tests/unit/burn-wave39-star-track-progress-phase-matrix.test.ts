/**
 * Wave 39 — Star Track progress / phase / bucket catalog leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  createChainBucket,
  CHAINS_PER_LENGTH,
  TRACK_LENGTH,
  getOpponent,
  getPlayerPosition,
} from '../../src/games/star-track/types';
import {
  drawChains,
  getPhaseMessage,
  getProgress,
} from '../../src/games/star-track/rules';

describe('Wave 39 Star Track — progress phase matrix', () => {
  it('createChainBucket has 6 lengths × CHAINS_PER_LENGTH', () => {
    const bucket = createChainBucket();
    expect(bucket).toHaveLength(6 * CHAINS_PER_LENGTH);
    for (let len = 1; len <= 6; len++) {
      expect(bucket.filter((c) => c.length === len)).toHaveLength(CHAINS_PER_LENGTH);
    }
  });

  it('createInitialState starts at drawChains with full bucket', () => {
    const state = createInitialState();
    expect(state.phase).toBe('drawChains');
    expect(state.player1Position).toBe(0);
    expect(state.player2Position).toBe(0);
    expect(state.drawnChains).toBeNull();
    expect(state.chainBucket.length).toBe(6 * CHAINS_PER_LENGTH);
  });

  it('getPhaseMessage draw / select / win matrix', () => {
    const draw = createInitialState();
    expect(getPhaseMessage(draw)).toMatch(/Draw chains/);
    const select = drawChains(draw);
    expect(getPhaseMessage(select)).toMatch(/Choose a chain/);
    const over = {
      ...draw,
      phase: 'gameOver' as const,
      winner: 'player2' as const,
    };
    expect(getPhaseMessage(over)).toMatch(/Red wins/);
  });

  it('getOpponent and getPlayerPosition helpers', () => {
    const state = { ...createInitialState(), player2Position: 5 };
    expect(getOpponent('player1')).toBe('player2');
    expect(getPlayerPosition(state, 'player2')).toBe(5);
    expect(getProgress(state, 'player2')).toBeCloseTo((5 / TRACK_LENGTH) * 100);
  });
});
