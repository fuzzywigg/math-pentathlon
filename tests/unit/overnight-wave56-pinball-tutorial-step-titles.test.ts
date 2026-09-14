/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Pinball tutorial step titles.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fractionPinballTutorial } from '../../src/games/fraction-pinball/tutorial';

describe('Wave 56 pinball tutorial — step titles', () => {
  it('gameplay/scoring/winning titles exact leftover', () => {
    const byId = Object.fromEntries(
      fractionPinballTutorial.steps.map((s) => [s.id, s.title])
    );
    expect(byId.gameplay).toBe('Gameplay');
    expect(byId.scoring).toBe('Scoring');
    expect(byId.winning).toBe('Winning');
  });
});
