/**
 * Wave 65 leftover after tip/#315 — Calla your-calla drop-cube clause.
 * Wave64 locked passing/score/opponent; deepen drop-cube leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Wave 65 calla — tutorial your calla drop cube', () => {
  it('locks drop a cube in it too fragment', () => {
    const step = callaTutorial.steps.find((s) => s.id === 'your-calla');
    expect(step?.message).toContain('drop a cube in it too');
    expect(step?.highlightSelector).toBe('.calla-store');
  });
});
