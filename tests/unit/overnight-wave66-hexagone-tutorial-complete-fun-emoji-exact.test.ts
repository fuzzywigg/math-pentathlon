/**
 * Wave 66 leftover after tip/#316 — Hex-a-Gone complete Have fun emoji exact.
 * Soft standing/know; lock Have fun 🎨 leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexAGoneTutorial } from '../../src/games/hex-a-gone/tutorial';

describe('Wave 66 hexagone — tutorial complete fun emoji exact', () => {
  it('complete Have fun emoji + Finish strong exact', () => {
    const step = hexAGoneTutorial.steps.find((s) => s.id === 'complete');
    expect(step?.message).toContain('<p>Have fun! 🎨</p>');
    expect(step?.message).toContain('Click <strong>Finish</strong> and try to be the last player standing!');
  });
});
