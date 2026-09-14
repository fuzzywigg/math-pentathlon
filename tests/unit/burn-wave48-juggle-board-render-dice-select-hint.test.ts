/**
 * Wave 48 — Juggle renderDice selectingShape selectable + hint. Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { renderDice } from '../../src/games/juggle/board-ui';

describe('Wave 48 juggle — renderDice selecting', () => {
  it('marks dice selectable and fires onSelectDie', () => {
    const onSelect = vi.fn();
    const el = renderDice([2, 5], () => undefined, onSelect, false, 'selectingShape');
    expect(el.querySelectorAll('.juggle-die.selectable').length).toBe(2);
    expect(el.querySelector('.juggle-hint')?.textContent).toMatch(/Click a die/i);
    (el.querySelectorAll('.juggle-die.selectable')[1] as HTMLElement).click();
    expect(onSelect).toHaveBeenCalledWith(1);
  });
});
