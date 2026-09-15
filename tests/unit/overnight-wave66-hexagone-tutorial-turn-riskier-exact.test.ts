/**
 * Wave 66 leftover after tip/#316 — Hex-a-Gone turn riskier exact.
 * Soft Pick 1 to 3; lock Riskier sentence + ol leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexAGoneTutorial } from '../../src/games/hex-a-gone/tutorial';

describe('Wave 66 hexagone — tutorial turn riskier exact', () => {
  it('turn-structure Pick 1-3 + Riskier fills faster exact', () => {
    const step = hexAGoneTutorial.steps.find((s) => s.id === 'turn-structure');
    expect(step?.title).toBe('Your Turn');
    expect(step?.message).toContain(
      '<li><strong>Pick 1 to 3 shapes</strong> (they must be different!)</li>'
    );
    expect(step?.message).toContain(
      '<p>More shapes = Riskier but fills the board faster!</p>'
    );
  });
});
