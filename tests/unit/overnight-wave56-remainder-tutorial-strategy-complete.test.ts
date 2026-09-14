/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Remainder tutorial strategy/complete. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { remainderIslandsTutorial } from '../../src/games/remainder-islands/tutorial';

describe('Wave 56 remainder — tutorial strategy complete', () => {
  it('strategy highest remainder + complete chase leftover', () => {
    const strategy = remainderIslandsTutorial.steps.find((s) => s.id === 'strategy-tips');
    expect(strategy?.message).toMatch(/highest remainder/);
    const complete = remainderIslandsTutorial.steps.find((s) => s.id === 'complete');
    expect(complete?.message).toMatch(/chase those remainders/);
  });
});
