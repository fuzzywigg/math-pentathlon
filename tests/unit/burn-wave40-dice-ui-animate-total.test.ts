/**
 * Wave 40 — dice-ui renderRollResult remount/showTotal + animateRoll fake timers leftovers.
 * Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  renderRollResult,
  animateRoll,
  renderDie,
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

describe('Wave 40 dice-ui — animate + total remount', () => {
  it('renderRollResult remount clears prior content', () => {
    const host = document.createElement('div');
    host.innerHTML = '<span class="stale">old</span>';
    document.body.appendChild(host);
    const first: RollResult = {
      id: 'r1',
      total: 3,
      rolls: [makeDie({ id: 'a', diceType: 'd6', value: 3 })],
    };
    renderRollResult(first, host, { showTotal: true });
    expect(host.querySelector('.stale')).toBeNull();
    expect(host.querySelectorAll('.die-wrapper')).toHaveLength(1);
    expect(host.querySelector('.total-value')?.textContent).toBe('3');

    const second: RollResult = {
      id: 'r2',
      total: 11,
      rolls: [
        makeDie({ id: 'b', diceType: 'd6', value: 5 }),
        makeDie({ id: 'c', diceType: 'd6', value: 6 }),
      ],
    };
    renderRollResult(second, host, { showTotal: true });
    expect(host.querySelectorAll('.die-wrapper')).toHaveLength(2);
    expect(host.querySelector('.total-value')?.textContent).toBe('11');
  });

  it('showTotal false omits total chrome', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    renderRollResult(
      {
        id: 'nt',
        total: 9,
        rolls: [makeDie({ id: 'x', diceType: 'd6', value: 9 })],
      },
      host,
      { showTotal: false }
    );
    expect(host.querySelector('.dice-total')).toBeNull();
    expect(host.querySelector('.die-wrapper')).toBeTruthy();
  });

  it('animateRoll fake timers settle with total and onComplete', async () => {
    vi.useFakeTimers();
    vi.spyOn(Math, 'random').mockReturnValue(0.4);
    const host = document.createElement('div');
    document.body.appendChild(host);
    const onComplete = vi.fn();
    animateRoll(
      host,
      {
        id: 'anim',
        total: 7,
        rolls: [
          makeDie({ id: 'd1', diceType: 'd6', value: 3 }),
          makeDie({ id: 'd2', diceType: 'd6', value: 4 }),
        ],
      },
      { duration: 150, dieSize: 36, onComplete }
    );
    expect(host.classList.contains('rolling')).toBe(true);
    await vi.advanceTimersByTimeAsync(200);
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(host.classList.contains('rolling')).toBe(false);
    expect(host.querySelector('.total-value')?.textContent).toBe('7');
    expect(host.querySelectorAll('.die-wrapper.settled')).toHaveLength(2);
  });

  it('d10 and d20 use smaller font-size for values >= 10', () => {
    const d10 = renderDie(makeDie({ id: 't', diceType: 'd10', value: 10 }));
    const d20 = renderDie(makeDie({ id: 'v', diceType: 'd20', value: 20 }));
    expect(d10.querySelector('text')?.getAttribute('font-size')).toBe('28');
    expect(d20.querySelector('text')?.getAttribute('font-size')).toBe('28');
    expect(d10.classList.contains('die-d10')).toBe(true);
    expect(d20.classList.contains('die-d20')).toBe(true);
  });

  it('d10 single-digit uses larger font', () => {
    const d10 = renderDie(makeDie({ id: 's', diceType: 'd10', value: 3 }));
    expect(d10.querySelector('text')?.getAttribute('font-size')).toBe('36');
  });
});
