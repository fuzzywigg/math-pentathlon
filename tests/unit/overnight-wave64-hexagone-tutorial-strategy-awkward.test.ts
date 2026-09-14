/**
 * Wave 64 leftover after tip/#303 — Hex-a-Gone strategy awkward spaces. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexAGoneTutorial } from '../../src/games/hex-a-gone/tutorial';

describe('Wave 64 hexagone — tutorial strategy awkward', () => {
  it('leave awkward spaces; Tips for winning', () => {
    const tip = hexAGoneTutorial.steps.find((s) => s.id === 'strategy-tip');
    expect(tip?.message).toMatch(/leave awkward spaces for your opponent/);
    expect(tip?.message).toMatch(/Tips for winning/);
    expect(tip?.title).toBe('Strategy');
  });
});
