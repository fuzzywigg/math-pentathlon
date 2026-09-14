/**
 * Wave 64 leftover after tip/#303 (unit-only) — expr solver defaults 1234.
 * Distinct from wave58–60 demos chrome leftovers. Tests-only.
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

describe('Wave 64 demos — expr solver defaults 1–4', () => {
  it('locks num1–num4 default values + min/max 1–13', () => {
    const root = mount();
    renderExpressionDemo(root);
    const nums = ['num1', 'num2', 'num3', 'num4'].map(
      (id) => root.querySelector('#' + id) as HTMLInputElement
    );
    expect(nums.map((n) => n.value)).toEqual(['1', '2', '3', '4']);
    expect(nums.every((n) => n.min === '1' && n.max === '13')).toBe(true);
  });
});
