/**
 * Wave 59 leftover after #272 — Frac Fact welcome score paragraph.
 * Distinct from wave57 strong Frac Fact tag. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fracFactTutorial } from '../../src/games/frac-fact/tutorial';

describe('Wave 59 frac — tutorial welcome score p', () => {
  it('welcome includes score-more-points paragraph', () => {
    const step = fracFactTutorial.steps.find((s) => s.id === 'welcome');
    expect(step?.message).toContain(
      '<p>Score more points than your opponent by correctly solving fraction problems!</p>'
    );
  });
});
