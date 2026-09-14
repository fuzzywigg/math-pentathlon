/**
 * Wave 59 leftover after #281 — Prime Roll Dice chrome + getPlayerName.
 * Distinct from Blue's Turn / ? dice leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/prime-gold/rules';
import { getPlayerName, renderDice } from '../../src/games/prime-gold/board-ui';

describe('Wave 59 prime — Roll Dice + getPlayerName', () => {
  it('opening shows Roll Dice; getPlayerName Blue/Red', () => {
    const el = renderDice(createInitialState(), () => undefined);
    expect(el.querySelector('.pg-roll-btn')?.textContent).toBe('Roll Dice');
    expect(getPlayerName('player1')).toBe('Blue');
    expect(getPlayerName('player2')).toBe('Red');
  });
});
