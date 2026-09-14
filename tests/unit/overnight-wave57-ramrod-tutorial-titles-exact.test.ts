/**
 * Wave 57 leftover after #262 — Ramrod tutorial step titles exact.
 * Distinct from wave56 id catalog. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { ramrodTutorial } from '../../src/games/ramrod/tutorial';

describe('Wave 57 ramrod — tutorial titles exact', () => {
  it('locks all step titles in order', () => {
    expect(ramrodTutorial.steps.map((s) => s.title)).toEqual([
      'Welcome to Ramrod!',
      'Objective',
      'Cuisenaire Rods',
      'Turn Sequence',
      'Capturing Rules',
      'Winning',
      'Strategy Tips',
      'Ready to Play!',
    ]);
  });
});
