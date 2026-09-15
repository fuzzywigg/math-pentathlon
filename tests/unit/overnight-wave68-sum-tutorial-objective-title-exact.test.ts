/**
 * Wave 68 leftover after tip/#337 — Sum objective title exact.
 * Soft rid-of-dominoes copy existed; lock Objective title leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { sumDominoesTutorial } from '../../src/games/sum-dominoes/tutorial';

describe('Wave 68 sum — tutorial objective title', () => {
  it('locks Objective title + center leftover', () => {
    const step = sumDominoesTutorial.steps.find((s) => s.id === 'objective');
    expect(step?.title).toBe('Objective');
    expect(step?.position).toBe('center');
  });
});
