/**
 * Wave 65 leftover after tip/#315 — Juggle welcome strong-Juggle markup.
 * Wave63 locked fill-9x9; welcome strong-Juggle never locked. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

describe('Wave 65 juggle — tutorial welcome strong juggle', () => {
  it('locks Lets learn how to play strong-Juggle markup', () => {
    const step = juggleTutorial.steps.find((s) => s.id === 'welcome');
    expect(step?.title).toBe('Welcome to Juggle!');
    expect(step?.message).toContain(
      "Let's learn how to play <strong>Juggle</strong>!"
    );
  });
});
