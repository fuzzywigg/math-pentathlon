/**
 * Wave 65 leftover after tip/#313 — Kings history panel shows moves. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 65 kings — tutorial history panel shows', () => {
  it('move history panel shows all moves', () => {
    const step = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'move-history');
    expect(step?.message).toMatch(/move history panel shows all moves/);
  });
});
