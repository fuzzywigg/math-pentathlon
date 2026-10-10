/**
 * q-mp-570 — Characterize expression-ui DISPLAY soft-fail residuals (tests-only).
 *
 * Live tip re-measure (`cursor/mp-tip-post1012` @ `f1838cd4`):
 *   `expression-ui.ts` **815** LOC (matches backlog stamp)
 *   Files importing `expression-ui`: **29** before this suite (backlog “27
 *     test-name matches” was an older tip count)
 *   Overlay nnnull residual **7** — do **not** clear (leave undrafted
 *     `q-mp-396` with `contained`)
 *   Focused host suites already saturate line/branch coverage at **100%**;
 *     this suite owns DISPLAY soft-fail contract pins those left thin.
 *
 * Ownership (leave alone; do not edit product / competing suites):
 *   tip-folded `#1002` / `q-mp-547` r19 — interactive remove + Clear All
 *   tip-folded `#1010` / `q-mp-548` mutation w19 — SVG / drag / slot first-20
 *   tip-folded r20 — dragover/dragleave + tray `draggable !== undefined`
 *   tip `q-mp-326` / `q-mp-406` — prior soft-fail residual suites (leave
 *     open drafts `#818` / `#885` with `contained`)
 *   undrafted `q-mp-396` — nnnull product clear (not this ticket)
 *
 * Constraints: tests only; zero `src/` edits; no nnnull ceiling write;
 * no AI / rules / scoring / copy / aria pins; Hex Hard 450ms; no network;
 * no ratchet JSON. DISPLAY chrome only — not the evaluator.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

import * as evaluator from '../../src/core/expressions/evaluator';
import {
  createInteractiveBuilder,
  renderCalculatorDisplay,
  renderChallengeCard,
  renderExpressionBuilder,
} from '../../src/core/expressions/expression-ui';
import {
  createNumberCard,
  createOperatorCard,
  createSlot,
  createTargetChallenge,
} from '../../src/core/expressions/types';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

function resultChrome(host: ParentNode): HTMLElement {
  const el = host.querySelector('.expression-result');
  expect(el).toBeTruthy();
  return el as HTMLElement;
}

describe('q-mp-570 expression-ui — calculator DISPLAY soft-fail residuals', () => {
  it('error wins over a defined numeric result (DISPLAY soft priority)', () => {
    // L802–807: `if (error)` before `else if (result !== undefined)`.
    // Wave-35 titled “preference” but only passed result=undefined; pin both.
    const el = renderCalculatorDisplay('9-1', 8, 'soft-fail-probe');
    const kids = el.children;
    expect(kids).toHaveLength(2);
    const resultEl = kids[1] as HTMLElement;
    expect(resultEl.style.color).toBe('rgb(244, 67, 54)');
    expect(resultEl.textContent).toBe('soft-fail-probe');
    // Error arm must not paint the green equals chrome.
    expect(resultEl.textContent).not.toMatch(/^=/);
    expect(resultEl.style.color).not.toBe('rgb(76, 175, 80)');
  });

  it('result 0 still paints success chrome (defined falsy soft path)', () => {
    // L805: `result !== undefined` — 0 must not fall through to empty arm.
    const el = renderCalculatorDisplay('1-1', 0);
    const resultEl = el.children[1] as HTMLElement;
    expect(resultEl.style.color).toBe('rgb(76, 175, 80)');
    expect((resultEl.textContent ?? '').length).toBeGreaterThan(0);
    expect(resultEl.textContent).toMatch(/0/);
  });

  it('empty expression with neither result nor error leaves result child blank', () => {
    // L808–809: else arm — expression placeholder is separate from result.
    const el = renderCalculatorDisplay('');
    const exprEl = el.children[0] as HTMLElement;
    const resultEl = el.children[1] as HTMLElement;
    expect((exprEl.textContent ?? '').length).toBeGreaterThan(0);
    expect(resultEl.textContent).toBe('');
    expect(resultEl.style.color).toBe('');
  });
});

describe('q-mp-570 expression-ui — builder showResult DISPLAY soft-fail residuals', () => {
  it('evaluable without targetValue paints neutral (never valid) with strong', () => {
    // L463–468: matchesTarget requires targetValue; else class stays neutral.
    const el = renderExpressionBuilder(
      {
        slots: [
          createSlot(0, createNumberCard(2, 'a')),
          createSlot(1, createOperatorCard('+', 'p')),
          createSlot(2, createNumberCard(3, 'b')),
        ],
      },
      { showResult: true }
    );
    const result = resultChrome(el);
    expect(result.classList.contains('neutral')).toBe(true);
    expect(result.classList.contains('valid')).toBe(false);
    expect(result.classList.contains('invalid')).toBe(false);
    expect(result.querySelector('strong')).toBeTruthy();
    // No target → no checkmark / target-hint text nodes appended.
    expect(result.textContent ?? '').not.toMatch(/✓/);
    expect(result.textContent ?? '').not.toMatch(/target:/i);
  });

  it('canEvaluate false + isValid true + empty errors uses neutral prompt chrome', () => {
    // L486–488 residual: tip 326 pins canEvaluate-without-result; this pins
    // the distinct soft path where canEvaluate is false but errors stay empty.
    const spy = vi.spyOn(evaluator, 'validateSlots').mockReturnValue({
      isValid: true,
      canEvaluate: false,
      errors: [],
    });

    const el = renderExpressionBuilder(
      { slots: [createSlot(0, createNumberCard(1, 'n1'))] },
      { showResult: true }
    );
    expect(spy).toHaveBeenCalled();
    const result = resultChrome(el);
    expect(result.classList.contains('neutral')).toBe(true);
    expect(result.classList.contains('valid')).toBe(false);
    expect(result.classList.contains('invalid')).toBe(false);
    expect(result.querySelector('strong')).toBeNull();
    expect((result.textContent ?? '').length).toBeGreaterThan(0);
  });

  it('near-epsilon target match still paints valid DISPLAY chrome', () => {
    // L464–466 soft float gate — display uses abs(delta) < 0.0001.
    // Mock validateSlots so this stays DISPLAY-only (not evaluator math).
    vi.spyOn(evaluator, 'validateSlots').mockReturnValue({
      isValid: true,
      canEvaluate: true,
      errors: [],
      result: 10.00005,
    });

    const el = renderExpressionBuilder(
      {
        slots: [createSlot(0, createNumberCard(10, 'n10'))],
        targetValue: 10,
      },
      { showResult: true }
    );
    const result = resultChrome(el);
    expect(result.classList.contains('valid')).toBe(true);
    expect(result.classList.contains('neutral')).toBe(false);
    expect(result.querySelector('strong')).toBeTruthy();
  });

  it('just-outside epsilon target paints neutral miss chrome (not valid)', () => {
    vi.spyOn(evaluator, 'validateSlots').mockReturnValue({
      isValid: true,
      canEvaluate: true,
      errors: [],
      result: 10.0002,
    });

    const el = renderExpressionBuilder(
      {
        slots: [createSlot(0, createNumberCard(10, 'n10'))],
        targetValue: 10,
      },
      { showResult: true }
    );
    const result = resultChrome(el);
    expect(result.classList.contains('neutral')).toBe(true);
    expect(result.classList.contains('valid')).toBe(false);
    expect(result.querySelector('strong')).toBeTruthy();
  });
});

describe('q-mp-570 expression-ui — interactive / challenge DISPLAY soft residuals', () => {
  it('miss-target keeps result chrome non-valid while onComplete soft-skips', () => {
    // Wave-35 pins onComplete skip; this pins the DISPLAY class residual.
    const host = document.createElement('div');
    document.body.appendChild(host);
    const onComplete = vi.fn();
    const api = createInteractiveBuilder(host, {
      slotCount: 3,
      availableCards: [
        createNumberCard(1, 'a'),
        createOperatorCard('+', 'p'),
        createNumberCard(1, 'b'),
      ],
      targetValue: 99,
      onComplete,
    });

    const tray = () =>
      [
        ...host.querySelectorAll('.card-tray .expression-card'),
      ] as HTMLElement[];
    const slots = () =>
      [...host.querySelectorAll('.expression-slot')] as HTMLElement[];

    tray()
      .find((e) => e.textContent === '1')!
      .click();
    slots()[0]!.click();
    tray()
      .find((e) => e.textContent === '+')!
      .click();
    slots()[1]!.click();
    tray()
      .find((e) => e.textContent === '1')!
      .click();
    slots()[2]!.click();

    expect(api.getResult()).toBe(2);
    expect(onComplete).not.toHaveBeenCalled();
    const result = resultChrome(host);
    expect(result.classList.contains('valid')).toBe(false);
    expect(result.classList.contains('neutral')).toBe(true);
  });

  it('challenge card with empty numbers list stays non-interactive without onClick', () => {
    // DISPLAY soft edge complementary to tip 326 empty target-display chips.
    const challenge = createTargetChallenge([], 7);
    const el = renderChallengeCard(challenge);
    expect(el.classList.contains('challenge-card')).toBe(true);
    expect(el.querySelectorAll('.numbers span')).toHaveLength(0);
    expect(el.querySelector('.target')).toBeTruthy();
    expect(() => el.click()).not.toThrow();
  });
});
