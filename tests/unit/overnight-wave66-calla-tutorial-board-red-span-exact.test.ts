/**
 * Wave 66 leftover after tip/#316 — Calla board Red pits span exact HTML.
 * Soft Red/#e53935 fragments existed; lock span leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Wave 66 calla — tutorial board red span exact', () => {
  it('board-intro uses exact Red pits color span', () => {
    const step = callaTutorial.steps.find((s) => s.id === 'board-intro');
    expect(step?.message).toContain(
      '<span style="color: #e53935">Red\'s pits</span> are on the bottom.'
    );
  });
});
