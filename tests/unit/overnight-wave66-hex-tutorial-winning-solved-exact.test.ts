/**
 * Wave 66 leftover after tip/#316 — Hex winning solved/no-draws exact.
 * Soft no draws; lock unbroken path + solved sentence leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexTutorial } from '../../src/games/hex/tutorial';

describe('Wave 66 hex — tutorial winning solved exact', () => {
  it('winning unbroken path + solved game no draws exact', () => {
    const step = hexTutorial.steps.find((s) => s.id === 'winning');
    expect(step?.title).toBe('Winning');
    expect(step?.message).toContain(
      'Create an unbroken path of your pieces connecting your two edges.'
    );
    expect(step?.message).toContain(
      'Hex is a solved game - there are no draws possible!'
    );
  });
});
