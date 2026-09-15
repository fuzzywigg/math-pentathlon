/**
 * Wave 67 leftover after tip/#316 — Sum welcome learn paragraph exact.
 * Soft strong name existed; lock Let\'s learn Sum Dominoes paragraph. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { sumDominoesTutorial } from '../../src/games/sum-dominoes/tutorial';

describe('Wave 67 sum — tutorial welcome learn exact', () => {
  it('welcome locks Let\'s learn Sum Dominoes paragraph', () => {
    const step = sumDominoesTutorial.steps.find((s) => s.id === 'welcome');
    expect(step?.message).toContain(
      "Let's learn how to play <strong>Sum Dominoes & Dice</strong>!"
    );
    expect(step?.position).toBe('center');
  });
});
