/**
 * Wave 68 leftover after tip/#333 — your-calla drop cube exact.
 * Soft tutorial existed; lock exact leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Wave 68 calla — tutorial your calla drop cube exact', () => {
  it('your-calla locks drop-a-cube fragment', () => {
    const step = callaTutorial.steps.find((s) => s.id === 'your-calla');
    expect(step?.message).toContain('When passing YOUR Calla, you drop a cube in it too!');
  });
});
