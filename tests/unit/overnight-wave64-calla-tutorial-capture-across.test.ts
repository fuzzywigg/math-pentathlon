/**
 * Wave 64 leftover after tip/#303 — Calla capture pit-across / ALL cubes.
 * Wave62 locked empty-pit / Another special rule; deepen capture leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Wave 64 calla — tutorial capture across', () => {
  it('locks pit across + capture ALL cubes fragments', () => {
    const step = callaTutorial.steps.find((s) => s.id === 'capture');
    expect(step?.title).toBe('Capturing');
    expect(step?.message).toContain('the pit across from it has cubes');
    expect(step?.message).toContain('You capture ALL those cubes into your Calla');
  });
});
