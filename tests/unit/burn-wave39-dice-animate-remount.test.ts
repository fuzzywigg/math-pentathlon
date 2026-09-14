/**
 * Wave 39 — animateRoll duration 0 / remount / missing onComplete.
 * Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { animateRoll, renderRollResult, rollDice } from '../../src/core/dice';

beforeEach(() => {
  vi.spyOn(Math, 'random').mockReturnValue(0.42);
});

afterEach(() => {
  document.body.innerHTML = '';
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('Wave 39 dice — animate remount', () => {
  it('duration 0 completes and paints final faces', async () => {
    vi.useFakeTimers();
    const el = document.createElement('div');
    document.body.appendChild(el);
    const result = rollDice({ dice: ['d6', 'd6'] });
    const done = vi.fn();
    animateRoll(el, result, { duration: 0, dieSize: 40, onComplete: done });
    await vi.advanceTimersByTimeAsync(100);
    expect(done).toHaveBeenCalledTimes(1);
    expect(el.classList.contains('rolling')).toBe(false);
    expect(el.querySelectorAll('.die-wrapper, svg').length).toBeGreaterThan(0);
  });

  it('missing onComplete still remounts via renderRollResult after animate', async () => {
    vi.useFakeTimers();
    const el = document.createElement('div');
    document.body.appendChild(el);
    const result = rollDice({ dice: ['d8'] });
    animateRoll(el, result, { duration: 50 });
    await vi.advanceTimersByTimeAsync(80);
    renderRollResult(result, el, { showTotal: true, dieSize: 32 });
    expect(el.querySelector('.dice-total')).toBeTruthy();
    expect(el.classList.contains('dice-roll-result')).toBe(true);
  });
});
