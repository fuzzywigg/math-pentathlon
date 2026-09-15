/**
 * Wave 67 leftover after tip/#324 — Hex-a-Gone turn Place them strong. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexAGoneTutorial } from '../../src/games/hex-a-gone/tutorial';

describe('Wave 67 hexagone — tutorial turn place strong', () => {
  it('turn-structure locks Place them strong + Riskier copy', () => {
    const step = hexAGoneTutorial.steps.find((s) => s.id === 'turn-structure');
    expect(step?.message).toContain('<strong>Place them</strong>');
    expect(step?.message).toContain(
      'More shapes = Riskier but fills the board faster!'
    );
    expect(step?.title).toBe('Your Turn');
  });
});
