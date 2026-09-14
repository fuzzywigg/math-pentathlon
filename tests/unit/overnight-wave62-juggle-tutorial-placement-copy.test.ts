/**
 * Wave 62 leftover after #293 — Juggle placement-rules tutorial body leftovers.
 * Distinct from wave59 position/highlight and wave56 9x9 welcome. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

describe('Wave 62 juggle — tutorial placement copy', () => {
  it('locks rotate/flip / fit entirely / cannot overlap fragments', () => {
    const step = juggleTutorial.steps.find((s) => s.id === 'placement-rules');
    expect(step?.message).toContain('rotated and flipped');
    expect(step?.message).toContain('fit entirely within your 9x9 grid');
    expect(step?.message).toContain(
      'cannot overlap with previously placed shapes'
    );
  });
});
