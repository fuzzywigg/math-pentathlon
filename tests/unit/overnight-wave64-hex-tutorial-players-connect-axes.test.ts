/**
 * Wave 64 leftover after tip/#303 — Hex players connect axes HTML exact. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexTutorial } from '../../src/games/hex/tutorial';

describe('Wave 64 hex — tutorial players connect axes', () => {
  it('Blue top-to-bottom; Red left-to-right strong tags', () => {
    const players = hexTutorial.steps.find((s) => s.id === 'players');
    expect(players?.title).toBe('Players');
    expect(players?.message).toContain('<strong>Blue</strong> connects <strong>top to bottom</strong>');
    expect(players?.message).toContain('<strong>Red</strong> connects <strong>left to right</strong>');
    expect(players?.highlightSelector).toBe('.hex-legend');
  });
});
