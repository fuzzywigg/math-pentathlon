/**
 * Wave 67 leftover after tip/#324 — Sum matching connect exact li.
 * Soft /connect to an existing/ existed; lock full connect sentence. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { sumDominoesTutorial } from '../../src/games/sum-dominoes/tutorial';

describe('Wave 67 sum — tutorial matching connect exact', () => {
  it('locks must-connect exact li leftover', () => {
    const step = sumDominoesTutorial.steps.find((s) => s.id === 'matching-rules');
    expect(step?.message).toContain(
      'Your domino must connect to an existing domino on the board'
    );
    expect(step?.highlightSelector).toBe('.sd-board');
    expect(step?.position).toBe('top');
  });
});
