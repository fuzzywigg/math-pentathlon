/**
 * Wave 56 leftover after #256 — Expression paren grouping example button.
 * Distinct from wave55 power and wave56 precedence leftovers. Tests-only.
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

describe('Wave 56 demos — expr paren example', () => {
  it('(2 + 3) * 4 example fills calc-input and evaluates to 20', () => {
    const root = mount();
    renderExpressionDemo(root);
    const btn = root.querySelector(
      '.example-btn[data-expr="(2 + 3) * 4"]'
    ) as HTMLButtonElement;
    expect(btn).toBeTruthy();
    btn.click();
    expect((root.querySelector('#calc-input') as HTMLInputElement).value).toBe(
      '(2 + 3) * 4'
    );
    expect(root.querySelector('#calc-result')?.textContent ?? '').toMatch(/20/);
  });
});
