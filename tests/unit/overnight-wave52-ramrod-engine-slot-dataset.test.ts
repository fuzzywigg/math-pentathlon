/**
 * Overnight HEAVY leftover after #234 — Ramrod slot data-row/data-col residual. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/ramrod/rules';
import { renderBoard } from '../../src/games/ramrod/board-ui';

describe('Wave 52 ramrod — slot dataset', () => {
  it('tags slots with data-row and data-col', () => {
    const el = renderBoard(createInitialState(), () => undefined);
    const slots = el.querySelectorAll('.ramrod-slot');
    expect(slots.length).toBeGreaterThan(0);
    for (const slot of slots) {
      expect(slot.getAttribute('data-row')).toMatch(/^\d+$/);
      expect(slot.getAttribute('data-col')).toMatch(/^\d+$/);
    }
  });
});
