/**
 * Wave 65 leftover after tip/#313 — Hex strategy via two paths. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexTutorial } from '../../src/games/hex/tutorial';

describe('Wave 65 hex — tutorial strategy via two paths', () => {
  it('bridges connect via two paths', () => {
    const tips = hexTutorial.steps.find((s) => s.id === 'strategy-tips');
    expect(tips?.message).toMatch(/via two paths/);
  });
});
