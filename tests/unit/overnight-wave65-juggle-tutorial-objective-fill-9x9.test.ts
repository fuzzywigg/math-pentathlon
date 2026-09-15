/**
 * Wave 65 leftover after tip/#315 — Juggle objective fill-9x9 copy.
 * Soft welcome fill elsewhere; lock objective-step exact. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

describe('Wave 65 juggle — tutorial objective fill 9x9', () => {
  it('locks objective completely fill your 9x9 grid fragment', () => {
    const step = juggleTutorial.steps.find((s) => s.id === 'objective');
    expect(step?.title).toBe('Objective');
    expect(step?.message).toContain(
      'completely fill your 9x9 grid with polyomino shapes'
    );
  });
});
