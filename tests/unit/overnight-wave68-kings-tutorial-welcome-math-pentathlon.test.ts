/**
 * Wave 68 leftover after tip/#336 — Kings welcome Math Pentathlon exact. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 68 kings — tutorial welcome Math Pentathlon', () => {
  it('welcome locks Math Pentathlon + basics together', () => {
    const step = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'welcome');
    expect(step?.message).toContain('Math Pentathlon');
    expect(step?.message).toContain('learn the basics together');
    expect(step?.title).toBe('Welcome to Kings & Quadraphages!');
  });
});
