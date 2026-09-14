/**
 * Wave 32 — animateRoll lifecycle + getDiceStyles CSS contract.
 * Deepens wave 22 animate/styles with fake-timer completion edges.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  animateRoll,
  getDiceStyles,
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
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('Wave 32 dice-ui-animate — animateRoll', () => {
  it('adds rolling class then settles with total + onComplete', async () => {
    vi.useFakeTimers();
    vi.spyOn(Math, 'random').mockReturnValue(0.6);

    const host = document.createElement('div');
    document.body.appendChild(host);
    const onComplete = vi.fn();
    const result: RollResult = {
      id: 'anim',
      total: 11,
      rolls: [
        makeDie({ id: 'x', diceType: 'd6', value: 5 }),
        makeDie({ id: 'y', diceType: 'd8', value: 6 }),
      ],
    };

    animateRoll(host, result, { duration: 200, dieSize: 40, onComplete });
    expect(host.classList.contains('rolling')).toBe(true);
    expect(host.querySelectorAll('.die-wrapper.rolling')).toHaveLength(2);

    await vi.advanceTimersByTimeAsync(250);
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(host.classList.contains('rolling')).toBe(false);
    expect(host.querySelectorAll('.die-wrapper.settled')).toHaveLength(2);
    expect(host.querySelector('.total-value')?.textContent).toBe('11');
  });

  it('empty rolls still complete and render total 0', async () => {
    vi.useFakeTimers();
    const host = document.createElement('div');
    document.body.appendChild(host);
    const onComplete = vi.fn();
    animateRoll(
      host,
      { id: 'empty', rolls: [], total: 0 },
      { duration: 100, onComplete }
    );
    await vi.advanceTimersByTimeAsync(150);
    expect(onComplete).toHaveBeenCalled();
    expect(host.querySelector('.total-value')?.textContent).toBe('0');
  });
});

describe('Wave 32 dice-ui-animate — getDiceStyles contract', () => {
  it('includes core selectors used by wrapper chrome', () => {
    const css = getDiceStyles();
    for (const needle of [
      '.dice-roll-result',
      '.dice-container',
      '.die-wrapper',
      '.die-wrapper.selected',
      '.die-wrapper.used',
      '.die-wrapper.rolling',
      '.die-wrapper.settled',
      '@keyframes dice-tumble',
      '@keyframes dice-bounce',
      '.dice-total',
      '.total-value',
    ]) {
      expect(css).toContain(needle);
    }
  });
});
