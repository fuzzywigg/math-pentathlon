/**
 * Wave 59 leftover after #276 — Hex-a-Gone turn-structure riskier/different. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexAGoneTutorial } from '../../src/games/hex-a-gone/tutorial';

describe('Wave 59 hexagone — tutorial turn riskier', () => {
  it('turn-structure Your Turn; must be different; Riskier fills faster', () => {
    const turn = hexAGoneTutorial.steps.find((s) => s.id === 'turn-structure');
    expect(turn?.title).toBe('Your Turn');
    expect(turn?.message).toMatch(/they must be different/);
    expect(turn?.message).toMatch(/Riskier but fills the board faster/);
  });
});
