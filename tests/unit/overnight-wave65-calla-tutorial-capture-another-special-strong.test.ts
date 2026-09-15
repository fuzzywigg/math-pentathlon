/**
 * Wave 65 leftover after tip/#315 — Calla capture Another special rule strong.
 * Wave62 soft Another special rule; lock strong tag. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Wave 65 calla — tutorial capture another special strong', () => {
  it('locks strong Another special rule', () => {
    const step = callaTutorial.steps.find((s) => s.id === 'capture');
    expect(step?.title).toBe('Capturing');
    expect(step?.message).toContain(
      '<strong>Another special rule:</strong>'
    );
  });
});
