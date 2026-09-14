/**
 * Wave 42 — Star Track win race + position clamp to TRACK_LENGTH. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  drawChains,
  selectChain,
  isGameOver,
  getProgress,
  getPhaseMessage,
} from '../../src/games/star-track/rules';
import { createInitialState, TRACK_LENGTH, createChainBucket } from '../../src/games/star-track/types';

describe('Wave 42 star-track — win race clamp', () => {
  it('near finish selecting long chain wins and clamps', () => {
    let s = createInitialState();
    s = {
      ...s,
      player1Position: TRACK_LENGTH - 1,
      phase: 'selectChain',
      drawnChains: [
        { length: 6, id: 101 },
        { length: 1, id: 102 },
      ],
      chainBucket: createChainBucket().slice(0, 10),
    };
    const next = selectChain(s, 0);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
    expect(next.player1Position).toBe(TRACK_LENGTH);
    expect(isGameOver(next)).toBe(true);
    expect(getProgress(next, 'player1')).toBe(100);
  });

  it('bucket <2 settle by position; draw message', () => {
    const s = {
      ...createInitialState(),
      chainBucket: createChainBucket().slice(0, 1),
      player1Position: 5,
      player2Position: 8,
      phase: 'drawChains' as const,
    };
    const over = drawChains(s);
    expect(over.phase).toBe('gameOver');
    expect(over.winner).toBe('player2');
    expect(getPhaseMessage(over)).toMatch(/Red wins/);
  });

  it('equal positions bucket exhaust → draw message', () => {
    const s = {
      ...createInitialState(),
      chainBucket: [],
      player1Position: 4,
      player2Position: 4,
      phase: 'drawChains' as const,
    };
    const over = drawChains(s);
    expect(over.winner).toBeNull();
    expect(getPhaseMessage(over)).toMatch(/draw/i);
  });
});
