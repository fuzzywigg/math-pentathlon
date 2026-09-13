/**
 * Wave 22 — DiceSelector / createRollButton / COMMON_DICE_SETS / getDiceConfig.
 * Distinct from wave 14 roller math and wave 20 controller mode matrix.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest';

import {
  DiceSelector,
  createRollButton,
} from '../../src/core/dice/dice-selector';
import {
  COMMON_DICE_SETS,
  DICE_CONFIGS,
  DICE_FACES,
} from '../../src/core/dice/types';
import { getDiceConfig } from '../../src/core/dice/roller';

afterEach(() => {
  document.body.innerHTML = '';
  document
    .querySelectorAll('#dice-selector-styles')
    .forEach((el) => el.remove());
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('Wave 22 dice-selector — configs + sets', () => {
  it('getDiceConfig and DICE_FACES agree with DICE_CONFIGS', () => {
    for (const type of Object.keys(DICE_CONFIGS) as Array<
      keyof typeof DICE_CONFIGS
    >) {
      const cfg = getDiceConfig(type);
      expect(cfg).toEqual(DICE_CONFIGS[type]);
      expect(cfg.faces).toBe(DICE_FACES[type]);
      expect(cfg.color).toBeTruthy();
    }
  });

  it('COMMON_DICE_SETS ids/lengths stay stable for game catalogs', () => {
    expect(COMMON_DICE_SETS.standard.id).toBe('standard');
    expect(COMMON_DICE_SETS.standard.dice).toHaveLength(2);
    expect(COMMON_DICE_SETS.triple.dice).toHaveLength(3);
    expect(COMMON_DICE_SETS.polyhedral.dice.map((d) => d.type)).toEqual([
      'd4',
      'd6',
      'd8',
      'd10',
      'd12',
      'd20',
    ]);
    expect(COMMON_DICE_SETS.primeGold.id).toBe('primeGold');
    expect(COMMON_DICE_SETS.primeGold.dice).toHaveLength(3);
    expect(COMMON_DICE_SETS.primeGold.dice.map((d) => d.type)).toEqual([
      'd6',
      'd8',
      'd10',
    ]);
  });
});

describe('Wave 22 dice-selector — DiceSelector lifecycle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('mounts header/placeholder, rolls, confirms selection, resets, destroys', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const onRollComplete = vi.fn();
    const onConfirm = vi.fn();
    const onSelectionChange = vi.fn();

    const selector = new DiceSelector(root, {
      diceSet: COMMON_DICE_SETS.standard,
      multiSelect: true,
      showPossibleSums: true,
      onRollComplete,
      onConfirm,
      onSelectionChange,
    });

    expect(root.classList.contains('dice-selector')).toBe(true);
    expect(root.querySelector('.dice-selector-header')?.textContent).toBe(
      COMMON_DICE_SETS.standard.name
    );
    expect(root.querySelector('.dice-placeholder')).toBeTruthy();
    expect(document.querySelectorAll('#dice-selector-styles')).toHaveLength(1);
    expect(selector.getResult()).toBeNull();
    expect(selector.getSelectedSum()).toBe(0);

    const rollBtn = root.querySelector(
      '.dice-btn-primary'
    ) as HTMLButtonElement;
    rollBtn.click();
    vi.advanceTimersByTime(900);

    expect(onRollComplete).toHaveBeenCalledTimes(1);
    const result = selector.getResult();
    expect(result?.rolls).toHaveLength(2);
    expect(root.querySelectorAll('.die-wrapper')).toHaveLength(2);
    expect(root.querySelector('.possible-sums')).toBeTruthy();

    const confirmBefore = root.querySelector(
      '.dice-btn-success'
    ) as HTMLButtonElement;
    expect(confirmBefore.disabled).toBe(true);

    (root.querySelector('.die-wrapper') as HTMLElement).click();
    expect(onSelectionChange).toHaveBeenCalled();
    expect(selector.getSelectedDice().length).toBeGreaterThan(0);
    expect(selector.getSelectedSum()).toBe(
      selector.getSelectedDice().reduce((s, d) => s + d.value, 0)
    );

    const confirmAfter = root.querySelector(
      '.dice-btn-success'
    ) as HTMLButtonElement;
    expect(confirmAfter.disabled).toBe(false);
    confirmAfter.click();
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(selector.getResult()?.rolls.some((d) => d.isLocked)).toBe(true);

    selector.setDiceSet(COMMON_DICE_SETS.primeGold);
    expect(selector.getResult()).toBeNull();
    expect(root.querySelector('.dice-selector-header')?.textContent).toBe(
      COMMON_DICE_SETS.primeGold.name
    );

    selector.reset();
    expect(root.querySelector('.dice-placeholder')).toBeTruthy();

    selector.destroy();
    expect(root.innerHTML).toBe('');
  });

  it('single-select mode keeps at most one die selected', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const selector = new DiceSelector(root, {
      diceSet: COMMON_DICE_SETS.triple,
      multiSelect: false,
    });
    (root.querySelector('.dice-btn-primary') as HTMLButtonElement).click();
    vi.advanceTimersByTime(900);

    const wrappers = root.querySelectorAll('.die-wrapper');
    expect(wrappers.length).toBe(3);
    (wrappers[0] as HTMLElement).click();
    (wrappers[1] as HTMLElement).click();
    expect(selector.getSelectedDice()).toHaveLength(1);
    expect(selector.getSelectedDice()[0].id).toBe(
      selector.getResult()!.rolls[1].id
    );
  });
});

describe('Wave 22 dice-selector — createRollButton', () => {
  it('rolls the named set and invokes onRoll', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const seen: number[] = [];
    const btn = createRollButton(host, COMMON_DICE_SETS.primeGold, (r) => {
      seen.push(r.rolls.length, r.total);
    });
    expect(btn.textContent).toContain(COMMON_DICE_SETS.primeGold.name);
    btn.click();
    expect(seen[0]).toBe(3);
    expect(seen[1]).toBeGreaterThan(0);
  });
});
