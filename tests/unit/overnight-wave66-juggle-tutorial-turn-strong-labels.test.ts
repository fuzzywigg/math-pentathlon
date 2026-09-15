/**
 * Wave 66 leftover after tip/#316 — Juggle turn-sequence strong labels.
 * Soft Roll two dice existed; lock strong Roll/Choose/Select/Place leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

describe('Wave 66 juggle — tutorial turn strong labels', () => {
  it('turn-sequence strong-marks Roll/Choose/Select/Place', () => {
    const step = juggleTutorial.steps.find((s) => s.id === 'turn-sequence');
    expect(step?.message).toContain('<strong>Roll:</strong>');
    expect(step?.message).toContain('<strong>Choose:</strong>');
    expect(step?.message).toContain('<strong>Select:</strong>');
    expect(step?.message).toContain('<strong>Place:</strong>');
  });
});
