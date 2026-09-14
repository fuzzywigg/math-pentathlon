/**
 * Wave 39 — validateSolution exact + dice select → storage unlock/export.
 * Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  createTargetChallenge,
  validateSolution,
} from '../../src/core/expressions';
import { rollDice, selectDice, getSelectedTotal } from '../../src/core/dice';
import { storage } from '../../src/core/storage';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-09-14T12:00:00Z'));
  localStorage.clear();
  storage.resetAll();
  // Incremental RNG so die ids stay unique (rollDie uses Math.random for ids).
  let n = 0;
  vi.spyOn(Math, 'random').mockImplementation(() => {
    n += 1;
    return (n % 97) / 97;
  });
});

afterEach(() => {
  vi.useRealTimers();
  localStorage.clear();
  storage.resetAll();
  vi.restoreAllMocks();
});

describe('Wave 39 handshake — dice+expr → storage', () => {
  it('exact expr solution unlocks achievement and export round-trips', () => {
    const challenge = createTargetChallenge([2, 3, 4], 14, {
      useAllNumbers: true,
      useEachOnce: true,
    });
    // 2*3+4? = 10; 2+3*4 = 14
    expect(validateSolution('2+3*4', challenge)).toEqual({ valid: true });

    storage.recordGameResult({
      gameId: 'expression-demo',
      winner: 'player',
      playerWon: true,
      duration: 800,
      moveCount: 3,
      playedAt: Date.now(),
    });
    storage.unlockAchievement('expr-exact-14');
    expect(storage.hasAchievement('expr-exact-14')).toBe(true);
    expect(storage.getStreak().currentStreak).toBeGreaterThanOrEqual(1);

    const json = storage.exportData();
    storage.resetAll();
    expect(storage.hasAchievement('expr-exact-14')).toBe(false);
    expect(storage.importData(json)).toBe(true);
    expect(storage.hasAchievement('expr-exact-14')).toBe(true);
    expect(storage.getGameStats('expression-demo').gamesWon).toBe(1);
  });

  it('dice select total can pair with storage loss path', () => {
    let result = rollDice({ dice: ['d6', 'd6', 'd6'] });
    result = selectDice(
      result,
      [result.rolls[0].id, result.rolls[1].id],
      true
    );
    const sum = getSelectedTotal(result);
    expect(sum).toBe(result.rolls[0].value + result.rolls[1].value);

    storage.recordGameResult({
      gameId: 'dice-demo',
      winner: null,
      playerWon: false,
      duration: sum * 10,
      moveCount: 1,
      playedAt: Date.now(),
    });
    expect(storage.getGameStats('dice-demo').gamesLost).toBe(1);
  });
});
