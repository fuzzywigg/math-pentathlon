/**
 * Wave 67 leftover after tip/#324 — Sum setup starting-center exact li.
 * Soft /starting domino/ existed; lock full center sentence. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { sumDominoesTutorial } from '../../src/games/sum-dominoes/tutorial';

describe('Wave 67 sum — tutorial setup starting center exact', () => {
  it('locks starting domino center exact li', () => {
    const step = sumDominoesTutorial.steps.find((s) => s.id === 'setup');
    expect(step?.message).toContain(
      'A starting domino is placed in the center of the board'
    );
    expect(step?.highlightSelector).toBe('.sd-board');
  });
});
