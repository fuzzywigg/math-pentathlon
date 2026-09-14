/**
 * Wave 61 leftover after #301 (unit-only) — Expression equation Error: prefix + .false.
 * Distinct from wave59 True!/False: happy-path leftovers. Tests-only.
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

describe('Wave 61 demos — expr equation Error prefix', () => {
  it('invalid equation paints Error: Invalid equation format with .false', () => {
    const root = mount();
    renderExpressionDemo(root);
    (root.querySelector('#equation-input') as HTMLInputElement).value = '2 + 2';
    (root.querySelector('#check-equation-btn') as HTMLButtonElement).click();
    const result = root.querySelector('#equation-result');
    expect(result?.textContent).toBe('Error: Invalid equation format');
    expect(result?.classList.contains('false')).toBe(true);
  });
});
