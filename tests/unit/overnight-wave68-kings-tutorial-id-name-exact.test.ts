/**
 * Wave 68 leftover after tip/#336 — Kings tutorial id/name exact. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 68 kings — tutorial id name exact', () => {
  it('config locks id + name', () => {
    expect(kingsQuadraphagesTutorial.id).toBe('kings-quadraphages-basics');
    expect(kingsQuadraphagesTutorial.name).toBe('Learn Kings & Quadraphages');
    expect(kingsQuadraphagesTutorial.steps.length).toBeGreaterThanOrEqual(16);
  });
});
