/**
 * Wave 59 Contig/SD residual — Sum turn-sequence requiredAction gate. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { sumDominoesTutorial } from '../../src/games/sum-dominoes/tutorial';

describe('Wave 59 sum — turn-sequence gate', () => {
  it('requires click on .sd-roll-btn with dice-area highlight', () => {
    const step = sumDominoesTutorial.steps.find((s) => s.id === 'turn-sequence');
    expect(step?.requiredAction).toEqual({
      type: 'click',
      selector: '.sd-roll-btn',
    });
    expect(step?.highlightSelector).toBe('.sd-dice-area');
  });
});
