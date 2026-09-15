/**
 * Wave 65 leftover after tip/#315 — Juggle welcome Let's learn strong Juggle.
 * Wave63 locked fill-9x9 / id; welcome strong leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

describe('Wave 65 juggle — tutorial welcome learn strong', () => {
  it('locks Let\'s learn how to play strong Juggle', () => {
    const step = juggleTutorial.steps.find((s) => s.id === 'welcome');
    expect(step?.title).toBe('Welcome to Juggle!');
    expect(step?.message).toContain(
      "Let's learn how to play <strong>Juggle</strong>!"
    );
  });
});
