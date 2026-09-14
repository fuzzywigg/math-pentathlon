/**
 * Overnight HEAVY leftovers after #236 — Contig enabled roll click leftover. Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { renderDice } from '../../src/games/contig-60/board-ui';

describe('Wave 53 contig — roll enabled click', () => {
  it('enables Roll Dice and invokes onRoll', () => {
    const onRoll = vi.fn();
    const el = renderDice(null, onRoll, true);
    const btn = el.querySelector('.contig-roll-btn') as HTMLButtonElement;
    expect(btn.disabled).toBe(false);
    expect(btn.textContent).toBe('Roll Dice');
    btn.click();
    expect(onRoll).toHaveBeenCalledTimes(1);
  });
});
