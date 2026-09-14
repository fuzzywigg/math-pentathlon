/**
 * Wave 56 leftover after #256 — Kings tutorial turn-structure + move-history. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 56 kings — tutorial turn/history', () => {
  it('two parts turn-structure; move-history highlights #move-history', () => {
    const turn = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'turn-structure');
    expect(turn?.message).toMatch(/two parts/);
    expect(turn?.message).toMatch(/Move your King/);
    expect(turn?.message).toMatch(/Place a Quadraphage/);
    const hist = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'move-history');
    expect(hist?.highlightSelector).toBe('#move-history');
    expect(hist?.title).toBe('Move History');
  });
});
