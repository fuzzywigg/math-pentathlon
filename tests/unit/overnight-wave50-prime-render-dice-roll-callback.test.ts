/**
 * Overnight HEAVY leftover after #229 — Prime Gold roll button callback. Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { createInitialState } from '../../src/games/prime-gold/rules';
import { renderDice } from '../../src/games/prime-gold/board-ui';

describe('Wave 50 prime — roll callback', () => {
  it('Roll Dice click invokes onRoll', () => {
    const onRoll = vi.fn();
    const el = renderDice(createInitialState(), onRoll);
    (el.querySelector('.pg-roll-btn') as HTMLButtonElement).click();
    expect(onRoll).toHaveBeenCalledTimes(1);
  });
});
