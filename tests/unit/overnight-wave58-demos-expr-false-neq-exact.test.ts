/**
 * Wave 58 leftover after #267 — Expr exact ✗ False ≠ copy for 2+2=5.
 * Distinct from wave51 soft False/≠ leftover. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderExpressionDemo } from '../../src/demos/expression-demo';

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 58 demos — expr false neq exact', () => {
  it('2 + 2 = 5 yields exact ✗ False: 4 ≠ 5', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    renderExpressionDemo(root);
    const input = root.querySelector('#equation-input') as HTMLInputElement;
    const check = root.querySelector('#check-equation-btn') as HTMLButtonElement;
    input.value = '2 + 2 = 5';
    check.click();
    expect(root.querySelector('#equation-result')?.textContent).toBe(
      '✗ False: 4 ≠ 5'
    );
  });
});
