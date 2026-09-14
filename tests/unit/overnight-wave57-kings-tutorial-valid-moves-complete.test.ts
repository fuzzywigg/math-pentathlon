/**
 * Wave 57 leftover after #263 — Kings valid-moves / turn-complete / complete. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 57 kings — tutorial mid/end', () => {
  it('valid-moves green; turn-complete P2; complete title', () => {
    const valid = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'valid-moves');
    expect(valid?.message).toMatch(/green highlighted/);
    const turn = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'turn-complete');
    expect(turn?.message).toMatch(/Player 2's turn/);
    const done = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'complete');
    expect(done?.title).toBe('Tutorial Complete!');
  });
});
