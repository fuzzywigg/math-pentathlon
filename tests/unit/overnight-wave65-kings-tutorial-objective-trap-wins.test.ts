/**
 * Wave 65 leftover after tip/#313 — Kings objective trap-wins exact. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 65 kings — tutorial objective trap wins', () => {
  it("player who traps the other's King wins", () => {
    const step = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'objective');
    expect(step?.message).toMatch(/The player who traps the other's King wins!/);
  });
});
