/**
 * Wave 59 leftover after #281 (unit-only) — Expression Calculate/Check labels + placeholders.
 * Distinct from wave58 True! bang leftovers. Tests-only.
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

describe('Wave 59 demos — expr calc/check labels', () => {
  it('exposes Calculate/Check button labels and exact placeholders', () => {
    const root = mount();
    renderExpressionDemo(root);
    expect(root.querySelector('#calc-btn')?.textContent).toBe('Calculate');
    expect(root.querySelector('#check-equation-btn')?.textContent).toBe('Check');
    expect(
      (root.querySelector('#calc-input') as HTMLInputElement).placeholder
    ).toBe('e.g., 2 + 3 * 4');
    expect(
      (root.querySelector('#equation-input') as HTMLInputElement).placeholder
    ).toBe('e.g., 2 + 2 = 4');
  });
});
