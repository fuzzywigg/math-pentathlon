/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Frac Fact complete know-how copy.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fracFactTutorial } from '../../src/games/frac-fact/tutorial';

describe('Wave 56 frac tutorial — complete know-how', () => {
  it('complete message includes Now you know how leftover', () => {
    const step = fracFactTutorial.steps.find((s) => s.id === 'complete');
    expect(step?.message).toContain('Now you know how to play Frac Fact!');
  });
});
