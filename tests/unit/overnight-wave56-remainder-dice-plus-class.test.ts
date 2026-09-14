/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Remainder dice-plus class. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { renderDice } from '../../src/games/remainder-islands/board-ui';

describe('Wave 56 remainder — dice plus class', () => {
  it('rolled dice mount .dice-plus + leftover', () => {
    const el = renderDice({ die1: 2, die2: 5, total: 7 });
    expect(el.querySelector('.dice-plus')?.textContent).toBe('+');
  });
});
