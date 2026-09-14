/**
 * Overnight HEAVY leftover after #229 — Prime Gold dice faces hide roll CTA. Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { createInitialState } from '../../src/games/prime-gold/rules';
import { renderDice } from '../../src/games/prime-gold/board-ui';

describe('Wave 50 prime — dice faces placing', () => {
  it('shows die faces and omits roll button while placing', () => {
    const onRoll = vi.fn();
    const state = {
      ...createInitialState(),
      phase: 'placing' as const,
      diceRoll: { die1: 1, die2: 4, die3: 9 },
      currentPlayer: 'player2' as const,
    };
    const el = renderDice(state, onRoll);
    const faces = [...el.querySelectorAll('.pg-die')].map((d) => d.textContent);
    expect(faces).toEqual(['1', '4', '9']);
    expect(el.querySelector('.pg-roll-btn')).toBeNull();
    expect(el.textContent).toMatch(/Red's Turn/);
    expect(onRoll).not.toHaveBeenCalled();
  });
});
