/**
 * Wave 59 leftover after #281 — Sum opening Roll Dice button label.
 * Distinct from dice = 7 leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { renderDice } from '../../src/games/sum-dominoes/board-ui';

describe('Wave 59 sum — Roll Dice label', () => {
  it('null dice exposes enabled Roll Dice', () => {
    const el = renderDice(null, () => undefined, true);
    const btn = el.querySelector('.sd-roll-btn') as HTMLButtonElement;
    expect(btn.textContent).toBe('Roll Dice');
    expect(btn.disabled).toBe(false);
  });
});
