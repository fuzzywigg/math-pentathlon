/**
 * Wave 68 leftover after tip/#336 — Hex-a-Gone strategy awkward LIs. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexAGoneTutorial } from '../../src/games/hex-a-gone/tutorial';

describe('Wave 68 hexagone — tutorial strategy awkward', () => {
  it('strategy-tip locks Tips for winning + awkward/big/1-vs-3', () => {
    const step = hexAGoneTutorial.steps.find((s) => s.id === 'strategy-tip');
    expect(step?.message).toContain('<strong>Tips for winning:</strong>');
    expect(step?.message).toContain('awkward spaces for your opponent');
    expect(step?.message).toContain('Big shapes are hard to fit later!');
    expect(step?.message).toContain('placing 1 shape is smarter than 3');
  });
});
