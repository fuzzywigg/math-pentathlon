/**
 * Wave 39 — checkForWinner / checkMoveForWin → storage.recordGameResult handshake.
 * No new scoring rules. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  checkForWinner,
  checkMoveForWin,
  createArrayGetter,
} from '../../src/core/alignment/grid-alignment';
import { storage, type GameResult } from '../../src/core/storage';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-09-14T12:00:00Z'));
  localStorage.clear();
  storage.resetAll();
});

afterEach(() => {
  vi.useRealTimers();
  localStorage.clear();
  storage.resetAll();
  vi.restoreAllMocks();
});

describe('Wave 39 handshake — alignment win → storage', () => {
  it('horizontal win records playerWon and unlocks achievement', () => {
    const board = [
      ['X', 'X', 'X', 'X'],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];
    const get = createArrayGetter(board);
    const config = { targetLength: 4, rows: 4, cols: 4 };
    const win = checkForWinner(get, config);
    expect(win.hasWinner).toBe(true);
    expect(win.winner).toBe('X');

    const result: GameResult = {
      gameId: 'alignment-demo',
      winner: 'X',
      playerWon: true,
      duration: 400,
      moveCount: 4,
      playedAt: Date.now(),
    };
    storage.recordGameResult(result);
    storage.unlockAchievement('align-first-win');

    expect(storage.getGameStats('alignment-demo').gamesWon).toBe(1);
    expect(storage.hasAchievement('align-first-win')).toBe(true);
    expect(storage.getOverallWinRate()).toBe(1);
  });

  it('checkMoveForWin miss does not inflate draws when recording loss', () => {
    const board = [
      ['X', 'O', null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];
    const get = createArrayGetter(board);
    const config = { targetLength: 4, rows: 4, cols: 4 };
    const miss = checkMoveForWin(0, 2, 'X', get, config);
    expect(miss.hasWinner).toBe(false);

    storage.recordGameResult({
      gameId: 'alignment-demo',
      winner: null,
      playerWon: false,
      duration: 200,
      moveCount: 2,
      playedAt: Date.now(),
    });
    const stats = storage.getGameStats('alignment-demo');
    expect(stats.gamesLost).toBe(1);
    expect(stats.gamesDraw).toBe(0);
    expect(stats.gamesWon).toBe(0);
  });
});
