/**
 * Wave 48 — Juggle renderDice null shows roll CTA. Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { renderDice } from '../../src/games/juggle/board-ui';

describe('Wave 48 juggle — renderDice null', () => {
  it('shows enabled/disabled roll button when dice null', () => {
    const onRoll = vi.fn();
    const el = renderDice(null, onRoll, () => undefined, true, 'rolling');
    const btn = el.querySelector('.juggle-roll-btn') as HTMLButtonElement;
    expect(btn).toBeTruthy();
    expect(btn.disabled).toBe(false);
    btn.click();
    expect(onRoll).toHaveBeenCalled();
    const disabled = renderDice(null, () => undefined, () => undefined, false, 'rolling');
    expect((disabled.querySelector('.juggle-roll-btn') as HTMLButtonElement).disabled).toBe(true);
  });
});
