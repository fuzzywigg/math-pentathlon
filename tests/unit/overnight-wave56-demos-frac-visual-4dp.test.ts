/**
 * Wave 56 leftover after #256 — Fraction arithmetic Visual: + 4-dp final line.
 * Distinct from wave55 subtract-selected leftover. Tests-only.
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

describe('Wave 56 demos — frac Visual 4dp', () => {
  it('paints Visual: chrome and = N.dddd final-result', () => {
    const root = mount();
    renderFractionDemo(root);
    (root.querySelector('#fraction-a') as HTMLInputElement).value = '3/4';
    (root.querySelector('#fraction-b') as HTMLInputElement).value = '1/2';
    (root.querySelector('.op-btn[data-op="add"]') as HTMLButtonElement).click();
    (root.querySelector('#calculate-btn') as HTMLButtonElement).click();

    const result = root.querySelector('#arithmetic-result');
    expect(result?.textContent).toMatch(/Visual:/);
    expect(result?.querySelector('.final-result')?.textContent).toMatch(
      /=\s*\d+\.\d{4}/
    );
  });
});
