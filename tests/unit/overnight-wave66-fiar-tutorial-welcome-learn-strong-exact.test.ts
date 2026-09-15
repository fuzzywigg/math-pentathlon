/**
 * Wave 66 leftover after tip/#316 — FIAR welcome Let\'s-learn strong exact.
 * Wave65 pins pathways + FIAR strong; deepen Let\'s learn paragraph leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fiarTutorial } from '../../src/games/fiar/tutorial';

describe('Wave 66 fiar — tutorial welcome learn strong exact', () => {
  it('welcome opens with Let\'s learn FIAR strong paragraph', () => {
    const step = fiarTutorial.steps.find((s) => s.id === 'welcome');
    expect(step?.message).toContain(
      "<p>Let's learn how to play <strong>FIAR (Four In A Row)</strong>!</p>"
    );
    expect(step?.title).toBe('Welcome to FIAR!');
  });
});
