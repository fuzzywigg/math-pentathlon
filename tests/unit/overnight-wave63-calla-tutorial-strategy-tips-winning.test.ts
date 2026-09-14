/**
 * Wave 63 leftover after tip/#301 — Calla strategy Tips for winning leftovers.
 * Wave59 locked Count ahead; deepen remaining tip bullets. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Wave 63 calla — tutorial strategy tips winning', () => {
  it('locks Tips for winning / capture / watch-opponent fragments', () => {
    const step = callaTutorial.steps.find((s) => s.id === 'strategy-tip');
    expect(step?.message).toContain('Tips for winning:');
    expect(step?.message).toContain('Look for capture opportunities');
    expect(step?.message).toContain("Watch your opponent's side too!");
  });
});
