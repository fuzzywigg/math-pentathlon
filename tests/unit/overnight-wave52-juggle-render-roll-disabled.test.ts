/**
 * Overnight HEAVY leftover after #234 — Juggle roll button disabled gate. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { renderDice } from '../../src/games/juggle/board-ui';

describe('Wave 52 juggle — roll disabled', () => {
  it('disables Roll Dice when canRoll is false', () => {
    const el = renderDice(null, () => undefined, () => undefined, false, 'rolling');
    const btn = el.querySelector('.juggle-roll-btn') as HTMLButtonElement;
    expect(btn).toBeTruthy();
    expect(btn.disabled).toBe(true);
  });
});
