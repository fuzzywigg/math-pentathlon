/**
 * Overnight HEAVY leftover after #229 — Prime Gold dice null placeholders. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/prime-gold/rules';
import { renderDice } from '../../src/games/prime-gold/board-ui';

describe('Wave 50 prime — dice null', () => {
  it('shows three ? dice and Roll Dice in rolling phase', () => {
    const el = renderDice(createInitialState(), () => undefined);
    const dice = el.querySelectorAll('.pg-die');
    expect(dice.length).toBe(3);
    expect([...dice].every((d) => d.textContent === '?')).toBe(true);
    expect(el.querySelector('.pg-roll-btn')?.textContent).toBe('Roll Dice');
    expect(el.textContent).toMatch(/Blue's Turn/);
  });
});
