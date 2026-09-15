/**
 * Wave 68 leftover after tip/#333 — capture across has cubes.
 * Soft tutorial existed; lock exact leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Wave 68 calla — tutorial capture across has cubes', () => {
  it('capture locks across-has-cubes fragment', () => {
    const step = callaTutorial.steps.find((s) => s.id === 'capture');
    expect(step?.message).toContain('AND the pit across from it has cubes...');
  });
});
