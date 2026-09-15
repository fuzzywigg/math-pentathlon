/**
 * Wave 68 leftover after tip/#336 — Hex-a-Gone shapes color spans. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexAGoneTutorial } from '../../src/games/hex-a-gone/tutorial';

describe('Wave 68 hexagone — tutorial shapes color spans', () => {
  it('shapes-intro locks five color spans', () => {
    const step = hexAGoneTutorial.steps.find((s) => s.id === 'shapes-intro');
    expect(step?.message).toContain('style="color: #FFD700">● Yellow Hexagons</span>');
    expect(step?.message).toContain('style="color: #FF4444">● Red Trapezoids</span>');
    expect(step?.message).toContain('style="color: #4169E1">● Blue Rhombuses</span>');
    expect(step?.message).toContain('style="color: #32CD32">● Green Triangles</span>');
    expect(step?.message).toContain('style="color: #FF8C00">● Orange Squares</span>');
  });
});
