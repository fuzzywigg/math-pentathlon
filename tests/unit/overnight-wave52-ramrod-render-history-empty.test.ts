/**
 * Overnight HEAVY leftover after #234 — Ramrod empty capture history chrome. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/ramrod/rules';
import { renderMoveHistory } from '../../src/games/ramrod/board-ui';

describe('Wave 52 ramrod — empty history', () => {
  it('shows Recent Captures title with zero move rows on opening', () => {
    const el = renderMoveHistory(createInitialState());
    expect(el.textContent).toMatch(/Recent Captures/);
    expect(el.querySelectorAll('.ramrod-history-move').length).toBe(0);
  });
});
