/**
 * Wave 63 leftover after tip/#301 — Juggle complete Finish CTA exact.
 * Distinct from know-how fragment. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

describe('Wave 63 juggle — tutorial complete finish fill', () => {
  it('locks Finish CTA + fill your grid fragment', () => {
    const step = juggleTutorial.steps.find((s) => s.id === 'complete');
    expect(step?.message).toContain(
      'Click <strong>Finish</strong> and fill your grid!'
    );
  });
});
