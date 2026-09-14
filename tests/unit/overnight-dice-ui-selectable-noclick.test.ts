/**
 * Overnight TOKENMAXX HEAVY — renderRollResult selectable without onDieClick leftover.
 * After #214/#215. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { renderRollResult } from '../../src/core/dice/dice-ui';
import type { RollResult } from '../../src/core/dice/types';

const result: RollResult = {
  id: 'r',
  rolls: [
    {
      id: 'a',
      diceType: 'd6',
      value: 3,
      isSelected: false,
      isLocked: false,
      timestamp: 1,
    },
  ],
  total: 3,
};

describe('Overnight dice-ui — selectable without onDieClick', () => {
  it('selectable:true alone does not attach pointer cursor', () => {
    const el = document.createElement('div');
    renderRollResult(result, el, { selectable: true });
    const wrapper = el.querySelector('.die-wrapper') as HTMLElement;
    expect(wrapper).toBeTruthy();
    expect(wrapper.style.cursor).not.toBe('pointer');
  });

  it('selectable:true + onDieClick attaches cursor', () => {
    const el = document.createElement('div');
    renderRollResult(result, el, {
      selectable: true,
      onDieClick: () => {},
    });
    const wrapper = el.querySelector('.die-wrapper') as HTMLElement;
    expect(wrapper.style.cursor).toBe('pointer');
  });
});
