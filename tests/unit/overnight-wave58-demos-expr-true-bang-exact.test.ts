/**
 * Wave 58 leftover after #267 (unit-only; #277 closed RED e2e) — Expr exact True! Both sides equal copy.
 * Distinct from soft Both sides equal wave51 leftover. Tests-only.
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

describe('Wave 58 demos — expr True! bang exact', () => {
  it('2 + 2 = 4 paints exact True! Both sides equal 4', () => {
    const root = mount();
    renderExpressionDemo(root);
    const input = root.querySelector('#equation-input') as HTMLInputElement;
    const check = root.querySelector('#check-equation-btn') as HTMLButtonElement;
    input.value = '2 + 2 = 4';
    check.click();
    expect(root.querySelector('#equation-result')?.textContent).toBe(
      '✓ True! Both sides equal 4'
    );
  });
});
