/**
 * Wave 57 leftover after #263 — Hex-a-Gone turn/select/place tutorial. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexAGoneTutorial } from '../../src/games/hex-a-gone/tutorial';

describe('Wave 57 hexagone — tutorial turn structure', () => {
  it('turn-structure Pick 1-3; select-shapes bank; place-shapes empty spaces', () => {
    const turn = hexAGoneTutorial.steps.find((s) => s.id === 'turn-structure');
    expect(turn?.message).toMatch(/Pick 1 to 3 shapes/);
    const select = hexAGoneTutorial.steps.find((s) => s.id === 'select-shapes');
    expect(select?.highlightSelector).toBe('.hex-a-gone-bank');
    const place = hexAGoneTutorial.steps.find((s) => s.id === 'place-shapes');
    expect(place?.message).toMatch(/empty spaces/);
  });
});
