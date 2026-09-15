/**
 * Wave 68 leftover after tip/#336 — Hex-a-Gone complete last standing. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexAGoneTutorial } from '../../src/games/hex-a-gone/tutorial';

describe('Wave 68 hexagone — tutorial complete standing', () => {
  it('complete locks last player standing + Have fun', () => {
    const step = hexAGoneTutorial.steps.find((s) => s.id === 'complete');
    expect(step?.message).toContain('last player standing');
    expect(step?.message).toContain('Have fun! 🎨');
    expect(step?.message).toContain('<strong>Finish</strong>');
  });
});
