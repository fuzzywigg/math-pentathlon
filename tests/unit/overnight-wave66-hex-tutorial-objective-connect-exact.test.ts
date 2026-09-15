/**
 * Wave 66 leftover after tip/#316 — Hex objective connect sides exact.
 * Soft welcome chain; lock objective p leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexTutorial } from '../../src/games/hex/tutorial';

describe('Wave 66 hex — tutorial objective connect exact', () => {
  it('objective connect opposite sides unbroken chain p exact', () => {
    const step = hexTutorial.steps.find((s) => s.id === 'objective');
    expect(step?.title).toBe('Objective');
    expect(step?.message).toContain(
      '<p>Connect your two opposite sides of the board with an unbroken chain of your pieces.</p>'
    );
    expect(step?.position).toBe('center');
  });
});
