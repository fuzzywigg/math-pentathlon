/**
 * Wave 48 — Remainder renderDice faces + total. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { renderDice } from '../../src/games/remainder-islands/board-ui';

describe('Wave 48 remainder — dice faces', () => {
  it('renders faces and total for in-range roll', () => {
    const el = renderDice({ die1: 2, die2: 5, total: 7 });
    expect(el.querySelector('.dice-total')?.textContent).toBe('7');
    expect(el.querySelectorAll('.die').length).toBe(2);
    expect(el.textContent).toContain('+');
  });
  it('oob face falls back to ?', () => {
    const el = renderDice({ die1: 9, die2: 1, total: 10 });
    expect(el.textContent).toContain('?');
  });
});
