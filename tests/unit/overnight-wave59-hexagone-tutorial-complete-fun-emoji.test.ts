/**
 * Wave 59 leftover after #276 — Hex-a-Gone complete Have fun emoji. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexAGoneTutorial } from '../../src/games/hex-a-gone/tutorial';

describe('Wave 59 hexagone — tutorial complete fun', () => {
  it('complete Ready to Play!; Have fun emoji', () => {
    const complete = hexAGoneTutorial.steps.find((s) => s.id === 'complete');
    expect(complete?.title).toBe('Ready to Play!');
    expect(complete?.message).toMatch(/Have fun! 🎨/);
  });
});
