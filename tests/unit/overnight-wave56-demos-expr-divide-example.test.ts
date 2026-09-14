/**
 * Wave 56 leftover after #256 — Expression divide example button.
 * Distinct from wave55 power leftover. Tests-only.
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

describe('Wave 56 demos — expr divide example', () => {
  it('10 / 2 - 3 example fills calc-input and evaluates to 2', () => {
    const root = mount();
    renderExpressionDemo(root);
    const btn = root.querySelector(
      '.example-btn[data-expr="10 / 2 - 3"]'
    ) as HTMLButtonElement;
    expect(btn).toBeTruthy();
    expect(btn.textContent).toMatch(/10 ÷ 2 - 3/);
    btn.click();
    expect((root.querySelector('#calc-input') as HTMLInputElement).value).toBe(
      '10 / 2 - 3'
    );
    expect(root.querySelector('#calc-result')?.textContent ?? '').toMatch(/2/);
  });
});
