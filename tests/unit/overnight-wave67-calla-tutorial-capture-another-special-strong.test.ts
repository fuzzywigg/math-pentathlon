/**
 * Wave 67 leftover after tip/#323/#324 — capture another special strong.
 * Soft tutorial existed; lock exact leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Wave 67 calla — tutorial capture another special strong', () => {
  it('capture strong-marks Another special rule', () => {
    const step = callaTutorial.steps.find((s) => s.id === 'capture');
    expect(step?.message).toContain('<strong>Another special rule:</strong>');
  });
});
