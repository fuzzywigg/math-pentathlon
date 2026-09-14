/**
 * Overnight TOKENMAXX HEAVY — dice selectDice empty-ids identity leftover.
 * After #214/#215. Tests-only. Not pinball/remainder/kings/queens/fab/UI.
 */
import { describe, it, expect } from 'vitest';
import { selectDice, toggleDiceSelection } from '../../src/core/dice/roller';
import type { RollResult } from '../../src/core/dice/types';

function fixture(): RollResult {
  return {
    id: 'r1',
    rolls: [
      {
        id: 'a',
        diceType: 'd6',
        value: 2,
        isSelected: true,
        isLocked: false,
        timestamp: 1,
      },
      {
        id: 'b',
        diceType: 'd6',
        value: 5,
        isSelected: false,
        isLocked: false,
        timestamp: 1,
      },
    ],
    total: 7,
  };
}

describe('Overnight dice — select empty ids identity', () => {
  it('selectDice([], true|false) leaves selection flags unchanged', () => {
    const base = fixture();
    const on = selectDice(base, [], true);
    const off = selectDice(base, [], false);
    expect(on.rolls.map((d) => d.isSelected)).toEqual([true, false]);
    expect(off.rolls.map((d) => d.isSelected)).toEqual([true, false]);
    expect(on.total).toBe(7);
  });

  it('toggleDiceSelection ghost id is a no-op', () => {
    const base = fixture();
    const next = toggleDiceSelection(base, 'missing');
    expect(next.rolls.map((d) => d.isSelected)).toEqual([true, false]);
    expect(next).not.toBe(base);
  });
});
