/**
 * Wave 55 leftover after #250 — Expression 2^3 example exact leftover copy.
 * Distinct from wave51 equation ≠ copy. Tests-only.
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

describe('Wave 55 demos — expr power example', () => {
  it('2^3 + 1 example fills calc-input and a numeric calc-result', () => {
    const root = mount();
    renderExpressionDemo(root);
    const btn = root.querySelector(
      '.example-btn[data-expr="2 ^ 3 + 1"]'
    ) as HTMLButtonElement;
    expect(btn).toBeTruthy();
    btn.click();
    expect((root.querySelector('#calc-input') as HTMLInputElement).value).toBe('2 ^ 3 + 1');
    expect(root.querySelector('#calc-result')?.textContent ?? '').toMatch(/9/);
  });
});
