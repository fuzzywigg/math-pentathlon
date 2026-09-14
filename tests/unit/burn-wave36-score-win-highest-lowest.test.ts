/**
 * Wave 36 — checkWinCondition highest/lowest return null (end-of-game only).
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createScoringState,
  addScore,
  checkWinCondition,
  calculateGameResult,
} from '../../src/core/timer-scoring';

describe('Wave 36 score-win — highest/lowest mid-game', () => {
  it('highest / lowest never auto-win via checkWinCondition', () => {
    let hi = createScoringState({ winCondition: { type: 'highest' } }, ['a', 'b']);
    hi = addScore(hi, 'a', 100);
    expect(checkWinCondition(hi)).toBeNull();

    let lo = createScoringState({ winCondition: { type: 'lowest' } }, ['a', 'b']);
    lo = addScore(lo, 'a', 1);
    lo = addScore(lo, 'b', 50);
    expect(checkWinCondition(lo)).toBeNull();
  });

  it('calculateGameResult still ranks lowest correctly', () => {
    let lo = createScoringState({ winCondition: { type: 'lowest' } }, ['a', 'b']);
    lo = addScore(lo, 'a', 3);
    lo = addScore(lo, 'b', 9);
    const result = calculateGameResult(lo, 500);
    expect(result.winnerId).toBe('a');
    expect(result.isTie).toBe(false);
  });
});
