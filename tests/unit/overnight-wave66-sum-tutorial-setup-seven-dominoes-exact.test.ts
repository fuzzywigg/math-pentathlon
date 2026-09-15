/**
 * Wave 66 leftover after tip/#316 — Sum setup seven-dominoes exact.
 * Soft starting-domino center existed; lock receives 7 exact li. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { sumDominoesTutorial } from '../../src/games/sum-dominoes/tutorial';

describe('Wave 66 sum — tutorial setup seven dominoes', () => {
  it('setup locks Each player receives 7 dominoes exact', () => {
    const step = sumDominoesTutorial.steps.find((s) => s.id === 'setup');
    expect(step?.message).toContain('Each player receives 7 dominoes');
    expect(step?.highlightSelector).toBe('.sd-board');
    expect(step?.position).toBe('bottom');
  });
});
