/**
 * Wave 55 leftover after #250 — Stars tutorial id/name + scoring/examples/strategy/complete. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { starsBarsTutorial } from '../../src/games/stars-bars/tutorial';

describe('Wave 55 stars — tutorial catalog', () => {
  it('locks identity and copy needles', () => {
    expect(starsBarsTutorial.id).toBe('stars-bars-basics');
    expect(starsBarsTutorial.name).toBe('Learn Stars & Bars');
    expect(starsBarsTutorial.steps.find((s) => s.id === 'complete')?.message).toMatch(
      /aim for 30/
    );
    const scoring = starsBarsTutorial.steps.find((s) => s.id === 'scoring');
    expect(scoring?.message).toMatch(/Star cells double your points/);
    expect(scoring?.message).toMatch(/8 directions/);
    expect(scoring?.highlightSelector).toBe('.stars-board');
    const examples = starsBarsTutorial.steps.find((s) => s.id === 'examples');
    expect(examples?.message).toMatch(/Same shape, same color/);
    expect(examples?.message).toMatch(/All 4 attributes different = 4 points/);
    expect(starsBarsTutorial.steps.find((s) => s.id === 'strategy-tips')?.message).toMatch(
      /Maximize differences/
    );
  });
});
