/**
 * Wave 68 leftover after tip/#336 — Hex-a-Gone Pick 1 to 3 shapes strong. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexAGoneTutorial } from '../../src/games/hex-a-gone/tutorial';

describe('Wave 68 hexagone — tutorial pick 1 to 3', () => {
  it('turn-structure locks Pick 1 to 3 strong + Riskier', () => {
    const step = hexAGoneTutorial.steps.find((s) => s.id === 'turn-structure');
    expect(step?.message).toContain('<strong>Pick 1 to 3 shapes</strong>');
    expect(step?.message).toContain('they must be different!');
    expect(step?.message).toContain('More shapes = Riskier');
  });
});
