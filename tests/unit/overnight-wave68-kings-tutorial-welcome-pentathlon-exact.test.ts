/**
 * Wave 68 leftover after tip/#334 — Kings welcome Math Pentathlon exact. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 68 kings — tutorial welcome pentathlon', () => {
  it('welcome locks Math Pentathlon + basics together exact', () => {
    const step = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'welcome');
    expect(step?.message).toContain('a strategic two-player game from Math Pentathlon');
    expect(step?.message).toContain("Let's learn the basics together!");
    expect(step?.title).toBe('Welcome to Kings & Quadraphages!');
    expect(step?.position).toBe('center');
  });
});
