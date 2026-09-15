/**
 * Wave 65 leftover after tip/#315 — Juggle turn-sequence Select/Place strong.
 * Wave60 locked Roll/Choose; deepen Select/Place leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

describe('Wave 65 juggle — tutorial turn select place strong', () => {
  it('locks Select and Place strong step labels', () => {
    const step = juggleTutorial.steps.find((s) => s.id === 'turn-sequence');
    expect(step?.message).toContain('<strong>Select:</strong>');
    expect(step?.message).toContain('<strong>Place:</strong>');
  });
});
