/**
 * Wave 66 leftover after tip/#316 — Juggle placement cannot-overlap exact li.
 * Soft cannot overlap existed; lock full li leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

describe('Wave 66 juggle — tutorial placement no overlap exact', () => {
  it('placement-rules lists cannot-overlap exact li', () => {
    const step = juggleTutorial.steps.find((s) => s.id === 'placement-rules');
    expect(step?.message).toContain(
      '<li>Shapes cannot overlap with previously placed shapes</li>'
    );
  });
});
