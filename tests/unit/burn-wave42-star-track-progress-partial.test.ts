/** Wave 42 — Star Track getProgress partial positions. Tests-only. */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  TRACK_LENGTH,
} from '../../src/games/star-track/types';
import { getProgress } from '../../src/games/star-track/rules';

describe('Wave 42 Star Track — progress partial', () => {
  it('start positions are 0%', () => {
    const state = createInitialState();
    expect(getProgress(state, 'player1')).toBe(0);
    expect(getProgress(state, 'player2')).toBe(0);
  });

  it('halfway position is 50%', () => {
    const half = TRACK_LENGTH / 2;
    const state = {
      ...createInitialState(),
      player1Position: half,
      player2Position: half,
    };
    expect(getProgress(state, 'player1')).toBeCloseTo(50);
    expect(getProgress(state, 'player2')).toBeCloseTo(50);
  });

  it('partial third of track for player1 only', () => {
    const pos = 4;
    const state = {
      ...createInitialState(),
      player1Position: pos,
      player2Position: 0,
    };
    expect(getProgress(state, 'player1')).toBeCloseTo((pos / TRACK_LENGTH) * 100);
    expect(getProgress(state, 'player2')).toBe(0);
  });

  it('full TRACK_LENGTH is 100%', () => {
    const state = {
      ...createInitialState(),
      player2Position: TRACK_LENGTH,
    };
    expect(getProgress(state, 'player2')).toBe(100);
  });

  it('asymmetric partials stay independent', () => {
    const state = {
      ...createInitialState(),
      player1Position: 3,
      player2Position: 9,
    };
    expect(getProgress(state, 'player1')).toBeCloseTo(25);
    expect(getProgress(state, 'player2')).toBeCloseTo(75);
  });
});
