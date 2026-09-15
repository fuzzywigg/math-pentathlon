/**
 * Wave 65 leftover after tip/#313 — Kings move one-square-down exact. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 65 kings — tutorial move one square down', () => {
  it('That moves your King one square down', () => {
    const step = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'move-king');
    expect(step?.message).toMatch(/That moves your King one square down/);
  });
});
