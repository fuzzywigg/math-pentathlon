/**
 * Wave 48 — Juggle dice Roll disabled + selectable dies. Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { renderDice } from '../../src/games/juggle/board-ui';

describe('Wave 48 juggle — dice disabled selectable', () => {
  it('Roll button disabled when canRoll false', () => {
    const el = renderDice(null, () => undefined, () => undefined, false, 'rolling');
    const btn = el.querySelector('.juggle-roll-btn') as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });

  it('selectingShape marks dies selectable and shows hint', () => {
    const onSelect = vi.fn();
    const el = renderDice([3, 5], () => undefined, onSelect, false, 'selectingShape');
    expect(el.querySelectorAll('.juggle-die.selectable')).toHaveLength(2);
    expect(el.querySelector('.juggle-hint')!.textContent).toMatch(/Click a die/);
    (el.querySelector('.juggle-die') as HTMLElement).click();
    expect(onSelect).toHaveBeenCalledWith(0);
  });
});
