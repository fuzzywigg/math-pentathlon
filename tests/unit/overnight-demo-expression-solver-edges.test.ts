/**
 * Overnight demos leftover — expression calc / equation / solver / challenge edges.
 * Existing renderExpressionDemo APIs only. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({
  navigate: vi.fn(),
}));

import { renderExpressionDemo } from '../../src/demos/expression-demo';

function mount(): HTMLElement {
  const root = document.createElement('div');
  document.body.appendChild(root);
  return root;
}

beforeEach(() => {
  document.body.innerHTML = '';
  vi.clearAllMocks();
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Overnight demos — expression solver edges', () => {
  it('empty calc clears result; bad expr surfaces error chrome', () => {
    const root = mount();
    renderExpressionDemo(root);
    const input = root.querySelector('#calc-input') as HTMLInputElement;
    const btn = root.querySelector('#calc-btn') as HTMLButtonElement;
    const result = root.querySelector('#calc-result') as HTMLElement;

    input.value = '2 + 2';
    btn.click();
    expect(result.innerHTML.length).toBeGreaterThan(0);

    input.value = '   ';
    btn.click();
    expect(result.innerHTML).toBe('');

    input.value = '2 +';
    btn.click();
    expect(result.innerHTML.length).toBeGreaterThan(0);
  });

  it('Enter key triggers calculate like the button', () => {
    const root = mount();
    renderExpressionDemo(root);
    const input = root.querySelector('#calc-input') as HTMLInputElement;
    input.value = '10 / 2 - 3';
    input.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    expect(
      (root.querySelector('#calc-result') as HTMLElement).innerHTML.length
    ).toBeGreaterThan(0);
  });

  it('all example buttons fill input and paint calc-result', () => {
    const root = mount();
    renderExpressionDemo(root);
    const examples = root.querySelectorAll('.example-btn');
    expect(examples.length).toBeGreaterThanOrEqual(4);
    examples.forEach((btn) => {
      (btn as HTMLButtonElement).click();
      const input = root.querySelector('#calc-input') as HTMLInputElement;
      expect(input.value.length).toBeGreaterThan(0);
      expect(
        (root.querySelector('#calc-result') as HTMLElement).innerHTML.length
      ).toBeGreaterThan(0);
    });
  });

  it('equation checker true / false / empty / error paths', () => {
    const root = mount();
    renderExpressionDemo(root);
    const input = root.querySelector('#equation-input') as HTMLInputElement;
    const btn = root.querySelector(
      '#check-equation-btn'
    ) as HTMLButtonElement;
    const result = root.querySelector('#equation-result') as HTMLElement;

    input.value = '2 + 2 = 4';
    btn.click();
    expect(result.classList.contains('true')).toBe(true);
    expect(result.textContent).toMatch(/True/i);

    input.value = '2 + 2 = 5';
    btn.click();
    expect(result.classList.contains('false')).toBe(true);
    expect(result.textContent).toMatch(/False/i);

    input.value = '';
    btn.click();
    expect(result.innerHTML).toBe('');
    expect(result.className).toBe('');

    input.value = '2 =';
    btn.click();
    expect(result.classList.contains('false')).toBe(true);
    expect(result.textContent).toMatch(/Error/i);
  });

  it('solver finds exact solutions for 1,2,3,6 → 24', () => {
    const root = mount();
    renderExpressionDemo(root);
    (root.querySelector('#num1') as HTMLInputElement).value = '1';
    (root.querySelector('#num2') as HTMLInputElement).value = '2';
    (root.querySelector('#num3') as HTMLInputElement).value = '3';
    (root.querySelector('#num4') as HTMLInputElement).value = '6';
    (root.querySelector('#solve-btn') as HTMLButtonElement).click();

    expect(root.querySelector('#solutions-list')?.textContent).toMatch(
      /Searching/i
    );
    vi.advanceTimersByTime(20);
    const list = root.querySelector('#solutions-list') as HTMLElement;
    expect(list.querySelectorAll('.solution-item').length).toBeGreaterThan(0);
    expect(list.textContent).toMatch(/24|exact|=/i);
  });

  it('solver reports no solutions for impossible set', () => {
    const root = mount();
    renderExpressionDemo(root);
    (root.querySelector('#num1') as HTMLInputElement).value = '1';
    (root.querySelector('#num2') as HTMLInputElement).value = '1';
    (root.querySelector('#num3') as HTMLInputElement).value = '1';
    (root.querySelector('#num4') as HTMLInputElement).value = '1';
    (root.querySelector('#solve-btn') as HTMLButtonElement).click();
    vi.advanceTimersByTime(20);
    expect(root.querySelector('#solutions-list')?.textContent).toMatch(
      /No solutions/i
    );
  });

  it('challenge card select reveals active builder', () => {
    const root = mount();
    renderExpressionDemo(root);
    const active = root.querySelector('#active-challenge') as HTMLElement;
    expect(active.style.display).toBe('none');

    const card = root.querySelector(
      '#challenge-grid > *, #challenge-grid button, #challenge-grid .challenge-card'
    ) as HTMLElement;
    expect(card).toBeTruthy();
    card.click();
    expect(active.style.display).toBe('block');
    expect(
      (root.querySelector('#challenge-target') as HTMLElement).innerHTML
        .length
    ).toBeGreaterThan(0);
    expect(
      (root.querySelector('#expression-builder') as HTMLElement).innerHTML
        .length
    ).toBeGreaterThan(0);
  });

  it('card builder area mounts interactive slots', () => {
    const root = mount();
    renderExpressionDemo(root);
    const area = root.querySelector('#card-builder-area') as HTMLElement;
    expect(area).toBeTruthy();
    expect(area.children.length + area.innerHTML.length).toBeGreaterThan(0);
  });
});
