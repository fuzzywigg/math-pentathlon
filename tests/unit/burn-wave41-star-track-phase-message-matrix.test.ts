/**
 * Wave 41 — Star Track phase message + select identity + opponent.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  createChainBucket,
  getOpponent,
  TRACK_LENGTH,
  CHAINS_PER_LENGTH,
} from '../../src/games/star-track/types';
import {
  drawChains,
  selectChain,
  getPhaseMessage,
  getProgress,
} from '../../src/games/star-track/rules';
import { executeAITurn, isAITurn } from '../../src/games/star-track/ai';

describe('Wave 41 star-track — phase matrix leftovers', () => {
  it('getPhaseMessage draw/select/moving matrix', () => {
    const base = createInitialState();
    expect(getPhaseMessage({ ...base, phase: 'drawChains' })).toMatch(/Draw chains/);
    expect(getPhaseMessage({ ...base, phase: 'selectChain' })).toMatch(/Choose a chain/);
    expect(getPhaseMessage({ ...base, phase: 'moving' as 'drawChains' })).toBe('');
  });

  it('selectChain identity on drawChains / gameOver', () => {
    const base = createInitialState();
    expect(selectChain(base, 0)).toBe(base);
    const over = { ...base, phase: 'gameOver' as const, winner: 'player1' as const };
    expect(selectChain(over, 0)).toBe(over);
  });

  it('createChainBucket length and length histogram', () => {
    const bucket = createChainBucket();
    expect(bucket.length).toBe(6 * CHAINS_PER_LENGTH);
    for (let len = 1; len <= 6; len++) {
      expect(bucket.filter((c) => c.length === len).length).toBe(CHAINS_PER_LENGTH);
    }
  });

  it('getProgress player2; getOpponent matrix', () => {
    const state = { ...createInitialState(), player2Position: TRACK_LENGTH / 2 };
    expect(getProgress(state, 'player2')).toBeCloseTo(50);
    expect(getOpponent('player1')).toBe('player2');
    expect(getOpponent('player2')).toBe('player1');
  });

  it('executeAITurn wrong seat identity; selectChain phase skips draw', () => {
    const base = createInitialState();
    expect(executeAITurn(base, 'player2', 'easy')).toBe(base);
    const drawn = drawChains(base);
    expect(drawn.phase).toBe('selectChain');
    const after = executeAITurn(
      { ...drawn, currentPlayer: 'player1' },
      'player1',
      'easy'
    );
    expect(after.moveHistory.length).toBeGreaterThan(drawn.moveHistory.length);
    expect(isAITurn(base, 'player1', 'human-vs-human')).toBe(false);
  });
});
