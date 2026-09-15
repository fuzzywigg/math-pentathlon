/**
 * Wave 65 leftover after tip/#313 — Hex winning connecting edges. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexTutorial } from '../../src/games/hex/tutorial';

describe('Wave 65 hex — tutorial winning connecting edges', () => {
  it('connecting your two edges', () => {
    const step = hexTutorial.steps.find((s) => s.id === 'winning');
    expect(step?.message).toMatch(/connecting your two edges/);
  });
});
