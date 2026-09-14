/**
 * Wave 64 leftover after tip/#303 — Calla free-turn another-turn / plan copy.
 * Wave62 locked lands-in-Calla; deepen plan-moves leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Wave 64 calla — tutorial free-turn plan', () => {
  it('locks another turn + plan moves that land fragments', () => {
    const step = callaTutorial.steps.find((s) => s.id === 'free-turn');
    expect(step?.title).toBe('Free Turn!');
    expect(step?.message).toContain('you get another turn');
    expect(step?.message).toContain('plan moves that land in your Calla');
  });
});
