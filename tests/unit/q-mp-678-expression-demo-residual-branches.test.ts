/**
 * q-mp-678 — close `expression-demo` residual branches (tests-only).
 *
 * Live tip re-measure (`cursor/mp-tip-post1059` @ `70da293f`):
 *   With `*expression-demo*` suite: **93.51%** lines / **76.59%** branches
 *   (102/109 stmts, 36/47 branches, 19/20 funcs). Uncovered keep-sites:
 *   missing-host soft-returns (calc / challengeGrid / selectChallenge /
 *   solutionsList / equation / card-builder-area), `dataset.expr ?? ''`,
 *   card-builder `onComplete` (unreachable via UI — no `targetValue`).
 *
 * Ownership (leave alone; do not edit product / competing suites):
 *   Tip-folded `#1047` / `q-mp-605` — 0%→non-zero happy path; **contained**
 *   Open drafts into older tips that mention expression-ui (not this file)
 *     stay open; this suite owns `src/demos/expression-demo.ts` residuals.
 *
 * Constraints: tests only; zero `src/` edits; no copy / aria / label pins;
 * no AI / rules / scoring / evaluator asserts; no ratchet JSON; no network.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { capturedCardBuilderOnCompletes } = vi.hoisted(() => ({
  capturedCardBuilderOnCompletes: [] as Array<
    (expr: string, result: number) => void
  >,
}));

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

vi.mock('../../src/core/expressions/expression-ui', async (importOriginal) => {
  const actual =
    await importOriginal<
      typeof import('../../src/core/expressions/expression-ui')
    >();
  return {
    ...actual,
    createInteractiveBuilder: (
      container: HTMLElement,
      options: Parameters<typeof actual.createInteractiveBuilder>[1]
    ) => {
      // Card builder registers onComplete without targetValue; checkComplete
      // never fires it. Capture so the residual closure can be exercised.
      if (options.onComplete && options.targetValue === undefined) {
        capturedCardBuilderOnCompletes.push(options.onComplete);
      }
      return actual.createInteractiveBuilder(container, options);
    },
  };
});

import { renderExpressionDemo } from '../../src/demos/expression-demo';
import { mountRoot } from './helpers/dom';

let getIdSpy: ReturnType<typeof vi.spyOn> | undefined;

function spyMissingIds(...missing: string[]): void {
  getIdSpy?.mockRestore();
  const realGet = document.getElementById.bind(document);
  getIdSpy = vi
    .spyOn(document, 'getElementById')
    .mockImplementation((id: string) => {
      if (missing.includes(id)) {
        return null;
      }
      return realGet(id);
    });
}

function trayCards(scope: ParentNode): HTMLElement[] {
  return [
    ...scope.querySelectorAll('.card-tray .expression-card'),
  ] as HTMLElement[];
}

function builderSlots(scope: ParentNode): HTMLElement[] {
  return [...scope.querySelectorAll('.expression-slot')] as HTMLElement[];
}

beforeEach(() => {
  document.body.innerHTML = '';
  capturedCardBuilderOnCompletes.length = 0;
  vi.useFakeTimers();
  vi.clearAllMocks();
});

afterEach(() => {
  getIdSpy?.mockRestore();
  getIdSpy = undefined;
  vi.useRealTimers();
  document.body.innerHTML = '';
  // clearAllMocks only — restoreAllMocks kills hoisted router mock under shuffle
  vi.clearAllMocks();
});

describe('q-mp-678 expression-demo — missing-host soft-fail residuals', () => {
  it('missing back-btn soft-skips navigate wire (no throw)', () => {
    spyMissingIds('back-btn');
    const root = mountRoot();
    expect(() => renderExpressionDemo(root)).not.toThrow();
    expect(root.querySelector('#calc-input')).toBeTruthy();
    expect(root.querySelector('#challenge-grid')).toBeTruthy();
  });

  it('missing calc-input soft-returns calculate; example btn skips fill', () => {
    spyMissingIds('calc-input');
    const root = mountRoot();
    expect(() => renderExpressionDemo(root)).not.toThrow();
    const calcBtn = root.querySelector('#calc-btn') as HTMLButtonElement;
    const result = root.querySelector('#calc-result') as HTMLElement;
    expect(() => calcBtn.click()).not.toThrow();
    expect(result.children.length).toBe(0);

    const example = root.querySelector('.example-btn') as HTMLButtonElement;
    expect(() => example.click()).not.toThrow();
    expect(result.children.length).toBe(0);
  });

  it('missing calc-result soft-returns calculate on button + Enter', () => {
    spyMissingIds('calc-result');
    const root = mountRoot();
    expect(() => renderExpressionDemo(root)).not.toThrow();
    const input = root.querySelector('#calc-input') as HTMLInputElement;
    input.value = '2 + 2';
    expect(() =>
      (root.querySelector('#calc-btn') as HTMLButtonElement).click()
    ).not.toThrow();
    expect(() =>
      input.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
      )
    ).not.toThrow();
  });

  it('missing calc-btn soft-skips click wire; Enter still calculates', () => {
    spyMissingIds('calc-btn');
    const root = mountRoot();
    expect(() => renderExpressionDemo(root)).not.toThrow();
    const input = root.querySelector('#calc-input') as HTMLInputElement;
    const result = root.querySelector('#calc-result') as HTMLElement;
    input.value = '1 + 1';
    input.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    expect(result.children.length).toBeGreaterThan(0);
  });

  it('missing challenge-grid soft-returns target game init', () => {
    spyMissingIds('challenge-grid');
    const root = mountRoot();
    expect(() => renderExpressionDemo(root)).not.toThrow();
    expect(root.querySelector('#active-challenge')).toBeTruthy();
    expect(root.querySelector('#solve-btn')).toBeTruthy();
  });

  it('missing active-challenge soft-returns selectChallenge on card click', () => {
    spyMissingIds('active-challenge');
    const root = mountRoot();
    expect(() => renderExpressionDemo(root)).not.toThrow();
    const card = root.querySelector(
      '#challenge-grid .challenge-card'
    ) as HTMLElement;
    expect(card).toBeTruthy();
    expect(() => card.click()).not.toThrow();
    expect(
      root
        .querySelector('#expression-builder')
        ?.querySelectorAll('.expression-slot').length ?? 0
    ).toBe(0);
  });

  it('missing challenge-target soft-returns selectChallenge', () => {
    spyMissingIds('challenge-target');
    const root = mountRoot();
    expect(() => renderExpressionDemo(root)).not.toThrow();
    const card = root.querySelector(
      '#challenge-grid .challenge-card'
    ) as HTMLElement;
    expect(() => card.click()).not.toThrow();
    expect(
      (root.querySelector('#active-challenge') as HTMLElement).style.display
    ).toBe('none');
  });

  it('missing expression-builder soft-returns selectChallenge', () => {
    spyMissingIds('expression-builder');
    const root = mountRoot();
    expect(() => renderExpressionDemo(root)).not.toThrow();
    const card = root.querySelector(
      '#challenge-grid .challenge-card'
    ) as HTMLElement;
    expect(() => card.click()).not.toThrow();
    expect(
      (root.querySelector('#active-challenge') as HTMLElement).style.display
    ).toBe('none');
  });

  it('missing solutions-list soft-returns solver click', () => {
    spyMissingIds('solutions-list');
    const root = mountRoot();
    expect(() => renderExpressionDemo(root)).not.toThrow();
    expect(() =>
      (root.querySelector('#solve-btn') as HTMLButtonElement).click()
    ).not.toThrow();
  });

  it('missing solve-btn soft-skips solver wire; num inputs still mount', () => {
    spyMissingIds('solve-btn');
    const root = mountRoot();
    expect(() => renderExpressionDemo(root)).not.toThrow();
    expect(root.querySelector('#num1')).toBeTruthy();
    expect(root.querySelector('#solutions-list')).toBeTruthy();
  });

  it('missing equation-input soft-returns checkEquation', () => {
    spyMissingIds('equation-input');
    const root = mountRoot();
    expect(() => renderExpressionDemo(root)).not.toThrow();
    expect(() =>
      (root.querySelector('#check-equation-btn') as HTMLButtonElement).click()
    ).not.toThrow();
  });

  it('missing equation-result soft-returns checkEquation', () => {
    spyMissingIds('equation-result');
    const root = mountRoot();
    expect(() => renderExpressionDemo(root)).not.toThrow();
    const input = root.querySelector('#equation-input') as HTMLInputElement;
    input.value = '2 + 2 = 4';
    expect(() =>
      (root.querySelector('#check-equation-btn') as HTMLButtonElement).click()
    ).not.toThrow();
  });

  it('missing check-equation-btn soft-skips click wire; Enter still checks', () => {
    spyMissingIds('check-equation-btn');
    const root = mountRoot();
    expect(() => renderExpressionDemo(root)).not.toThrow();
    const input = root.querySelector('#equation-input') as HTMLInputElement;
    const result = root.querySelector('#equation-result') as HTMLElement;
    input.value = '1 + 1 = 2';
    input.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    expect(result.classList.contains('true')).toBe(true);
  });

  it('missing card-builder-area soft-returns card builder init', () => {
    spyMissingIds('card-builder-area');
    const root = mountRoot();
    expect(() => renderExpressionDemo(root)).not.toThrow();
    expect(capturedCardBuilderOnCompletes.length).toBe(0);
    expect(root.querySelector('#calc-input')).toBeTruthy();
  });
});

describe('q-mp-678 expression-demo — behavioral residual branches', () => {
  it('example btn without data-expr uses empty-string nullish arm', () => {
    const root = mountRoot();
    renderExpressionDemo(root);
    const example = root.querySelector('.example-btn') as HTMLButtonElement;
    delete example.dataset.expr;
    example.click();
    const input = root.querySelector('#calc-input') as HTMLInputElement;
    expect(input.value).toBe('');
    const result = root.querySelector('#calc-result') as HTMLElement;
    expect(result.innerHTML).toBe('');
  });

  it('non-Enter keydown skips calculate and equation check', () => {
    const root = mountRoot();
    renderExpressionDemo(root);
    const calcInput = root.querySelector('#calc-input') as HTMLInputElement;
    const calcResult = root.querySelector('#calc-result') as HTMLElement;
    calcInput.value = '9 + 9';
    calcInput.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Tab', bubbles: true })
    );
    expect(calcResult.children.length).toBe(0);

    const eqInput = root.querySelector('#equation-input') as HTMLInputElement;
    const eqResult = root.querySelector('#equation-result') as HTMLElement;
    eqInput.value = '3 + 3 = 6';
    eqInput.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
    );
    expect(eqResult.className).toBe('');
  });

  it('calculator error path paints result chrome without throwing', () => {
    const root = mountRoot();
    renderExpressionDemo(root);
    const input = root.querySelector('#calc-input') as HTMLInputElement;
    const result = root.querySelector('#calc-result') as HTMLElement;
    input.value = '2 +';
    (root.querySelector('#calc-btn') as HTMLButtonElement).click();
    expect(result.children.length).toBeGreaterThan(0);
    expect((result.textContent ?? '').length).toBeGreaterThan(0);
  });

  it('solver near-miss numbers paint non-exact solution-item class arm', () => {
    const root = mountRoot();
    renderExpressionDemo(root);
    // 5,5,2,1 yields ±1-of-24 hits (e.g. 5*5-2*1=23) → isExact false arm
    (root.querySelector('#num1') as HTMLInputElement).value = '5';
    (root.querySelector('#num2') as HTMLInputElement).value = '5';
    (root.querySelector('#num3') as HTMLInputElement).value = '2';
    (root.querySelector('#num4') as HTMLInputElement).value = '1';
    const list = root.querySelector('#solutions-list') as HTMLElement;
    (root.querySelector('#solve-btn') as HTMLButtonElement).click();
    vi.advanceTimersByTime(20);
    const items = [...list.querySelectorAll('.solution-item')];
    expect(items.length).toBeGreaterThan(0);
    expect(items.some((el) => !el.classList.contains('exact'))).toBe(true);
  });

  it('card-builder onComplete residual logs when intercepted callback runs', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const root = mountRoot();
    renderExpressionDemo(root);
    const area = root.querySelector('#card-builder-area') as HTMLElement;
    expect(capturedCardBuilderOnCompletes.length).toBe(1);
    expect(builderSlots(area).length).toBe(7);
    expect(trayCards(area).length).toBeGreaterThan(0);
    capturedCardBuilderOnCompletes[0]!('1 + 2', 3);
    expect(logSpy).toHaveBeenCalledTimes(1);
    logSpy.mockRestore();
  });
});
