/**
 * Wave 67 leftover after tip/#316 — Sum strategy 7-common exact.
 * Soft Watch/high-pip existed; lock 7 most common + Strategy Tips. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { sumDominoesTutorial } from '../../src/games/sum-dominoes/tutorial';

describe('Wave 67 sum — tutorial seven common exact', () => {
  it('strategy-tips locks 7 most common dice sum exact', () => {
    const step = sumDominoesTutorial.steps.find((s) => s.id === 'strategy-tips');
    expect(step?.message).toContain('7 is the most common dice sum');
    expect(step?.title).toBe('Strategy Tips');
  });
});
