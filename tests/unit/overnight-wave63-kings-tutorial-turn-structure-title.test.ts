/**
 * Wave 63 leftover after #301 — Kings Turn Structure title + both-actions cue. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 63 kings — tutorial turn-structure title', () => {
  it('turn-structure title; You must complete both actions', () => {
    const turn = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'turn-structure');
    expect(turn?.title).toBe('Turn Structure');
    expect(turn?.message).toMatch(/You must complete both actions every turn/);
    expect(turn?.position).toBe('center');
  });
});
