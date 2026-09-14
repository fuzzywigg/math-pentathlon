/**
 * Wave 55 leftover after #250 — Juggle renderDice placing has no selectable hint.
 * Distinct from wave48 selectingShape selectable leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { renderDice } from '../../src/games/juggle/board-ui';

describe('Wave 55 juggle — dice placing chrome', () => {
  it('shows faces without selectable class or click-a-die hint', () => {
    const el = renderDice([2, 5], () => undefined, () => undefined, false, 'placing');
    expect(el.querySelectorAll('.juggle-die').length).toBe(2);
    expect(el.querySelectorAll('.juggle-die.selectable').length).toBe(0);
    expect(el.querySelector('.juggle-hint')).toBeNull();
  });
});
