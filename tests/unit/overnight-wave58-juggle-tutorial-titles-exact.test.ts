/**
 * Wave 58 leftover after #262 (retry #273 RED) — Juggle tutorial step titles exact.
 * Distinct from wave56 id catalog + Finish fragments. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

describe('Wave 58 juggle — tutorial titles exact', () => {
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
