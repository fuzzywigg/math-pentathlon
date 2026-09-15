/**
 * Wave 67 leftover after tip/#316 — Juggle placement rotate/flip exact li.
 * Soft fit/overlap existed; lock rotate+flip exact li leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

describe('Wave 67 juggle — tutorial placement rotate exact', () => {
  it('placement-rules locks rotate/flip exact li', () => {
    const step = juggleTutorial.steps.find((s) => s.id === 'placement-rules');
    expect(step?.message).toContain(
      '<li>Shapes can be rotated and flipped</li>'
    );
  });
});
