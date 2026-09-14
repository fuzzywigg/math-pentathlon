/**
 * Wave 63 leftover after tip/#301 — Juggle complete "know how" exact.
 * Complements strategy/placement tutorial leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

describe('Wave 63 juggle — tutorial complete know', () => {
  it('locks Now you know how to play Juggle fragment', () => {
    const step = juggleTutorial.steps.find((s) => s.id === 'complete');
    expect(step?.message).toContain('Now you know how to play Juggle!');
    expect(step?.title).toBe('Ready to Play!');
    expect(step?.position).toBe('center');
  });
});
