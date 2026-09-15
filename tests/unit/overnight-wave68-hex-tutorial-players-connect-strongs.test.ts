/**
 * Wave 68 leftover after tip/#336 — Hex players Blue/Red connect strongs. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexTutorial } from '../../src/games/hex/tutorial';

describe('Wave 68 hex — tutorial players connect strongs', () => {
  it('players locks Blue top-bottom + Red left-right strongs', () => {
    const step = hexTutorial.steps.find((s) => s.id === 'players');
    expect(step?.message).toContain('<strong>Blue</strong> connects <strong>top to bottom</strong>');
    expect(step?.message).toContain('<strong>Red</strong> connects <strong>left to right</strong>');
    expect(step?.highlightSelector).toBe('.hex-legend');
  });
});
