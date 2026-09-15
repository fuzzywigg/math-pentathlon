/**
 * Wave 68 leftover after tip/#334 — Hex-a-Gone complete last-standing Finish exact. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexAGoneTutorial } from '../../src/games/hex-a-gone/tutorial';

describe('Wave 68 hexagone — tutorial complete standing', () => {
  it('complete locks Finish + last player standing exact', () => {
    const step = hexAGoneTutorial.steps.find((s) => s.id === 'complete');
    expect(step?.message).toContain(
      'Click <strong>Finish</strong> and try to be the last player standing!'
    );
    expect(step?.title).toBe('Ready to Play!');
  });
});
