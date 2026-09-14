/**
 * Wave 64 leftover after tip/#303 — Juggle turn-sequence Roll two dice.
 * Soft Turn Sequence title elsewhere; lock Roll step leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

describe('Wave 64 juggle — tutorial turn roll two', () => {
  it('locks Roll two dice step + dice-area highlight', () => {
    const step = juggleTutorial.steps.find((s) => s.id === 'turn-sequence');
    expect(step?.title).toBe('Turn Sequence');
    expect(step?.message).toContain('Roll two dice');
    expect(step?.highlightSelector).toBe('.juggle-dice-area');
    expect(step?.position).toBe('bottom');
  });
});
