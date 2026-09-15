/**
 * Wave 65 leftover after tip/#313 — Kings welcome Math Pentathlon. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 65 kings — tutorial welcome Math Pentathlon', () => {
  it('Math Pentathlon in welcome', () => {
    const step = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'welcome');
    expect(step?.message).toMatch(/Math Pentathlon/);
  });
});
