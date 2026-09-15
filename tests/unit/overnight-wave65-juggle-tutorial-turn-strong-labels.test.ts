/**
 * Wave 65 leftover after tip/#315 — Juggle turn-sequence strong Roll/Choose/Select/Place.
 * Wave64 locked body copy; strong labels leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

describe('Wave 65 juggle — tutorial turn strong labels', () => {
  it('locks strong Roll/Choose/Select/Place labels', () => {
    const step = juggleTutorial.steps.find((s) => s.id === 'turn-sequence');
    expect(step?.title).toBe('Turn Sequence');
    expect(step?.message).toContain('<strong>Roll:</strong>');
    expect(step?.message).toContain('<strong>Choose:</strong>');
    expect(step?.message).toContain('<strong>Select:</strong>');
    expect(step?.message).toContain('<strong>Place:</strong>');
  });
});
