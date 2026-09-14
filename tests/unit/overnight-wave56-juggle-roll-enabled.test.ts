/**
 * Wave 56 leftover after #256 — Juggle roll button enabled when canRoll.
 * Distinct from wave52 disabled leftover. Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { renderDice } from '../../src/games/juggle/board-ui';

describe('Wave 56 juggle — roll enabled', () => {
  it('enables Roll Dice and fires onRoll when canRoll', () => {
    const onRoll = vi.fn();
    const el = renderDice(null, onRoll, () => undefined, true, 'rolling');
    const btn = el.querySelector('.juggle-roll-btn') as HTMLButtonElement;
    expect(btn.disabled).toBe(false);
    expect(btn.textContent).toBe('Roll Dice');
    btn.click();
    expect(onRoll).toHaveBeenCalledTimes(1);
  });
});
