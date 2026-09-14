/**
 * Wave 63 leftover after tip/#301 — Juggle strategy plan-ahead tip.
 * Complements Save small / Larger shapes leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

describe('Wave 63 juggle — tutorial strategy plan ahead', () => {
  it('locks Plan ahead to avoid getting stuck tip', () => {
    const step = juggleTutorial.steps.find((s) => s.id === 'strategy-tips');
    expect(step?.message).toContain('Plan ahead to avoid getting stuck');
  });
});
