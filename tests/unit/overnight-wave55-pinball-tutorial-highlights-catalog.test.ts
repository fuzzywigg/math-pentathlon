/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — Pinball tutorial highlight selectors leftover.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fractionPinballTutorial } from '../../src/games/fraction-pinball/tutorial';

describe('Wave 55 pinball tutorial — highlights', () => {
  it('pins gameplay/scoring/winning highlight leftovers', () => {
    const byId = Object.fromEntries(
      fractionPinballTutorial.steps.map((s) => [s.id, s])
    );
    expect(byId.gameplay.highlightSelector).toBe('.pinball-challenge');
    expect(byId.gameplay.position).toBe('bottom');
    expect(byId.scoring.highlightSelector).toBe('.pinball-board');
    expect(byId.scoring.position).toBe('top');
    expect(byId.winning.highlightSelector).toBe('.pinball-scores');
    expect(byId.complete.title).toBe('Ready to Play!');
    expect(byId.complete.message).toMatch(/hit those targets/i);
  });
});
