/**
 * Wave 48 — Juggle renderDice chrome leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { renderDice } from '../../src/games/juggle/board-ui';

describe('Wave 48 juggle — renderDice', () => {
  it('renders dice chrome for selectingShape state', () => {
    const el = renderDice([3, 5], () => undefined, () => undefined, false, 'selectingShape');
    expect(el.className).toMatch(/juggle-dice/);
    expect(el.querySelectorAll('.juggle-die').length).toBe(2);
    expect(el.textContent).toMatch(/Tromino|Pentomino/);
  });
});
