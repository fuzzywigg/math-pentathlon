/**
 * Overnight TOKENMAXX HEAVY — expression demo calculator + examples leftovers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderExpressionDemo } from '../../src/demos/expression-demo';

function mount(): HTMLElement {
  const root = document.createElement('div');
  document.body.appendChild(root);
  return root;
}

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Overnight demos — expression calculator examples', () => {
  it('each example button evaluates into calc-result chrome', () => {
    const root = mount();
    renderExpressionDemo(root);
    const examples = root.querySelectorAll('.example-btn');
    expect(examples.length).toBeGreaterThanOrEqual(4);
    for (const btn of examples) {
      (btn as HTMLButtonElement).click();
      const input = root.querySelector('#calc-input') as HTMLInputElement;
      expect(input.value.length).toBeGreaterThan(0);
      expect(
        (root.querySelector('#calc-result')?.innerHTML.length ?? 0) > 0
      ).toBe(true);
    }
  });

  it('empty calc clears result; Enter key evaluates typed expression', () => {
    const root = mount();
    renderExpressionDemo(root);
    const input = root.querySelector('#calc-input') as HTMLInputElement;
    input.value = '';
    (root.querySelector('#calc-btn') as HTMLButtonElement).click();
    expect(root.querySelector('#calc-result')?.innerHTML ?? '').toBe('');

    input.value = '7 + 8';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(
      (root.querySelector('#calc-result')?.textContent ?? '').length
    ).toBeGreaterThan(0);
  });
});
