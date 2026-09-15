/**
 * Wave 65 leftover after tip/#315 — Juggle placement cannot-overlap tip.
 * Wave64 locked fit-entirely; deepen overlap leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

describe('Wave 65 juggle — tutorial placement cannot overlap', () => {
  it('locks cannot overlap with previously placed shapes tip', () => {
    const step = juggleTutorial.steps.find((s) => s.id === 'placement-rules');
    expect(step?.message).toContain(
      'Shapes cannot overlap with previously placed shapes'
    );
  });
});
