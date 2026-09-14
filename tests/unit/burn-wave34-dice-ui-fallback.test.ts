/**
 * Wave 34 — dice-ui fallback shape + invalid pip + animate without callback.
 * Hits polyhedral default branch and D6_PIP_POSITIONS miss after wave 32.
 * Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  animateRoll,
  renderDie,
  DICE_CONFIGS,
  type DieRoll,
  type DiceType,
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

describe('Wave 34 dice-ui-fallback — invalid faces + unknown type', () => {
  it('d6 with out-of-range value renders body without pips', () => {
    const svg = renderDie(makeDie({ id: 'bad', diceType: 'd6', value: 99 }));
    expect(svg.querySelectorAll('circle').length).toBe(0);
    expect(svg.querySelector('rect')).toBeTruthy();
  });

  it('unknown diceType falls back to rounded square polyhedral body', () => {
    const key = 'd99' as DiceType;
    const configs = DICE_CONFIGS as Record<string, { type: string; faces: number; color: string }>;
    configs[key] = { type: key, faces: 99, color: '#123456' };
    try {
      const odd = renderDie(
        makeDie({
          id: 'odd',
          diceType: key,
          value: 3,
        })
      );
      expect(odd.querySelector('rect')).toBeTruthy();
      expect(odd.querySelector('polygon')).toBeNull();
      expect(odd.querySelector('text')?.textContent).toBe('3');
    } finally {
      delete configs[key];
    }
  });
});

describe('Wave 34 dice-ui-fallback — animateRoll without onComplete', () => {
  it('settles dice and total when callback omitted', async () => {
    vi.useFakeTimers();
    vi.spyOn(Math, 'random').mockReturnValue(0.4);
    const host = document.createElement('div');
    document.body.appendChild(host);
    const result: RollResult = {
      id: 'nocb',
      total: 7,
      rolls: [
        makeDie({ id: 'a', diceType: 'd6', value: 2 }),
        makeDie({ id: 'b', diceType: 'd6', value: 5 }),
      ],
    };
    animateRoll(host, result, { duration: 150, dieSize: 32 });
    await vi.advanceTimersByTimeAsync(200);
    expect(host.classList.contains('rolling')).toBe(false);
    expect(host.querySelectorAll('.die-wrapper.settled')).toHaveLength(2);
    expect(host.querySelector('.total-value')?.textContent).toBe('7');
  });
});
