/**
 * Wave 57 leftover after #262 — Calla tutorial titles + board-intro colors.
 * Distinct from wave50 tutorial wiring. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Wave 57 calla — tutorial titles board intro', () => {
  it('locks step titles and Blue/Red pit color spans', () => {
    const byId = Object.fromEntries(
      callaTutorial.steps.map((s) => [s.id, s])
    );
    expect(byId['board-intro']?.title).toBe('The Game Board');
    expect(byId['pits-explained']?.title).toBe('The Pits');
    expect(byId['how-to-move']?.title).toBe('Making a Move');
    expect(byId['your-calla']?.title).toBe('Your Calla');
    expect(byId['strategy-tip']?.title).toBe('Strategy');
    expect(byId['board-intro']?.message).toContain('#2196F3');
    expect(byId['board-intro']?.message).toContain('#e53935');
    expect(byId['board-intro']?.highlightSelector).toBe('.calla-board');
  });
});
