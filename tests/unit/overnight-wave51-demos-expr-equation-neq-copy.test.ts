/**
 * Overnight TOKENMAXX HEAVY leftovers after #234 — equation true/false exact copy.
 * Distinct from true/false CSS class leftovers. Tests-only.
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

describe('Wave 51 demos — expr equation neq/true copy', () => {
  it('false equation shows ≠ copy; true shows Both sides equal', () => {
    const root = mount();
    renderExpressionDemo(root);
    const input = root.querySelector('#equation-input') as HTMLInputElement;
    const check = root.querySelector('#check-equation-btn') as HTMLButtonElement;

    input.value = '2 + 2 = 5';
    check.click();
    expect(root.querySelector('#equation-result')?.textContent ?? '').toMatch(
      /False:.*≠/
    );
    expect(root.querySelector('#equation-result')?.classList.contains('false')).toBe(
      true
    );

    input.value = '2 + 2 = 4';
    check.click();
    expect(root.querySelector('#equation-result')?.textContent ?? '').toMatch(
      /Both sides equal/
    );
    expect(root.querySelector('#equation-result')?.classList.contains('true')).toBe(
      true
    );
  });
});
