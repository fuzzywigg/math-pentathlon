/**
 * Wave 68 leftover after tip/#337 — Sum complete title exact.
 * Soft Finish/clear-hand exacts existed; lock Ready to Play title leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { sumDominoesTutorial } from '../../src/games/sum-dominoes/tutorial';

describe('Wave 68 sum — tutorial complete title', () => {
  it('locks Ready to Play title leftover', () => {
    const step = sumDominoesTutorial.steps.find((s) => s.id === 'complete');
    expect(step?.title).toBe('Ready to Play!');
    expect(step?.position).toBe('center');
  });
});
