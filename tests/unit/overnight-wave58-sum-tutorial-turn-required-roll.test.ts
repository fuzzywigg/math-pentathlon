/**
 * Wave 58 leftover after #275 — Sum tutorial turn required roll. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { sumDominoesTutorial } from '../../src/games/sum-dominoes/tutorial';

describe('Wave 58 sum — tutorial turn required roll', () => {
  it('pins leftover', () => {
    const byId = Object.fromEntries(sumDominoesTutorial.steps.map((s) => [s.id, s]));
    expect(byId['turn-sequence']?.requiredAction).toEqual({
      type: 'click',
      selector: '.sd-roll-btn',
    });
    expect(byId['turn-sequence']?.highlightSelector).toBe('.sd-dice-area');
  });
});
