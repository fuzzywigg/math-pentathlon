/**
 * Wave 65 leftover after tip/#315 — Calla welcome Let's learn strong Calla.
 * Contig/sum/fab locked this pattern; calla welcome still soft. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Wave 65 calla — tutorial welcome learn strong', () => {
  it('locks Let\'s learn how to play strong Calla', () => {
    const step = callaTutorial.steps.find((s) => s.id === 'welcome');
    expect(step?.title).toBe('Welcome to Calla!');
    expect(step?.message).toContain(
      "Let's learn how to play <strong>Calla</strong>!"
    );
  });
});
