/**
 * Overnight TOKENMAXX HEAVY — animateRoll always shows total leftover.
 * renderRollResult can hideTotal; animateRoll cannot.
 * After #214/#215. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { animateRoll, renderRollResult } from '../../src/core/dice/dice-ui';
import type { RollResult } from '../../src/core/dice/types';

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

const sample: RollResult = {
  id: 'r',
  rolls: [
    {
      id: 'a',
      diceType: 'd6',
      value: 2,
      isSelected: false,
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

describe('Overnight dice-ui — animate always appends total', () => {
  it('animateRoll settles with .dice-total even when render can hide it', () => {
    vi.useFakeTimers();
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const hide = document.createElement('div');
    renderRollResult(sample, hide, { showTotal: false });
    expect(hide.querySelector('.dice-total')).toBeNull();

    const anim = document.createElement('div');
    let done = false;
    animateRoll(anim, sample, {
      duration: 100,
      onComplete: () => {
        done = true;
      },
    });
    vi.advanceTimersByTime(200);
    expect(done).toBe(true);
    expect(anim.querySelector('.dice-total')).toBeTruthy();
    expect(anim.querySelector('.total-value')?.textContent).toBe('7');
  });
});
