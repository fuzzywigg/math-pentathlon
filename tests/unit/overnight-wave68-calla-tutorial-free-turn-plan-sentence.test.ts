/**
 * Wave 68 leftover after tip/#333 — free-turn plan sentence exact.
 * Soft tutorial existed; lock exact leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Wave 68 calla — tutorial free turn plan sentence', () => {
  it('free-turn locks Try to plan moves sentence', () => {
    const step = callaTutorial.steps.find((s) => s.id === 'free-turn');
    expect(step?.message).toContain('Try to plan moves that land in your Calla!');
  });
});
