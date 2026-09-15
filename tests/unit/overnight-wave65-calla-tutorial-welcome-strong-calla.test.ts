/**
 * Wave 65 leftover after tip/#315 — Calla welcome strong-Calla markup.
 * Wave63 soft fun-counting; lock strong markup leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Wave 65 calla — tutorial welcome strong calla', () => {
  it('locks Lets learn how to play strong-Calla markup', () => {
    const step = callaTutorial.steps.find((s) => s.id === 'welcome');
    expect(step?.title).toBe('Welcome to Calla!');
    expect(step?.message).toContain(
      "Let's learn how to play <strong>Calla</strong>!"
    );
  });
});
