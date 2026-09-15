/**
 * Wave 67 leftover after tip/#316 — FIAR winning form-4 li exact.
 * Wave63 Form 4 title soft; lock Form 4 chips pathway li leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fiarTutorial } from '../../src/games/fiar/tutorial';

describe('Wave 67 fiar — tutorial winning form4 li', () => {
  it('winning lists Form 4 chips along connected pathways', () => {
    const step = fiarTutorial.steps.find((s) => s.id === 'winning');
    expect(step?.message).toContain(
      'Form 4 chips in a row along connected pathways'
    );
  });
});
