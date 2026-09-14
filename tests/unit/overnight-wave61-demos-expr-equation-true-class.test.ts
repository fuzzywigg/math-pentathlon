/**
 * Wave 61 leftover after #301 (unit-only) — Expression equation-result.true class toggle.
 * Distinct from wave58 True! text leftover. Tests-only.
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

describe('Wave 61 demos — expr equation true class', () => {
  it('2 + 2 = 4 adds .true class on #equation-result', () => {
    const root = mount();
    renderExpressionDemo(root);
    const input = root.querySelector('#equation-input') as HTMLInputElement;
    input.value = '2 + 2 = 4';
    (root.querySelector('#check-equation-btn') as HTMLButtonElement).click();
    const result = root.querySelector('#equation-result');
    expect(result?.classList.contains('true')).toBe(true);
    expect(result?.classList.contains('false')).toBe(false);
  });
});
