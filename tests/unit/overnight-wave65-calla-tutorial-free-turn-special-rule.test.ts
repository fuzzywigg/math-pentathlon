/**
 * Wave 65 leftover after tip/#315 — Calla free-turn Special rule strong.
 * Wave62 locked capture Another special; free-turn Special rule soft. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Wave 65 calla — tutorial free-turn special rule', () => {
  it('locks strong Special rule on free-turn step', () => {
    const step = callaTutorial.steps.find((s) => s.id === 'free-turn');
    expect(step?.title).toBe('Free Turn!');
    expect(step?.message).toContain('<strong>Special rule:</strong>');
  });
});
