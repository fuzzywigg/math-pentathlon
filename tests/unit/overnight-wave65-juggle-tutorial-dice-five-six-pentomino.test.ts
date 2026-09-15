/**
 * Wave 65 leftover after tip/#315 — Juggle dice-values 5-6 Pentomino markup.
 * Wave64 locked (N cells); deepen 5-6 strong leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

describe('Wave 65 juggle — tutorial dice five six pentomino', () => {
  it('locks 5-6 strong = Pentomino (5 cells) bullet', () => {
    const step = juggleTutorial.steps.find((s) => s.id === 'dice-values');
    expect(step?.message).toContain(
      '<strong>5-6</strong> = Pentomino (5 cells)'
    );
  });
});
