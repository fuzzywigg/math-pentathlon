/**
 * Wave 56 leftover after #256 — Juggle renderDice selectingShape hint exact copy.
 * Distinct from wave55 placing-no-hint leftover. Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { renderDice } from '../../src/games/juggle/board-ui';

describe('Wave 56 juggle — selectingShape die hint', () => {
  it('marks dice selectable with exact click-a-die hint and fires onSelectDie', () => {
    const onSelect = vi.fn();
    const el = renderDice([3, 6], () => undefined, onSelect, false, 'selectingShape');
    const dice = el.querySelectorAll('.juggle-die.selectable');
    expect(dice.length).toBe(2);
    expect(el.querySelector('.juggle-hint')?.textContent).toBe(
      'Click a die to choose that shape category'
    );
    (dice[1] as HTMLElement).click();
    expect(onSelect).toHaveBeenCalledWith(1);
  });
});
