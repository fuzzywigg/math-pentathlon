/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Frac Fact tutorial Scoring title.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fracFactTutorial } from '../../src/games/frac-fact/tutorial';

describe('Wave 56 frac tutorial — Scoring title', () => {
  it('scoring step title is exact Scoring leftover', () => {
    const step = fracFactTutorial.steps.find((s) => s.id === 'scoring');
    expect(step?.title).toBe('Scoring');
  });
});
