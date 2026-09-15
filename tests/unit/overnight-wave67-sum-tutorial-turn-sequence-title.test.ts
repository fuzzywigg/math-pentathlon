/**
 * Wave 67 leftover after tip/#316 — Sum Turn Sequence title exact.
 * Soft Roll/Select strongs existed; lock title + dice highlight leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { sumDominoesTutorial } from '../../src/games/sum-dominoes/tutorial';

describe('Wave 67 sum — tutorial turn sequence title', () => {
  it('turn-sequence locks Turn Sequence title leftover', () => {
    const step = sumDominoesTutorial.steps.find((s) => s.id === 'turn-sequence');
    expect(step?.title).toBe('Turn Sequence');
    expect(step?.highlightSelector).toBe('.sd-dice-area');
    expect(step?.position).toBe('bottom');
  });
});
