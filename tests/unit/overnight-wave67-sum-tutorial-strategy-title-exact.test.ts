/**
 * Wave 67 leftover after tip/#324 — Sum strategy tips title exact.
 * Soft high-pip / seven-common body existed; lock Strategy Tips title. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { sumDominoesTutorial } from '../../src/games/sum-dominoes/tutorial';

describe('Wave 67 sum — tutorial strategy title', () => {
  it('pins Strategy Tips title + center leftover', () => {
    const step = sumDominoesTutorial.steps.find((s) => s.id === 'strategy-tips');
    expect(step?.title).toBe('Strategy Tips');
    expect(step?.position).toBe('center');
  });
});
