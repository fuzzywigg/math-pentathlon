/**
 * Wave 34 — dice createInteractiveDie + renderRollResult selection leftovers.
 * Locked die has no click; selectable roll wires onDieClick. Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  createInteractiveDie,
  renderRollResult,
  type DieRoll,
  type RollResult,
} from '../../src/core/dice';

function makeDie(
  partial: Partial<DieRoll> & Pick<DieRoll, 'id' | 'diceType' | 'value'>
): DieRoll {
  return {
    isSelected: false,
    isLocked: false,
    timestamp: 1,
    ...partial,
  };
}

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Wave 34 dice-ui-interactive — lock / select / classes', () => {
  it('locked die is used, non-pointer, and ignores onClick', () => {
    const onClick = vi.fn();
    const el = createInteractiveDie(
      makeDie({ id: 'L', diceType: 'd8', value: 4, isLocked: true }),
      48,
      onClick
    );
    expect(el.classList.contains('used')).toBe(true);
    el.click();
    expect(onClick).not.toHaveBeenCalled();
  });

  it('selected die wrapper carries selected class and fires onClick', () => {
    const onClick = vi.fn();
    const die = makeDie({
      id: 'S',
      diceType: 'd6',
      value: 6,
      isSelected: true,
    });
    const el = createInteractiveDie(die, 50, onClick);
    expect(el.classList.contains('selected')).toBe(true);
    expect(el.style.cursor).toBe('pointer');
    el.click();
    expect(onClick).toHaveBeenCalledWith(die);
  });

  it('renderRollResult selectable wires clicks for each unlocked die', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const clicks: string[] = [];
    const result: RollResult = {
      id: 'r',
      total: 9,
      rolls: [
        makeDie({ id: 'a', diceType: 'd6', value: 3 }),
        makeDie({ id: 'b', diceType: 'd6', value: 6, isLocked: true }),
      ],
    };
    renderRollResult(result, host, {
      selectable: true,
      showTotal: false,
      onDieClick: (d) => clicks.push(d.id),
    });
    expect(host.querySelector('.dice-total')).toBeNull();
    const wrappers = [
      ...host.querySelectorAll('.die-wrapper'),
    ] as HTMLElement[];
    wrappers[0].click();
    wrappers[1].click();
    expect(clicks).toEqual(['a']);
  });
});
