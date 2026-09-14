/**
 * Wave 57 leftover after #262 — Juggle tutorial step titles exact.
 * Distinct from wave56 id catalog + Finish fragments. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

describe('Wave 57 juggle — tutorial titles exact', () => {
  it('locks all step titles in order', () => {
    expect(juggleTutorial.steps.map((s) => s.title)).toEqual([
      'Welcome to Juggle!',
      'Objective',
      'Turn Sequence',
      'Dice Values',
      'Placement Rules',
      'Strategy Tips',
      'Ready to Play!',
    ]);
  });
});
