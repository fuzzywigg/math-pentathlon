/**
 * Wave 55 leftover after #250 — Kings tutorial id/name + objective copy. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 55 kings — tutorial identity', () => {
  it('catalog id/name and trap-the-King objective', () => {
    expect(kingsQuadraphagesTutorial.id).toBe('kings-quadraphages-basics');
    expect(kingsQuadraphagesTutorial.name).toBe('Learn Kings & Quadraphages');
    const step = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'objective');
    expect(step?.message).toMatch(/trap your opponent's King/);
    expect(step?.message).toMatch(/cannot move/);
  });
});
