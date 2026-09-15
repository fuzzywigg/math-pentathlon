/**
 * Wave 67 leftover after tip/#323/#324 — capture empty YOUR side strong.
 * Soft tutorial existed; lock exact leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Wave 67 calla — tutorial capture empty your strong', () => {
  it('capture strong-marks empty pit on YOUR side', () => {
    const step = callaTutorial.steps.find((s) => s.id === 'capture');
    expect(step?.message).toContain('<strong>empty pit on YOUR side</strong>');
  });
});
