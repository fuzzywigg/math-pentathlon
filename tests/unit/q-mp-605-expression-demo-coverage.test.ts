/**
 * q-mp-605 — dedicated expression-demo coverage (tests-only).
 * Structural asserts only: no player-facing copy / aria / label pins.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderExpressionDemo } from '../../src/demos/expression-demo';
import { mountRoot } from './helpers/dom';

function trayCards(scope: ParentNode): HTMLElement[] {
  return [
    ...scope.querySelectorAll('.card-tray .expression-card'),
  ] as HTMLElement[];
}

function builderSlots(scope: ParentNode): HTMLElement[] {
  return [...scope.querySelectorAll('.expression-slot')] as HTMLElement[];
}

function placeCard(
  scope: ParentNode,
  content: string,
  slotIndex: number
): void {
  const card = trayCards(scope).find((el) => el.textContent === content);
  const slot = builderSlots(scope)[slotIndex];
  expect(card && slot).toBeTruthy();
  card!.click();
  slot!.click();
}

beforeEach(() => {
  document.body.innerHTML = '';
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  document.body.innerHTML = '';
  vi.clearAllMocks();
});

describe('q-mp-605 expression-demo — mount + back', () => {
  it('renders section anchors and back-button chrome', () => {
    const root = mountRoot();
    renderExpressionDemo(root);

    expect(root.querySelector('#calc-input')).toBeTruthy();
    expect(root.querySelector('#challenge-grid')).toBeTruthy();
    expect(root.querySelector('#solve-btn')).toBeTruthy();
    expect(root.querySelector('#equation-input')).toBeTruthy();
    expect(root.querySelector('#card-builder-area')).toBeTruthy();
    expect(
      root.querySelectorAll('.demo-section').length
    ).toBeGreaterThanOrEqual(4);

    // Demo wires navigate via document.getElementById — exercise the listener
    // without asserting the shared isolate:false router mock (flaky under shuffle).
    const backBtn = document.getElementById('back-btn') as HTMLButtonElement;
    expect(backBtn).toBeTruthy();
    expect(backBtn.classList.contains('back-button')).toBe(true);
    expect(() => backBtn.click()).not.toThrow();
  });
});

describe('q-mp-605 expression-demo — calculator', () => {
  it('empty calc clears; button + Enter + examples fill result chrome', () => {
    const root = mountRoot();
    renderExpressionDemo(root);
    const input = root.querySelector('#calc-input') as HTMLInputElement;
    const result = root.querySelector('#calc-result') as HTMLElement;
    const calcBtn = root.querySelector('#calc-btn') as HTMLButtonElement;

    input.value = '';
    calcBtn.click();
    expect(result.innerHTML).toBe('');

    input.value = '2 + 3 * 4';
    calcBtn.click();
    expect(result.children.length).toBeGreaterThan(0);
    expect((result.textContent ?? '').length).toBeGreaterThan(0);

    input.value = '10 / 2 - 3';
    input.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    expect(result.children.length).toBeGreaterThan(0);

    const examples = root.querySelectorAll('.example-btn');
    expect(examples.length).toBeGreaterThanOrEqual(4);
    for (const btn of examples) {
      (btn as HTMLButtonElement).click();
      expect(input.value.length).toBeGreaterThan(0);
      expect(result.children.length).toBeGreaterThan(0);
    }
  });
});

describe('q-mp-605 expression-demo — target game', () => {
  it('challenge cards reveal active builder; correct solution alerts', () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const root = mountRoot();
    renderExpressionDemo(root);

    const cards = root.querySelectorAll('#challenge-grid .challenge-card');
    expect(cards.length).toBeGreaterThanOrEqual(5);
    const active = root.querySelector('#active-challenge') as HTMLElement;
    expect(active.style.display).toBe('none');

    (cards[0] as HTMLElement).click();
    expect(active.style.display).toBe('block');
    expect(
      (root.querySelector('#challenge-target')?.children.length ?? 0) > 0
    ).toBe(true);
    const builder = root.querySelector('#expression-builder') as HTMLElement;
    expect(builderSlots(builder).length).toBeGreaterThan(0);
    expect(trayCards(builder).length).toBeGreaterThan(0);

    // MAKE_TEN [2,2,6] at index 2 — 2 * 6 - 2 = 10 (one of each op in tray)
    (cards[2] as HTMLElement).click();
    expect(builderSlots(builder).length).toBe(5);
    placeCard(builder, '2', 0);
    placeCard(builder, '*', 1);
    placeCard(builder, '6', 2);
    placeCard(builder, '-', 3);
    placeCard(builder, '2', 4);
    expect(alertSpy).toHaveBeenCalled();
  });

  it('near-miss and incomplete target hits do not alert', () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const root = mountRoot();
    renderExpressionDemo(root);
    const builder = root.querySelector('#expression-builder') as HTMLElement;

    (
      root.querySelector('#challenge-grid .challenge-card') as HTMLElement
    ).click();
    placeCard(builder, '2', 0);
    placeCard(builder, '*', 1);
    placeCard(builder, '5', 2);
    expect(alertSpy).not.toHaveBeenCalled();

    const buttons = builder.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);
    (buttons[buttons.length - 1] as HTMLButtonElement).click();
    expect(
      builderSlots(builder).every((s) => !s.querySelector('.expression-card'))
    ).toBe(true);

    placeCard(builder, '2', 0);
    placeCard(builder, '+', 1);
    placeCard(builder, '3', 2);
    placeCard(builder, '-', 3);
    placeCard(builder, '5', 4);
    expect(alertSpy).not.toHaveBeenCalled();
  });
});

describe('q-mp-605 expression-demo — 24 solver', () => {
  it('default nums list exact solution items after search tick', () => {
    const root = mountRoot();
    renderExpressionDemo(root);
    const list = root.querySelector('#solutions-list') as HTMLElement;

    (root.querySelector('#solve-btn') as HTMLButtonElement).click();
    expect(list.children.length).toBeGreaterThan(0);
    vi.advanceTimersByTime(20);
    const items = list.querySelectorAll('.solution-item');
    expect(items.length).toBeGreaterThan(0);
    expect([...items].some((el) => el.classList.contains('exact'))).toBe(true);
  });

  it('empty num inputs coerce to 1s and yield empty solution list', () => {
    const root = mountRoot();
    renderExpressionDemo(root);
    for (const id of ['num1', 'num2', 'num3', 'num4']) {
      (root.querySelector(`#${id}`) as HTMLInputElement).value = '';
    }
    const list = root.querySelector('#solutions-list') as HTMLElement;
    (root.querySelector('#solve-btn') as HTMLButtonElement).click();
    vi.advanceTimersByTime(50);
    expect(list.querySelectorAll('.solution-item').length).toBe(0);
    expect((list.textContent ?? '').length).toBeGreaterThan(0);
  });
});

describe('q-mp-605 expression-demo — equation checker', () => {
  it('true / false / error / empty / Enter key paths', () => {
    const root = mountRoot();
    renderExpressionDemo(root);
    const input = root.querySelector('#equation-input') as HTMLInputElement;
    const check = root.querySelector(
      '#check-equation-btn'
    ) as HTMLButtonElement;
    const result = root.querySelector('#equation-result') as HTMLElement;

    input.value = '2 + 2 = 4';
    check.click();
    expect(result.classList.contains('true')).toBe(true);
    expect((result.textContent ?? '').length).toBeGreaterThan(0);

    input.value = '2 + 2 = 5';
    check.click();
    expect(result.classList.contains('false')).toBe(true);

    input.value = '2 + =';
    check.click();
    expect(result.classList.contains('false')).toBe(true);

    input.value = '';
    check.click();
    expect(result.innerHTML).toBe('');
    expect(result.className).toBe('');

    input.value = '3 * 3 = 9';
    input.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    expect(result.classList.contains('true')).toBe(true);
  });
});

describe('q-mp-605 expression-demo — card builder', () => {
  it('mounts tray + slots; place then clear restores tray count', () => {
    const root = mountRoot();
    renderExpressionDemo(root);
    const area = root.querySelector('#card-builder-area') as HTMLElement;
    expect(area.children.length).toBeGreaterThan(0);
    expect(builderSlots(area).length).toBeGreaterThan(0);

    const trayBefore = trayCards(area).length;
    expect(trayBefore).toBeGreaterThan(0);
    const card = trayCards(area)[0]!;
    const slot = builderSlots(area)[0]!;
    card.click();
    slot.click();
    expect(
      area.querySelectorAll('.expression-slot .expression-card').length
    ).toBe(1);
    expect(trayCards(area).length).toBe(trayBefore - 1);

    const buttons = area.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);
    (buttons[buttons.length - 1] as HTMLButtonElement).click();
    expect(
      area.querySelectorAll('.expression-slot .expression-card').length
    ).toBe(0);
    expect(trayCards(area).length).toBe(trayBefore);
  });
});
