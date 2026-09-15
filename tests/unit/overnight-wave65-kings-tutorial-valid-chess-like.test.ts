/**
 * Wave 65 leftover after tip/#313 — Kings valid moves chess-like. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 65 kings — tutorial valid chess-like', () => {
  it('Kings move like in chess', () => {
    const step = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'valid-moves');
    expect(step?.message).toMatch(/Kings move like in chess/);
  });
});
