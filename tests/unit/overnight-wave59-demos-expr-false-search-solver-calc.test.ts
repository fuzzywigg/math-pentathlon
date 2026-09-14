/**
 * Wave 59 leftover after #281 — Expr false ≠ / Searching... / solver / calc chrome.
 * Distinct from wave58 ✓ True! Both sides equal 4 leftover. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderExpressionDemo } from '../../src/demos/expression-demo';

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  document.body.innerHTML = '';
  vi.useRealTimers();
});

describe('Wave 59 demos — expr false/search/solver/calc', () => {
  it('locks false ≠, Searching..., Find Solutions, calc chrome, section h2s', () => {
    vi.useFakeTimers();
    const root = document.createElement('div');
    document.body.appendChild(root);
    renderExpressionDemo(root);

    const h2s = [...root.querySelectorAll('h2')].map((h) => h.textContent?.trim());
    expect(h2s).toContain('Expression Evaluator');
    expect(h2s).toContain('Equation Checker');
    expect(h2s).toContain('Card Builder');
    expect(root.querySelector('#solve-btn')?.textContent?.trim()).toBe(
      'Find Solutions'
    );
    expect(
      (root.querySelector('#calc-input') as HTMLInputElement)?.placeholder
    ).toBe('e.g., 2 + 3 * 4');
    expect(
      [...root.querySelectorAll('.example-btn')].map((b) => b.textContent?.trim())
    ).toContain('2 + 3 × 4');

    const input = root.querySelector('#equation-input') as HTMLInputElement;
    const check = root.querySelector('#check-equation-btn') as HTMLButtonElement;
    input.value = '2 + 2 = 5';
    check.click();
    expect(root.querySelector('#equation-result')?.textContent).toBe(
      '✗ False: 4 ≠ 5'
    );

    (root.querySelector('#solve-btn') as HTMLButtonElement).click();
    expect(root.querySelector('#solutions-list')?.textContent?.trim()).toBe(
      'Searching...'
    );
  });
});
