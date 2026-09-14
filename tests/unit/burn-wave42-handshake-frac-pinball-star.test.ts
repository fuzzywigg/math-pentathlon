/**
 * Wave 42 HEAVY — handshake: frac-fact × pinball × star-track openings.
 * Leftover engines (not #187 set). Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState as fracInit,
  getOpponent as fracOpp,
  DEFAULT_MAX_PROBLEMS,
} from '../../src/games/frac-fact/types';
import {
  createInitialState as pinInit,
  getOpponent as pinOpp,
  getPlayerStats,
  INITIAL_BALLS,
  MAX_ROUNDS,
} from '../../src/games/fraction-pinball/types';
import {
  createInitialState as starInit,
  getOpponent as starOpp,
  getPlayerPosition,
  TRACK_LENGTH,
} from '../../src/games/star-track/types';

describe('Wave 42 handshake — frac-fact × pinball × star-track', () => {
  it('all three open player1 with null winner', () => {
    expect(fracInit().currentPlayer).toBe('player1');
    expect(pinInit().currentPlayer).toBe('player1');
    expect(starInit().currentPlayer).toBe('player1');
    expect(fracInit().winner).toBeNull();
    expect(pinInit().winner).toBeNull();
    expect(starInit().winner).toBeNull();
  });

  it('opening phases are interactive quiz/race, not gameOver', () => {
    expect(fracInit().phase).toBe('playing');
    expect(pinInit().phase).toBe('answering');
    expect(starInit().phase).toBe('drawChains');
  });

  it('catalog constants hold', () => {
    expect(DEFAULT_MAX_PROBLEMS).toBeGreaterThan(0);
    expect(INITIAL_BALLS).toBe(5);
    expect(MAX_ROUNDS).toBeGreaterThan(0);
    expect(TRACK_LENGTH).toBe(12);
    expect(getPlayerStats(pinInit(), 'player1').ballsRemaining).toBe(
      INITIAL_BALLS
    );
    expect(getPlayerPosition(starInit(), 'player1')).toBe(0);
  });

  it('opponent helpers agree across trio', () => {
    expect(fracOpp('player1')).toBe('player2');
    expect(pinOpp('player1')).toBe(starOpp('player1'));
    expect(fracOpp('player2')).toBe(pinOpp('player2'));
  });
});
