/**
 * Wave 60 leftover after #290 (unit-only) — Fraction arithmetic invalid format hint.
 * Distinct from soft Invalid fraction leftovers. Tests-only.
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

describe('Wave 60 demos — frac invalid format hint', () => {
  it('bad arithmetic input paints exact Use format like hint', () => {
    const root = mount();
    renderFractionDemo(root);
    (root.querySelector('#fraction-a') as HTMLInputElement).value = 'nope';
    (root.querySelector('#calculate-btn') as HTMLButtonElement).click();
    expect(root.querySelector('#arithmetic-result')?.textContent).toBe(
      'Invalid fraction format. Use format like "3/4" or "1 1/2"'
    );
  });
});
