/**
 * Wave 41 handshake — Calla phase message × core formatTime.
 * formatTime imported from core/timer-scoring (real export). Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import {
  getPhaseMessage,
  isGameOver,
} from '../../src/games/calla/rules';
import { formatTime } from '../../src/core/timer-scoring';

describe('Wave 41 handshake — calla × timer formatTime', () => {
  it('calla opening phase message pairs with formatted zero clock', () => {
    const state = createInitialState();
    expect(isGameOver(state)).toBe(false);
    const msg = getPhaseMessage(state);
    expect(msg).toContain('Blue');
    expect(msg).toContain('Select a shield');
    expect(formatTime(0)).toBe('00:00');
    expect(formatTime(65_000)).toBe('01:05');
  });

  it('gameOver phase message still formats elapsed duration', () => {
    const over = {
      ...createInitialState(),
      phase: 'gameOver' as const,
      winner: 'player1' as const,
    };
    expect(isGameOver(over)).toBe(true);
    expect(getPhaseMessage(over)).toContain('Blue wins');
    expect(formatTime(90_000, { padMinutes: true })).toBe('01:30');
    expect(formatTime(1500, { showMilliseconds: true })).toMatch(/^00:01\./);
  });
});
