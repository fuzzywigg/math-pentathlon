/**
 * Wave 65 leftover after tip/#315 — Juggle placement rotated-flipped exact.
 * Wave59 soft rotated and flipped; lock Shapes can be prefix. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

describe('Wave 65 juggle — tutorial placement rotated flipped exact', () => {
  it('locks Shapes can be rotated and flipped tip', () => {
    const step = juggleTutorial.steps.find((s) => s.id === 'placement-rules');
    expect(step?.message).toContain('Shapes can be rotated and flipped');
  });
});
