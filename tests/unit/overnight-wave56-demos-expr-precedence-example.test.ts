/**
 * Wave 56 leftover after #256 — Expression precedence example button.
 * Distinct from wave55 2^3 power example leftover. Tests-only.
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

describe('Wave 56 demos — expr precedence example', () => {
  it('2 + 3 * 4 example fills calc-input and evaluates to 14', () => {
    const root = mount();
    renderExpressionDemo(root);
    const btn = root.querySelector(
      '.example-btn[data-expr="2 + 3 * 4"]'
    ) as HTMLButtonElement;
    expect(btn).toBeTruthy();
    expect(btn.textContent).toMatch(/2 \+ 3 × 4/);
    btn.click();
    expect((root.querySelector('#calc-input') as HTMLInputElement).value).toBe(
      '2 + 3 * 4'
    );
    expect(root.querySelector('#calc-result')?.textContent ?? '').toMatch(/14/);
  });
});
