/**
 * Wave 22 — core DiceSelector UI + createRollButton (first burn coverage).
 * Distinct from dice.test.ts roller math and wave 14 game-level dice helpers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  DiceSelector,
  createRollButton,
  COMMON_DICE_SETS,
  renderDie,
  renderRollResult,
  getDiceStyles,
} from '../../src/core/dice';

afterEach(() => {
  document.body.innerHTML = '';
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('Wave 22 dice-selector-ui — mount / reset / destroy', () => {
  it('renders chrome, resets result, destroys container contents', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const selector = new DiceSelector(el, {
      diceSet: COMMON_DICE_SETS.standard,
      showRollButton: true,
      autoRoll: false,
      showPossibleSums: true,
    });

    expect(el.classList.contains('dice-selector')).toBe(true);
    expect(el.querySelector('.dice-btn-primary')).toBeTruthy();
    expect(selector.getResult()).toBeNull();
    expect(selector.getSelectedDice()).toEqual([]);
    expect(selector.getSelectedSum()).toBe(0);

    selector.reset();
    expect(selector.getResult()).toBeNull();
    expect(el.classList.contains('dice-selector')).toBe(true);

    selector.destroy();
    expect(el.innerHTML).toBe('');
  });

  it('setDiceSet resets and keeps roll button', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const selector = new DiceSelector(el, { autoRoll: false });
    selector.setDiceSet(COMMON_DICE_SETS.standard);
    expect(selector.getResult()).toBeNull();
    expect(el.textContent).toMatch(/Roll/i);
    selector.destroy();
  });
});

describe('Wave 22 dice-selector-ui — roll with fake timers + confirm lock', () => {
  it('roll completes, die click selects, confirm locks selection', async () => {
    vi.useFakeTimers();
    vi.spyOn(Math, 'random').mockReturnValue(0.5);

    const el = document.createElement('div');
    document.body.appendChild(el);
    const onRoll = vi.fn();
    const onSelect = vi.fn();
    const onConfirm = vi.fn();

    const selector = new DiceSelector(el, {
      diceSet: COMMON_DICE_SETS.standard,
      multiSelect: true,
      showPossibleSums: true,
      autoRoll: false,
      onRollComplete: onRoll,
      onSelectionChange: onSelect,
      onConfirm,
    });

    selector.roll();
    await vi.advanceTimersByTimeAsync(900);
    expect(onRoll).toHaveBeenCalled();
    expect(selector.getResult()).not.toBeNull();
    expect(selector.getResult()!.rolls.length).toBeGreaterThan(0);

    const die = el
      .querySelector('.die-wrapper, .die, svg')
      ?.closest('.die-wrapper') as HTMLElement | null;
    const clickTarget =
      die ??
      (el.querySelector(
        '[data-die-id], .dice-die, .die-wrapper'
      ) as HTMLElement | null);
    // Click via public path: toggle by simulating click handler on first rendered die wrapper
    const wrappers = el.querySelectorAll('.die-wrapper');
    expect(wrappers.length).toBeGreaterThan(0);
    (wrappers[0] as HTMLElement).click();
    expect(onSelect).toHaveBeenCalled();
    expect(selector.getSelectedDice().length).toBeGreaterThan(0);

    selector.confirm();
    expect(onConfirm).toHaveBeenCalled();
    const locked = selector.getResult()!.rolls.filter((d) => d.isLocked);
    expect(locked.length).toBeGreaterThan(0);

    // Avoid unused if clickTarget was for fallback
    expect(clickTarget || wrappers[0]).toBeTruthy();
    selector.destroy();
  });
});

describe('Wave 22 dice-selector-ui — createRollButton sync path', () => {
  it('button rolls and invokes callback with total', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    const el = document.createElement('div');
    document.body.appendChild(el);
    const seen: number[] = [];
    const btn = createRollButton(el, COMMON_DICE_SETS.standard, (result) => {
      seen.push(result.total);
    });
    expect(btn.textContent).toMatch(/Roll/i);
    btn.click();
    expect(seen).toHaveLength(1);
    expect(seen[0]).toBeGreaterThan(0);
  });
});

describe('Wave 22 dice-selector-ui — renderDie / renderRollResult / styles', () => {
  it('renderDie produces svg; renderRollResult mounts dice; styles injectable', () => {
    const die = renderDie(
      {
        id: 't1',
        diceType: 'd6',
        value: 4,
        isSelected: false,
        isLocked: false,
        timestamp: Date.now(),
      },
      40
    );
    expect(die.tagName.toLowerCase()).toBe('svg');

    const host = document.createElement('div');
    document.body.appendChild(host);
    renderRollResult(
      {
        id: 'r1',
        rolls: [
          {
            id: 'a',
            diceType: 'd6',
            value: 2,
            isSelected: false,
            isLocked: false,
            timestamp: Date.now(),
          },
          {
            id: 'b',
            diceType: 'd6',
            value: 5,
            isSelected: true,
            isLocked: false,
            timestamp: Date.now(),
          },
        ],
        total: 7,
      },
      host,
      { dieSize: 32, selectable: true }
    );
    expect(host.querySelector('svg')).toBeTruthy();
    expect(getDiceStyles().length).toBeGreaterThan(50);
  });
});
