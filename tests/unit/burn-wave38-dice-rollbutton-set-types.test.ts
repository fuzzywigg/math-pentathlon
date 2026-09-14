/**
 * Wave 38 — createRollButton label / set types / empty set leftovers.
 * Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { createRollButton } from '../../src/core/dice/dice-selector';
import { COMMON_DICE_SETS, type DiceSet } from '../../src/core/dice';

beforeEach(() => {
  document.body.innerHTML = '';
  let n = 0;
  vi.spyOn(Math, 'random').mockImplementation(() => {
    n += 1;
    return (n % 11) / 11;
  });
});

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Wave 38 dice-rollbutton — set types', () => {
  it('button label uses dice set name', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const btn = createRollButton(root, COMMON_DICE_SETS.standard, () => {});
    expect(btn.textContent).toBe(`Roll ${COMMON_DICE_SETS.standard.name}`);
  });

  it('click emits rolls matching set dice types', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const set = COMMON_DICE_SETS.standard;
    let captured: string[] = [];
    const btn = createRollButton(root, set, (result) => {
      captured = result.rolls.map((d) => d.diceType);
    });
    btn.click();
    expect(captured).toEqual(set.dice.map((c) => c.type));
  });

  it('empty dice set still creates a button and rolls empty', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const empty: DiceSet = { id: 'empty', name: 'Empty', dice: [] };
    let count = -1;
    const btn = createRollButton(root, empty, (result) => {
      count = result.rolls.length;
    });
    expect(btn.textContent).toBe('Roll Empty');
    btn.click();
    expect(count).toBe(0);
  });
});
