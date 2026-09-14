/**
 * Overnight HEAVY leftover after #241 — die face 1 is ⚀. Tests-only.
 * Distinct from wave48 faces 2/5 + oob ?.
 */
import { describe, it, expect } from 'vitest';
import { renderDice } from '../../src/games/remainder-islands/board-ui';

describe('Wave 54 remainder — dice unicode 1', () => {
  it('die1=1 paints ⚀', () => {
    const el = renderDice({ die1: 1, die2: 3, total: 4 });
    const faces = [...el.querySelectorAll('.die')].map((d) => d.textContent);
    expect(faces[0]).toBe('⚀');
    expect(faces[1]).toBe('⚂');
  });
});
