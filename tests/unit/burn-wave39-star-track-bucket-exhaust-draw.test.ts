/**
 * Wave 39 — Star Track bucket exhaust → draw / position winner.
 * Deepens leftover engine after wave 35 select-null. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  TRACK_LENGTH,
} from '../../src/games/star-track/types';
import {
  drawChains,
  selectChain,
  isGameOver,
  getPhaseMessage,
  getProgress,
} from '../../src/games/star-track/rules';

describe('Wave 39 Star Track — bucket exhaust draw', () => {
  it('drawChains identity when phase is not drawChains', () => {
    const state = { ...createInitialState(), phase: 'selectChain' as const };
    expect(drawChains(state)).toBe(state);
  });

  it('bucket length 0 ends game with draw when positions equal', () => {
    const state = {
      ...createInitialState(),
      chainBucket: [],
      player1Position: 3,
      player2Position: 3,
    };
    const next = drawChains(state);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBeNull();
    expect(isGameOver(next)).toBe(true);
    expect(getPhaseMessage(next)).toMatch(/draw/i);
  });

  it('bucket length 1 ends game; leading position wins', () => {
    const state = {
      ...createInitialState(),
      chainBucket: [{ length: 2 as const, id: 99 }],
      player1Position: 8,
      player2Position: 2,
    };
    const next = drawChains(state);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
    expect(getPhaseMessage(next)).toMatch(/Blue wins/);
  });

  it('bucket length 1 with p2 lead awards Red', () => {
    const state = {
      ...createInitialState(),
      chainBucket: [{ length: 4 as const, id: 1 }],
      player1Position: 1,
      player2Position: 9,
    };
    expect(drawChains(state).winner).toBe('player2');
  });

  it('normal draw pops two chains and enters selectChain', () => {
    const start = createInitialState();
    const before = start.chainBucket.length;
    const next = drawChains(start);
    expect(next.phase).toBe('selectChain');
    expect(next.drawnChains).toHaveLength(2);
    expect(next.chainBucket.length).toBe(before - 2);
  });

  it('getProgress at TRACK_LENGTH is 100', () => {
    const state = {
      ...createInitialState(),
      player1Position: TRACK_LENGTH,
    };
    expect(getProgress(state, 'player1')).toBe(100);
  });
});
