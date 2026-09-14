/**
 * Wave 39 — animateRoll empty rolls still completes after #172/#173.
 * Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { animateRoll, type RollResult } from '../../src/core/dice';

beforeEach(() => {
  document.body.innerHTML = '';
  vi.useFakeTimers();
});
afterEach(() => {
  document.body.innerHTML = '';
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('Wave 39 dice-ui — animate empty complete', () => {
  it('empty rolls fires onComplete and clears rolling class', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const onComplete = vi.fn();
    const empty: RollResult = { id: 'e', rolls: [], total: 0 };
    animateRoll(root, empty, { duration: 200, onComplete });
    expect(root.classList.contains('rolling')).toBe(true);
    vi.advanceTimersByTime(250);
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(root.classList.contains('rolling')).toBe(false);
    expect(root.querySelector('.total-value')?.textContent).toBe('0');
  });
});
