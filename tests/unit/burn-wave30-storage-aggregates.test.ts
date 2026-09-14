/**
 * Wave 30 — storage aggregate totals / win-rate stress across many games.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { storage, type GameResult } from '../../src/core/storage';
import { resetStorageHarness } from './helpers/storage-test-harness';

beforeEach(() => {
  vi.useFakeTimers();
  resetStorageHarness();
});

afterEach(() => {
  vi.useRealTimers();
  resetStorageHarness();
  vi.restoreAllMocks();
});

const GAME_IDS = [
  'hex',
  'calla',
  'fiar',
  'contig-60',
  'prime-gold',
  'juggle',
  'sum-dominoes',
  'stars-bars',
  'par-55',
  'ramrod',
  'kwatro-sinko',
  'fab-a-diffy',
  'pent-em-in',
  'queens-guards',
  'kings-quadraphages',
  'fraction-pinball',
  'frac-fact',
  'remainder-islands',
  'hex-a-gone',
  'star-track',
] as const;

function play(
  gameId: string,
  outcomes: Array<'win' | 'loss' | 'draw'>,
  duration = 1000
): void {
  for (const o of outcomes) {
    const result: GameResult = {
      gameId,
      winner: o === 'draw' ? 'draw' : o === 'win' ? 'player1' : 'ai',
      playerWon: o === 'win',
      duration,
      moveCount: 3,
      playedAt: Date.now(),
    };
    storage.recordGameResult(result);
  }
}

describe('Wave 30 storage-aggregates — empty / single', () => {
  it('empty store totals are zero', () => {
    expect(storage.getTotalGamesPlayed()).toBe(0);
    expect(storage.getTotalPlayTime()).toBe(0);
    expect(storage.getOverallWinRate()).toBe(0);
  });

  it('single win → rate 1', () => {
    play('hex', ['win'], 500);
    expect(storage.getTotalGamesPlayed()).toBe(1);
    expect(storage.getTotalPlayTime()).toBe(500);
    expect(storage.getOverallWinRate()).toBe(1);
  });

  it('single loss → rate 0', () => {
    play('hex', ['loss'], 800);
    expect(storage.getOverallWinRate()).toBe(0);
    expect(storage.getTotalPlayTime()).toBe(800);
  });
});

describe('Wave 30 storage-aggregates — multi-game matrix', () => {
  it('sums played/time across the catalog with mixed outcomes', () => {
    let expectedPlayed = 0;
    let expectedWins = 0;
    let expectedTime = 0;

    for (let i = 0; i < GAME_IDS.length; i++) {
      const id = GAME_IDS[i];
      const outcomes: Array<'win' | 'loss' | 'draw'> = [
        'win',
        'loss',
        'draw',
        i % 2 === 0 ? 'win' : 'loss',
      ];
      const duration = 100 * (i + 1);
      play(id, outcomes, duration);
      expectedPlayed += outcomes.length;
      expectedWins += outcomes.filter((o) => o === 'win').length;
      expectedTime += duration * outcomes.length;
    }

    expect(storage.getTotalGamesPlayed()).toBe(expectedPlayed);
    expect(storage.getTotalPlayTime()).toBe(expectedTime);
    expect(storage.getOverallWinRate()).toBeCloseTo(
      expectedWins / expectedPlayed
    );
    expect(Object.keys(storage.getAllGameStats()).sort()).toEqual(
      [...GAME_IDS].sort()
    );
  });

  it('lazy-created zero rows do not inflate totals until recorded', () => {
    for (const id of GAME_IDS) {
      storage.getGameStats(id);
    }
    expect(Object.keys(storage.getAllGameStats())).toHaveLength(
      GAME_IDS.length
    );
    expect(storage.getTotalGamesPlayed()).toBe(0);
    expect(storage.getTotalPlayTime()).toBe(0);
    expect(storage.getOverallWinRate()).toBe(0);
  });
});

describe('Wave 30 storage-aggregates — win rate edge table', () => {
  const cases: Array<{
    label: string;
    wins: number;
    losses: number;
    draws: number;
    rate: number;
  }> = [
    { label: 'all wins', wins: 5, losses: 0, draws: 0, rate: 1 },
    { label: 'all losses', wins: 0, losses: 5, draws: 0, rate: 0 },
    { label: 'all draws', wins: 0, losses: 0, draws: 5, rate: 0 },
    { label: 'half wins', wins: 3, losses: 3, draws: 0, rate: 0.5 },
    { label: '2/5 with draws', wins: 2, losses: 1, draws: 2, rate: 0.4 },
    { label: '1/10', wins: 1, losses: 9, draws: 0, rate: 0.1 },
  ];

  it.each(cases)('$label → $rate', ({ wins, losses, draws, rate }) => {
    storage.resetAll();
    play('agg', [
      ...Array(wins).fill('win'),
      ...Array(losses).fill('loss'),
      ...Array(draws).fill('draw'),
    ] as Array<'win' | 'loss' | 'draw'>);
    expect(storage.getOverallWinRate()).toBeCloseTo(rate);
    expect(storage.getTotalGamesPlayed()).toBe(wins + losses + draws);
  });
});

describe('Wave 30 storage-aggregates — reset clears totals', () => {
  it('resetAll zeroes aggregates after heavy play', () => {
    for (const id of GAME_IDS.slice(0, 8)) {
      play(id, ['win', 'loss'], 999);
    }
    expect(storage.getTotalGamesPlayed()).toBeGreaterThan(0);
    storage.resetAll();
    expect(storage.getTotalGamesPlayed()).toBe(0);
    expect(storage.getTotalPlayTime()).toBe(0);
    expect(storage.getOverallWinRate()).toBe(0);
    expect(storage.getAllGameStats()).toEqual({});
  });
});
