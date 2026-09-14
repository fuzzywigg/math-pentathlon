/**
 * Wave 49 leftover after #221/#226/#227 — Contig renderDice null shows roll. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { renderDice } from '../../src/games/contig-60/board-ui';

describe('Wave 49 contig — renderDice null', () => {
  it('shows enabled roll button when canRoll', () => {
    let rolled = false;
    const el = renderDice(null, () => { rolled = true; }, true);
    expect(el.classList.contains('contig-dice-area')).toBe(true);
    const btn = el.querySelector('.contig-roll-btn') as HTMLButtonElement;
    expect(btn).toBeTruthy();
    expect(btn.disabled).toBe(false);
    btn.click();
    expect(rolled).toBe(true);
  });
});
