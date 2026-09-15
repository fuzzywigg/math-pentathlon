/**
 * Wave 68 leftover after tip/#333 — skip opponent paren exact.
 * Soft tutorial existed; lock exact leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Wave 68 calla — tutorial skip opponent paren exact', () => {
  it('your-calla locks parenthetical skip fragment', () => {
    const step = callaTutorial.steps.find((s) => s.id === 'your-calla');
    expect(step?.message).toContain("(You skip over your opponent's Calla)");
  });
});
