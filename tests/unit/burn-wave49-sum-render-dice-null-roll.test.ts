/**
 * Wave 49 leftover after #221/#226/#227 — Sum Dominoes renderDice null roll. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { renderDice } from '../../src/games/sum-dominoes/board-ui';

describe('Wave 49 sum — dice null', () => {
  it('shows roll button when dice null', () => {
    const el = renderDice(null, () => undefined, true);
    expect(el.classList.contains('sd-dice-area')).toBe(true);
    const btn = el.querySelector('.sd-roll-btn') as HTMLButtonElement;
    expect(btn.disabled).toBe(false);
  });
});
