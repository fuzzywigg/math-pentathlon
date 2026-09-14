/**
 * Wave 64 leftover after tip/#303 — Hex-a-Gone place After selecting exact. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexAGoneTutorial } from '../../src/games/hex-a-gone/tutorial';

describe('Wave 64 hexagone — tutorial place after selecting', () => {
  it('After selecting, click on the board to place each shape', () => {
    const place = hexAGoneTutorial.steps.find((s) => s.id === 'place-shapes');
    expect(place?.message).toMatch(/After selecting, click on the board to place each shape/);
    expect(place?.title).toBe('Placing Shapes');
  });
});
