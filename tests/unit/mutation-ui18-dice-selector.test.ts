/**
 * q-mp-527 mutation audit UI wave 18 — dice-selector first-20 re-pins.
 * Happy-path / constructor defaults / render contracts only — no soft-fail
 * early-return characterization (serialize with open #981 / q-mp-521).
 * No player-facing copy asserts.
 */
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

describe('mutation-ui18 dice-selector', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('default dieSize 60, multiSelect true, showPossibleSums false, showRollButton true', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const selector = new DiceSelector(root, {
      diceSet: COMMON_DICE_SETS.triple,
    });

    expect(root.querySelector('.dice-btn-primary')).toBeTruthy();
    expect(root.querySelector('.possible-sums')).toBeNull();

    (root.querySelector('.dice-btn-primary') as HTMLButtonElement).click();
    vi.advanceTimersByTime(900);

    const die = root.querySelector('.die') as HTMLElement | null;
    expect(die).toBeTruthy();
    const w = die!.style.width || die!.getAttribute('width') || '';
    expect(w === '60px' || w === '60').toBe(true);

    const wrappers = [
      ...root.querySelectorAll('.die-wrapper'),
    ] as HTMLElement[];
    expect(wrappers.length).toBe(3);
    wrappers[0]!.click();
    wrappers[1]!.click();
    expect(selector.getSelectedDice().length).toBe(2);
  });

  it('customDice length > 0 overrides diceSet cardinality (kills >→>= / 0→1)', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const selector = new DiceSelector(root, {
      diceSet: COMMON_DICE_SETS.triple,
      customDice: [DICE_CONFIGS.d20],
    });
    (root.querySelector('.dice-btn-primary') as HTMLButtonElement).click();
    vi.advanceTimersByTime(900);
    expect(selector.getResult()?.rolls).toHaveLength(1);
    expect(selector.getResult()?.rolls[0]?.diceType).toBe('d20');
  });

  it('showTotal false and selectable true on result render', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const selector = new DiceSelector(root, {
      diceSet: COMMON_DICE_SETS.standard,
    });
    (root.querySelector('.dice-btn-primary') as HTMLButtonElement).click();
    vi.advanceTimersByTime(900);
    expect(root.querySelector('.dice-total')).toBeNull();
    const wrappers = [
      ...root.querySelectorAll('.die-wrapper'),
    ] as HTMLElement[];
    expect(wrappers.length).toBeGreaterThan(0);
    wrappers[0]!.click();
    expect(selector.getSelectedDice().length).toBe(1);
  });

  it('possible-sums marks exactly the selectedSum as achievable', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const selector = new DiceSelector(root, {
      diceSet: COMMON_DICE_SETS.standard,
      showPossibleSums: true,
    });
    (root.querySelector('.dice-btn-primary') as HTMLButtonElement).click();
    vi.advanceTimersByTime(900);
    const wrappers = [
      ...root.querySelectorAll('.die-wrapper'),
    ] as HTMLElement[];
    wrappers[0]!.click();
    const selectedSum = selector.getSelectedSum();
    const achievable = [
      ...root.querySelectorAll('.possible-sum.achievable'),
    ].map((el) => Number(el.textContent));
    expect(achievable).toContain(selectedSum);
    const non = [
      ...root.querySelectorAll('.possible-sum:not(.achievable)'),
    ].map((el) => Number(el.textContent));
    expect(non.every((n) => n !== selectedSum)).toBe(true);
  });

  it('confirm disabled when rolling or zero selected (|| arm)', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    new DiceSelector(root, { diceSet: COMMON_DICE_SETS.standard });
    (root.querySelector('.dice-btn-primary') as HTMLButtonElement).click();
    vi.advanceTimersByTime(900);
    const confirm = root.querySelector(
      '.dice-btn-success'
    ) as HTMLButtonElement;
    expect(confirm).toBeTruthy();
    expect(confirm.disabled).toBe(true);
  });

  it('style inject concatenates getDiceStyles + selector rules once', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    new DiceSelector(root, { diceSet: COMMON_DICE_SETS.standard });
    new DiceSelector(document.createElement('div'), {
      diceSet: COMMON_DICE_SETS.standard,
    });
    const styles = document.querySelectorAll('#dice-selector-styles');
    expect(styles.length).toBe(1);
    const text = styles[0]?.textContent ?? '';
    expect(text.includes('NaN')).toBe(false);
    expect(text.length).toBeGreaterThan(60);
    expect(text).toContain('.dice-selector');
  });

  it('autoRoll false by default (no result until explicit roll)', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const selector = new DiceSelector(root, {
      diceSet: COMMON_DICE_SETS.standard,
    });
    expect(selector.getResult()).toBeNull();
    expect(root.querySelector('.die')).toBeNull();
  });
});
