import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DiceSelector } from '../../src/core/dice/dice-selector';
import { COMMON_DICE_SETS, DICE_CONFIGS } from '../../src/core/dice/types';

afterEach(() => {
  document.body.innerHTML = '';
  document
    .querySelectorAll('#dice-selector-styles')
    .forEach((el) => el.remove());
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('mutation-ui2 dice-selector defaults + render pins', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('defaults multiSelect true and showPossibleSums false', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const selector = new DiceSelector(root, {
      diceSet: COMMON_DICE_SETS.triple,
    });
    (root.querySelector('.dice-btn-primary') as HTMLButtonElement).click();
    vi.advanceTimersByTime(900);

    expect(root.querySelector('.possible-sums')).toBeNull();

    const wrappers = [...root.querySelectorAll('.die-wrapper')] as HTMLElement[];
    expect(wrappers.length).toBe(3);
    wrappers[0]!.click();
    wrappers[1]!.click();
    // multiSelect default true → two selected (not single-select)
    expect(selector.getSelectedDice().length).toBe(2);
  });

  it('default dieSize is exactly 60', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    new DiceSelector(root, { diceSet: COMMON_DICE_SETS.standard });
    (root.querySelector('.dice-btn-primary') as HTMLButtonElement).click();
    vi.advanceTimersByTime(900);
    const die = root.querySelector('.die') as HTMLElement | null;
    expect(die).toBeTruthy();
    // dice-ui sets width/height style from dieSize
    const w = die!.style.width || die!.getAttribute('width') || '';
    const h = die!.style.height || die!.getAttribute('height') || '';
    expect(w === '60px' || w === '60' || die!.style.width === '60px').toBe(true);
    expect(h === '60px' || h === '60' || die!.style.height === '60px').toBe(true);
  });

  it('customDice length > 0 (exactly one) overrides diceSet types', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const selector = new DiceSelector(root, {
      diceSet: COMMON_DICE_SETS.triple, // 3 dice
      customDice: [DICE_CONFIGS.d20],
    });
    (root.querySelector('.dice-btn-primary') as HTMLButtonElement).click();
    vi.advanceTimersByTime(900);
    expect(selector.getResult()?.rolls).toHaveLength(1);
    expect(selector.getResult()?.rolls[0]?.diceType).toBe('d20');
  });

  it('showTotal stays false on result render (no total chrome by default)', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    new DiceSelector(root, { diceSet: COMMON_DICE_SETS.standard });
    (root.querySelector('.dice-btn-primary') as HTMLButtonElement).click();
    vi.advanceTimersByTime(900);
    expect(root.querySelector('.dice-total')).toBeNull();
  });

  it('possible-sums marks achievable when sum === selectedSum', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const selector = new DiceSelector(root, {
      diceSet: COMMON_DICE_SETS.standard,
      showPossibleSums: true,
    });
    (root.querySelector('.dice-btn-primary') as HTMLButtonElement).click();
    vi.advanceTimersByTime(900);
    const wrappers = [...root.querySelectorAll('.die-wrapper')] as HTMLElement[];
    wrappers[0]!.click();
    const selectedSum = selector.getSelectedSum();
    const achievable = [
      ...root.querySelectorAll('.possible-sum.achievable'),
    ].map((el) => Number(el.textContent));
    expect(achievable).toContain(selectedSum);
    const non = [...root.querySelectorAll('.possible-sum:not(.achievable)')].map(
      (el) => Number(el.textContent)
    );
    expect(non.every((n) => n !== selectedSum)).toBe(true);
  });

  it('injected styles concatenate getDiceStyles + selector rules', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    new DiceSelector(root, { diceSet: COMMON_DICE_SETS.standard });
    const style = document.getElementById(
      'dice-selector-styles'
    ) as HTMLStyleElement;
    expect(style).toBeTruthy();
    expect(style.textContent).toContain('.dice-selector');
    // Must be a non-empty string join (not NaN from + → -)
    expect(style.textContent?.includes('NaN')).toBe(false);
    expect((style.textContent ?? '').length).toBeGreaterThan(60);
  });
});
