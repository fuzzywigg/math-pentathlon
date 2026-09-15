/**
 * Wave 65 leftover after tip/#315 — Calla free-turn Special-rule markup.
 * Wave64 locked plan/another-turn; deepen Special rule strong. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Wave 65 calla — tutorial free special rule markup', () => {
  it('locks Special rule strong markup', () => {
    const step = callaTutorial.steps.find((s) => s.id === 'free-turn');
    expect(step?.message).toContain('<strong>Special rule:</strong>');
    expect(step?.title).toBe('Free Turn!');
  });
});
