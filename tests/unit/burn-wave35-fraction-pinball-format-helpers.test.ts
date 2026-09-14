/**
 * Wave 35 — Fraction Pinball formatDecimal / AI null / hitRandomTarget / settle.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  createInitialState,
  TARGET_POINTS,
} from '../../src/games/fraction-pinball/types';
import {
  formatDecimal,
  formatFraction,
  startGame,
  submitAnswer,
  nextChallenge,
  hitRandomTarget,
} from '../../src/games/fraction-pinball/rules';
import { getAIAnswer, isAITurn } from '../../src/games/fraction-pinball/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 35 Fraction Pinball — format helpers', () => {
  it('formatDecimal strips trailing zeros and keeps ints', () => {
    expect(formatDecimal(2)).toBe('2');
    expect(formatDecimal(0.5)).toBe('0.5');
    expect(formatDecimal(0.25)).toBe('0.25');
    expect(formatDecimal(1 / 3)).toMatch(/^0\.3333/);
  });

  it('formatFraction mirrors whole vs proper', () => {
    expect(formatFraction({ numerator: 4, denominator: 1 })).toBe('4');
    expect(formatFraction({ numerator: 3, denominator: 4 })).toBe('3/4');
  });

  it('getAIAnswer null on showResult / gameOver / no challenge', () => {
    const live = startGame(createInitialState());
    expect(getAIAnswer({ ...live, phase: 'showResult' }, 'player1', 'hard')).toBeNull();
    expect(getAIAnswer({ ...live, phase: 'gameOver', winner: 'player1' }, 'player1', 'hard')).toBeNull();
    expect(getAIAnswer({ ...live, currentChallenge: null }, 'player1', 'hard')).toBeNull();
    expect(getAIAnswer(live, 'player2', 'hard')).toBeNull();
  });

  it('hitRandomTarget returns points in TARGET_POINTS', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const targets = TARGET_POINTS.map((value, i) => ({
      id: `t${i}`,
      value,
      label: String(value),
      hit: false,
    }));
    const hit = hitRandomTarget(targets);
    expect(TARGET_POINTS).toContain(hit.points);
    expect(hit.target.value).toBe(hit.points);
  });

  it('nextChallenge with both seats at zero balls → gameOver', () => {
    let state = startGame(createInitialState());
    state = {
      ...state,
      phase: 'showResult',
      player1Stats: { ...state.player1Stats, ballsRemaining: 0 },
      player2Stats: { ...state.player2Stats, ballsRemaining: 0 },
    };
    const next = nextChallenge(state);
    expect(next.phase).toBe('gameOver');
  });

  it('submitAnswer identity wrong phase; isAITurn gates', () => {
    const state = createInitialState();
    expect(submitAnswer(state, '0.5')).toBe(state);
    const live = startGame(createInitialState());
    expect(isAITurn(live, null)).toBe(false);
    expect(isAITurn(live, 'player1')).toBe(true);
  });
});
