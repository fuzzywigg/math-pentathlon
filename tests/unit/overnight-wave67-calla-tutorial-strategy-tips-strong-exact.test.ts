/**
 * Wave 67 leftover after tip/#323/#324 — strategy Tips for winning strong.
 * Soft tutorial existed; lock exact leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Wave 67 calla — tutorial strategy tips strong exact', () => {
  it('strategy strong-marks Tips for winning', () => {
    const step = callaTutorial.steps.find((s) => s.id === 'strategy-tip');
    expect(step?.message).toContain('<strong>Tips for winning:</strong>');
  });
});
