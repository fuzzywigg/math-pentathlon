/**
 * Wave 66 leftover after tip/#316 — Calla free-turn Special rule strong exact.
 * Soft last-cube fragment existed; lock strong label leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Wave 66 calla — tutorial free special rule strong', () => {
  it('free-turn opens with strong Special rule label', () => {
    const step = callaTutorial.steps.find((s) => s.id === 'free-turn');
    expect(step?.message).toContain('<strong>Special rule:</strong>');
    expect(step?.message).toContain('If your last cube lands in your Calla, you get another turn!');
  });
});
