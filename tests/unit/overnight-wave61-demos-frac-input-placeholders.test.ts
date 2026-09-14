/**
 * Wave 61 leftover after #301 (unit-only) — Fraction input placeholder catalog.
 * Distinct from wave60 equals/op-btn/paras leftovers. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderFractionDemo } from '../../src/demos/fraction-demo';

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

describe('Wave 61 demos — frac input placeholders', () => {
  it('locks arithmetic/compare/equiv placeholders', () => {
    const root = mount();
    renderFractionDemo(root);
    expect(
      (root.querySelector('#fraction-a') as HTMLInputElement).placeholder
    ).toBe('3/4');
    expect(
      (root.querySelector('#fraction-b') as HTMLInputElement).placeholder
    ).toBe('1/2');
    expect(
      (root.querySelector('#compare-a') as HTMLInputElement).placeholder
    ).toBe('2/3');
    expect(
      (root.querySelector('#compare-b') as HTMLInputElement).placeholder
    ).toBe('3/4');
    expect(
      (root.querySelector('#equiv-fraction') as HTMLInputElement).placeholder
    ).toBe('1/2');
  });
});
