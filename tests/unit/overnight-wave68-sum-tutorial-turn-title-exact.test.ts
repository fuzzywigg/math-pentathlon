/**
 * Wave 68 leftover after tip/#337 — Sum turn-sequence title exact.
 * Soft Roll Dice strong existed; lock Turn Sequence title leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { sumDominoesTutorial } from '../../src/games/sum-dominoes/tutorial';

describe('Wave 68 sum — tutorial turn title', () => {
  it('locks Turn Sequence title leftover', () => {
    const step = sumDominoesTutorial.steps.find((s) => s.id === 'turn-sequence');
    expect(step?.title).toBe('Turn Sequence');
    expect(step?.highlightSelector).toBe('.sd-dice-area');
  });
});
