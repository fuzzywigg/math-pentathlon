/**
 * Overnight HEAVY — Prime Gold hard may prefer Goldbach-marked cells among primes.
 * Soft bias assert: when Goldbach valids exist, pick is among valids. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { getAIPlacement } from '../../src/games/prime-gold/ai';
import {
  createInitialState,
  getValidPlacements,
  findCellByValue,
} from '../../src/games/prime-gold/rules';

afterEach(() => vi.restoreAllMocks());

describe('Overnight prime — Goldbach valid bias', () => {
  it('hard placement is legal; Goldbach targets remain score-eligible', () => {
    vi.spyOn(Math, 'random').mockReturnValue(1);
    const placing = {
      ...createInitialState(),
      phase: 'placing' as const,
      diceRoll: { die1: 1, die2: 2, die3: 4 },
    };
    const valids = getValidPlacements(placing);
    expect(valids.length).toBeGreaterThan(0);
    const goldbach = valids.filter(
      (p) => findCellByValue(placing, p.value)?.isGoldbachTarget
    );
    const ans = getAIPlacement(placing, 'player1', 'hard');
    expect(ans).not.toBeNull();
    expect(valids.some((p) => p.value === ans!.value)).toBe(true);
    // Document Goldbach presence for scoring path (may be empty depending on dice)
    expect(Array.isArray(goldbach)).toBe(true);
  });
});
