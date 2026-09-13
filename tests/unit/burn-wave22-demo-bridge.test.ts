/**
 * Wave 22 — game/demo bridge: Contig / Juggle / Sum / Prime + demo mounts.
 * Distinct from #124 Fab/Par/Juggle/Hex attribute-fraction bridge.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';

import {
  DiceSelector,
  COMMON_DICE_SETS,
  renderRollResult,
  rollMultiple,
  createRollButton,
} from '../../src/core/dice';
import {
  injectExpressionStyles,
  createInteractiveBuilder,
  renderCalculatorDisplay,
  createNumberCard,
  createOperatorCard,
  evaluate,
  MAKE_TEN_CHALLENGES,
  solveTargetChallenge,
} from '../../src/core/expressions';
import { renderDiceDemo } from '../../src/demos/dice-demo';
import { renderExpressionDemo } from '../../src/demos/expression-demo';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('dice-selector-styles')?.remove();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

beforeEach(() => {
  let call = 0;
  vi.spyOn(Math, 'random').mockImplementation(() => {
    call += 1;
    return (call % 40) / 10000;
  });
});

describe('Wave 22 demo-bridge — dice demo mount', () => {
  it('renderDiceDemo mounts selector chrome and quick-roll area', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    renderDiceDemo(host);

    expect(host.querySelector('.dice-demo')).toBeTruthy();
    expect(host.querySelector('.quick-roll-area, .demo-section')).toBeTruthy();
    expect(
      host.querySelector('.dice-selector, .selector-container, .dice-btn')
    ).toBeTruthy();
  });

  it('standalone DiceSelector + createRollButton coexist in one host', () => {
    vi.useFakeTimers();
    const host = document.createElement('div');
    document.body.appendChild(host);

    const selectorHost = document.createElement('div');
    const buttonHost = document.createElement('div');
    const resultHost = document.createElement('div');
    host.append(selectorHost, buttonHost, resultHost);

    const selector = new DiceSelector(selectorHost, {
      diceSet: COMMON_DICE_SETS.standard,
      showRollButton: true,
    });
    const seen: number[] = [];
    createRollButton(buttonHost, COMMON_DICE_SETS.triple, (r) => {
      seen.push(r.total);
      renderRollResult(r, resultHost, { showTotal: true });
    });

    selector.roll();
    vi.advanceTimersByTime(900);
    expect(selector.getResult()?.total).toBe(2);

    (buttonHost.querySelector('button') as HTMLButtonElement).click();
    expect(seen).toEqual([3]);
    expect(resultHost.querySelectorAll('.die-wrapper')).toHaveLength(3);

    const quick = rollMultiple('d6', 2);
    expect(quick.total).toBe(2);
  });
});

describe('Wave 22 demo-bridge — expression demo mount', () => {
  it('renderExpressionDemo mounts evaluator + challenge chrome', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    renderExpressionDemo(host);

    expect(host.querySelector('#calc-input, .calc-input-container')).toBeTruthy();
    expect(host.querySelector('#challenge-grid, .challenge-grid')).toBeTruthy();
    expect(host.textContent).toMatch(/Expression/i);
  });

  it('interactive builder + calculator display remount after evaluate', () => {
    injectExpressionStyles();
    const host = document.createElement('div');
    document.body.appendChild(host);

    const builderHost = document.createElement('div');
    const calcHost = document.createElement('div');
    host.append(builderHost, calcHost);

    // unique ids so tray lookup stays unambiguous after re-renders
    const deck = [
      createNumberCard(1, 'b1'),
      createOperatorCard('+', 'b+1'),
      createNumberCard(4, 'b4'),
      createOperatorCard('+', 'b+2'),
      createNumberCard(5, 'b5'),
    ];

    const api = createInteractiveBuilder(builderHost, {
      slotCount: 5,
      availableCards: deck,
      targetValue: 10,
    });

    const placeById = (cardId: string) => {
      const card = builderHost.querySelector(
        `[data-card-id="${cardId}"]`
      ) as HTMLElement | null;
      expect(card).toBeTruthy();
      card!.click();
      const empty = builderHost.querySelector(
        '.expression-slot:not(.filled)'
      ) as HTMLElement | null;
      expect(empty).toBeTruthy();
      empty!.click();
    };

    placeById('b1');
    placeById('b+1');
    placeById('b4');
    placeById('b+2');
    placeById('b5');

    expect(api.getResult()).toBe(10);
    const evalResult = evaluate(api.getExpression());
    expect(evalResult.success).toBe(true);

    calcHost.appendChild(
      renderCalculatorDisplay(api.getExpression(), evalResult.value)
    );
    expect(calcHost.textContent).toContain('= 10');
  });

  it('MAKE_TEN catalog bridges to solver for demo challenge cards', () => {
    const challenge = MAKE_TEN_CHALLENGES[0];
    const sols = solveTargetChallenge(challenge, 3);
    expect(sols.some((s) => s.isExact)).toBe(true);
  });
});
