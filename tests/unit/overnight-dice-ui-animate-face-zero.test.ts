/**
 * Overnight TOKENMAXX HEAVY — animateRoll ceil(random*faces) mid-tick face-0 leftover.
 * Roller uses floor*faces+1; animate uses ceil → random===0 yields 0.
 * After #214/#215. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { animateRoll } from '../../src/core/dice/dice-ui';
import type { RollResult } from '../../src/core/dice/types';

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('Overnight dice-ui — animateRoll face-0 mid tick', () => {
  it('random===0 mid-tick can render face 0 on polyhedral before settle', () => {
    vi.useFakeTimers();
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const container = document.createElement('div');
    const finalResult: RollResult = {
      id: 'final',
      rolls: [
        {
          id: 'd',
          diceType: 'd8',
          value: 4,
          isSelected: false,
          isLocked: false,
          timestamp: 1,
        },
      ],
      total: 4,
    };
    animateRoll(container, finalResult, { duration: 200, dieSize: 40 });
    // Initial temp face uses ceil(0*8)=0 — polyhedral shows text
    expect(container.querySelector('.die-wrapper text')?.textContent).toBe('0');
    vi.advanceTimersByTime(250);
    expect(container.querySelector('.dice-total .total-value')?.textContent).toBe(
      '4'
    );
    expect(container.querySelector('.die-wrapper.settled')).toBeTruthy();
    expect(container.querySelector('.die-wrapper text')?.textContent).toBe('4');
  });
});
