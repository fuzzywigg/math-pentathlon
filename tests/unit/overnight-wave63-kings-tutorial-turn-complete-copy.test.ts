/**
 * Wave 63 leftover after #301 — Kings turn-complete title + completed-your-turn. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 63 kings — tutorial turn-complete copy', () => {
  it('turn-complete title; You\'ve completed your turn', () => {
    const turn = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'turn-complete');
    expect(turn?.title).toBe('Turn Complete!');
    expect(turn?.message).toMatch(/You've completed your turn! Now it's Player 2's turn/);
    expect(turn?.position).toBe('center');
  });
});
