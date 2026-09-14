/**
 * Wave 40 — DiceSelector setDiceSet / destroy leftovers after #176.
 * Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';

import { DiceSelector, COMMON_DICE_SETS } from '../../src/core/dice';

describe('Wave 40 dice — selector setDiceSet / destroy', () => {
  let root: HTMLElement;

  beforeEach(() => {
    document.body.innerHTML = '';
    root = document.createElement('div');
    document.body.appendChild(root);
  });

  it('getSelectedSum is 0 before roll; setDiceSet resets header', () => {
    const sel = new DiceSelector(root, {
      diceSet: COMMON_DICE_SETS.standard,
      autoRoll: false,
    });
    expect(sel.getSelectedSum()).toBe(0);
    sel.setDiceSet(COMMON_DICE_SETS.polyhedral);
    expect(root.querySelector('.dice-selector-header')?.textContent).toContain(
      'Polyhedral'
    );
  });

  it('destroy clears container', () => {
    const sel = new DiceSelector(root, { autoRoll: false });
    expect(root.innerHTML.length).toBeGreaterThan(0);
    sel.destroy();
    expect(root.innerHTML).toBe('');
  });
});
