/**
 * Wave 41 handshake — Contig roll phase × storage winRate.
 * Storage API already tested elsewhere; bridge only. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createInitialState } from '../../src/games/contig-60/types';
import { doRollDice, passTurn } from '../../src/games/contig-60/rules';
import { storage } from '../../src/core/storage';

beforeEach(() => {
  localStorage.clear();
  storage.resetAll();
});

afterEach(() => {
  localStorage.clear();
  storage.resetAll();
  vi.restoreAllMocks();
});

describe('Wave 41 handshake — contig × storage winRate', () => {
  it('contig roll advances phase; storage winRate tracks recorded result', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.4);
    expect(storage.getOverallWinRate()).toBe(0);

    let state = createInitialState();
    expect(state.phase).toBe('rolling');
    state = doRollDice(state);
    expect(state.phase).toBe('calculating');
    expect(state.currentDice).not.toBeNull();

    // Pass path keeps engine alive without RNG placement
    state = passTurn(state);
    expect(state.phase).toBe('rolling');

    storage.recordGameResult({
      gameId: 'contig-60',
      winner: 'player1',
      playerWon: true,
      duration: 12_000,
      moveCount: 4,
      playedAt: Date.now(),
    });
    expect(storage.getOverallWinRate()).toBe(1);
    expect(storage.getGameStats('contig-60').gamesWon).toBe(1);

    storage.recordGameResult({
      gameId: 'contig-60',
      winner: 'player2',
      playerWon: false,
      duration: 8_000,
      moveCount: 3,
      playedAt: Date.now(),
    });
    expect(storage.getOverallWinRate()).toBe(0.5);
  });
});
