/**
 * Overnight TOKENMAXX HEAVY — fraction demo arithmetic ops + invalid parse leftovers.
 * Tests-only. Not frac-fact / pinball engines. No product inventing.
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

describe('Overnight demos — fraction arithmetic leftovers', () => {
  it('custom inputs across all four ops fill steps + visual result bar', () => {
    const root = mount();
    renderFractionDemo(root);
    const a = root.querySelector('#fraction-a') as HTMLInputElement;
    const b = root.querySelector('#fraction-b') as HTMLInputElement;
    a.value = '2/3';
    b.value = '1/6';

    for (const op of ['add', 'subtract', 'multiply', 'divide'] as const) {
      (root.querySelector(`.op-btn[data-op="${op}"]`) as HTMLButtonElement).click();
      (root.querySelector('#calculate-btn') as HTMLButtonElement).click();
      const result = root.querySelector('#arithmetic-result');
      expect(result?.querySelector('.final-result')?.textContent?.length).toBeGreaterThan(0);
      expect(result?.querySelector('#result-bar')?.children.length).toBeGreaterThan(0);
    }
  });

  it('invalid fraction format shows red guidance without crashing', () => {
    const root = mount();
    renderFractionDemo(root);
    (root.querySelector('#fraction-a') as HTMLInputElement).value = 'nope';
    (root.querySelector('#fraction-b') as HTMLInputElement).value = '1/2';
    (root.querySelector('#calculate-btn') as HTMLButtonElement).click();
    expect(root.querySelector('#arithmetic-result')?.textContent).toMatch(/Invalid/i);
  });

  it('mixed-number input path still produces a decimal result', () => {
    const root = mount();
    renderFractionDemo(root);
    (root.querySelector('#fraction-a') as HTMLInputElement).value = '1 1/2';
    (root.querySelector('#fraction-b') as HTMLInputElement).value = '1/2';
    (root.querySelector('.op-btn[data-op="add"]') as HTMLButtonElement).click();
    (root.querySelector('#calculate-btn') as HTMLButtonElement).click();
    expect(root.querySelector('#arithmetic-result .final-result')?.textContent).toMatch(/=/);
  });
});
