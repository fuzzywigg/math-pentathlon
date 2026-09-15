/**
 * Wave 65 leftover after tip/#313 — Hex-a-Gone shapes blue/green/orange. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexAGoneTutorial } from '../../src/games/hex-a-gone/tutorial';

describe('Wave 65 hexagone — tutorial shapes color rest', () => {
  it('Blue #4169E1 + Green #32CD32 + Orange #FF8C00', () => {
    const step = hexAGoneTutorial.steps.find((s) => s.id === 'shapes-intro');
    expect(step?.message).toContain('color: #4169E1');
    expect(step?.message).toContain('color: #32CD32');
    expect(step?.message).toContain('color: #FF8C00');
  });
});
