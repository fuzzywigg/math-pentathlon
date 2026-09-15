/**
 * Wave 66 leftover after tip/#316 — Juggle welcome strong Juggle exact.
 * Soft Welcome title existed; lock strong tag leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

describe('Wave 66 juggle — tutorial welcome strong juggle', () => {
  it('welcome strong-marks Juggle in learn sentence', () => {
    const step = juggleTutorial.steps.find((s) => s.id === 'welcome');
    expect(step?.message).toContain(
      "Let's learn how to play <strong>Juggle</strong>!"
    );
  });
});
