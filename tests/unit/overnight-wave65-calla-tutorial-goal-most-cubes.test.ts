/**
 * Wave 65 leftover after tip/#315 — Calla goal most-cubes-in-Calla copy.
 * Soft how-to-win elsewhere; lock most cubes strong-Calla. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Wave 65 calla — tutorial goal most cubes', () => {
  it('locks most cubes in your Calla strong markup', () => {
    const step = callaTutorial.steps.find((s) => s.id === 'goal');
    expect(step?.title).toBe('How to Win');
    expect(step?.message).toContain(
      'most cubes in your Calla</strong>'
    );
    expect(step?.message).toContain('all cubes are collected');
  });
});
