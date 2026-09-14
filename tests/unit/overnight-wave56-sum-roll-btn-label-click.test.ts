/**
 * Wave 56 leftover after #243 — Sum Dominoes roll label + click residual.
 * Disabled state covered in wave49; label/click was not. Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { renderDice } from '../../src/games/sum-dominoes/board-ui';

describe('Wave 56 sum — roll btn label click', () => {
  it('shows Roll Dice and fires onRoll once when enabled', () => {
    const onRoll = vi.fn();
    const el = renderDice(null, onRoll, true);
    const btn = el.querySelector('.sd-roll-btn') as HTMLButtonElement;
    expect(btn.textContent).toBe('Roll Dice');
    expect(btn.disabled).toBe(false);
    btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(onRoll).toHaveBeenCalledTimes(1);
  });
});
