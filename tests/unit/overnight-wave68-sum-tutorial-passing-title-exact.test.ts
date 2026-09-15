/**
 * Wave 68 leftover after tip/#337 — Sum passing title exact.
 * Soft cannot-play/consec exacts existed; lock Passing title leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { sumDominoesTutorial } from '../../src/games/sum-dominoes/tutorial';

describe('Wave 68 sum — tutorial passing title', () => {
  it('locks Passing title + center leftover', () => {
    const step = sumDominoesTutorial.steps.find((s) => s.id === 'passing');
    expect(step?.title).toBe('Passing');
    expect(step?.position).toBe('center');
  });
});
