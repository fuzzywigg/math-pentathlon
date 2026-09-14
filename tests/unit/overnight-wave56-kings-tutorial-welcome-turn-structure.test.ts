/**
 * Wave 56 leftover after #256 — Kings tutorial welcome + turn-structure. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 56 kings — tutorial welcome/turn', () => {
  it('welcome title and two-part turn structure', () => {
    expect(kingsQuadraphagesTutorial.steps.find((s) => s.id === 'welcome')?.title).toBe(
      'Welcome to Kings & Quadraphages!'
    );
    const turn = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'turn-structure');
    expect(turn?.title).toBe('Turn Structure');
    expect(turn?.message).toMatch(/two parts/);
    expect(turn?.message).toMatch(/Move your King/);
    expect(turn?.message).toMatch(/Place a Quadraphage/);
  });
});
