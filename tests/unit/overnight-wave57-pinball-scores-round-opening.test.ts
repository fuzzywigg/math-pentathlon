/**
 * Overnight TOKENMAXX HEAVY leftovers after #260 — Pinball opening round 1/max leftover.
 * Wave54 asserted Round label; opening 1/10 value deepen. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, MAX_ROUNDS } from '../../src/games/fraction-pinball/types';
import { renderScores } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 57 pinball scores — round opening', () => {
  it('shows 1/MAX_ROUNDS leftover at start', () => {
    const el = renderScores(createInitialState());
    expect(el.querySelector('.pinball-round-value')?.textContent).toBe(
      `1/${MAX_ROUNDS}`
    );
  });
});
