/**
 * Wave 66 leftover after tip/#316 — Kings welcome Math Pentathlon exact.
 * Soft strategic intro; lock full welcome p leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 66 kings — tutorial welcome pentathlon exact', () => {
  it('welcome mentions Math Pentathlon + basics together p', () => {
    const step = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'welcome');
    expect(step?.message).toContain(
      'a strategic two-player game from Math Pentathlon.</p>'
    );
    expect(step?.message).toContain(
      "<p>Let's learn the basics together!</p>"
    );
  });
});
