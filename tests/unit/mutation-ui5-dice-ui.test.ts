/**
 * q-mp-202 mutation audit UI wave 5 — kill survivors in core/dice/dice-ui.
 * Structural / flag pins only — no player-facing copy asserts.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  animateRoll,
  renderDie,
} from '../../src/core/dice/dice-ui';
import type { DieRoll, RollResult } from '../../src/core/dice/types';
import {
  resetSettingsFlagsForTests,
  setUserReducedMotionFlag,
} from '../../src/core/settings-flags';

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
  resetSettingsFlagsForTests();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('mutation-ui5 dice-ui', () => {
  beforeEach(() => {
    resetSettingsFlagsForTests();
  });

  it('user reduced-motion flag forces instant settle (no rolling chrome)', () => {
    // Survivor: L12 `return true` → false inside getUserReducedMotionFlag branch.
    setUserReducedMotionFlag(true);
    vi.useFakeTimers();
    const host = document.createElement('div');
    document.body.appendChild(host);
    const finalResult: RollResult = {
      id: 'rm',
      total: 4,
      rolls: [makeDie({ id: 'a', diceType: 'd6', value: 4 })],
    };
    const done = vi.fn();
    animateRoll(host, finalResult, { duration: 1000, onComplete: done });
    // Instant path: finish() before any timer; no .rolling class left.
    expect(host.classList.contains('rolling')).toBe(false);
    expect(done).toHaveBeenCalledTimes(1);
    expect(host.querySelectorAll('.die-wrapper.settled')).toHaveLength(0);
    expect(host.querySelectorAll('.die-wrapper')).toHaveLength(1);
  });

  it('matchMedia throw falls through to motion-on (catch returns false)', () => {
    // Survivor: L23 catch `return false` → true would force reduced-motion settle.
    setUserReducedMotionFlag(false);
    // jsdom may omit matchMedia — install a throwing stub the catch path exercises.
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: () => {
        throw new Error('matchMedia unavailable');
      },
    });
    vi.useFakeTimers();
    const host = document.createElement('div');
    document.body.appendChild(host);
    const finalResult: RollResult = {
      id: 'throw',
      total: 3,
      rolls: [makeDie({ id: 'b', diceType: 'd6', value: 3 })],
    };
    const done = vi.fn();
    animateRoll(host, finalResult, { duration: 200, onComplete: done });
    expect(host.classList.contains('rolling')).toBe(true);
    expect(done).not.toHaveBeenCalled();
    vi.advanceTimersByTime(250);
    expect(done).toHaveBeenCalledTimes(1);
  });

  it('d6 body rect uses exact x=5 (not 4 or 6)', () => {
    // Survivors: L85 NumericBoundary 5 → 4 / 5 → 6 on body rect x.
    const svg = renderDie(makeDie({ id: 'd6', diceType: 'd6', value: 1 }), 60);
    const body = svg.querySelector('rect');
    expect(body?.getAttribute('x')).toBe('5');
    expect(body?.getAttribute('y')).toBe('5');
  });
});
