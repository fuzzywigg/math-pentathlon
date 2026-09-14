/**
 * Overnight HEAVY leftover after #241 — opening chip counts in scores. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, INITIAL_CHIPS_PER_PLAYER } from '../../src/games/remainder-islands/types';
import { renderScores } from '../../src/games/remainder-islands/board-ui';

describe('Wave 54 remainder — score chips', () => {
  it('both seats show opening chip stock', () => {
    const el = renderScores(createInitialState());
    const chips = [...el.querySelectorAll('.remainder-chips')].map((n) => n.textContent ?? '');
    expect(chips).toHaveLength(2);
    for (const t of chips) {
      expect(t).toContain(String(INITIAL_CHIPS_PER_PLAYER));
      expect(t).toContain('🪙');
    }
  });
});
