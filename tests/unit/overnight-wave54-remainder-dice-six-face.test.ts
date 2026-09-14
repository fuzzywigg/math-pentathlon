/**
 * Overnight HEAVY leftover after #241 — die face 6 is ⚅ plus equals. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { renderDice } from '../../src/games/remainder-islands/board-ui';

describe('Wave 54 remainder — dice unicode 6', () => {
  it('die2=6 paints ⚅ and equals glyph', () => {
    const el = renderDice({ die1: 4, die2: 6, total: 10 });
    const faces = [...el.querySelectorAll('.die')].map((d) => d.textContent);
    expect(faces[1]).toBe('⚅');
    expect(el.querySelector('.dice-equals')?.textContent).toBe('=');
  });
});
