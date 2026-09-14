/**
 * Wave 65 leftover after tip/#305 — FIAR winning diagonal axes exact.
 * Soft axes coverage; lock horizontal/vertical/diagonal li leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fiarTutorial } from '../../src/games/fiar/tutorial';

describe('Wave 65 fiar — tutorial winning diagonal exact', () => {
  it('winning lists horizontal vertical or diagonal rows', () => {
    const step = fiarTutorial.steps.find((s) => s.id === 'winning');
    expect(step?.message).toContain(
      '<li>Rows can be horizontal, vertical, or diagonal</li>'
    );
  });
});
