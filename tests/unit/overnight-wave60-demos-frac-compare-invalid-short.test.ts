/**
 * Wave 60 leftover after #290 (unit-only) — Frac compare invalid short format.
 * Distinct from arithmetic Use format like hint leftover. Tests-only.
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

describe('Wave 60 demos — frac compare invalid short', () => {
  it('bad compare input paints exact Invalid fraction format', () => {
    const root = mount();
    renderFractionDemo(root);
    (root.querySelector('#compare-a') as HTMLInputElement).value = 'xyz';
    (root.querySelector('#compare-btn') as HTMLButtonElement).click();
    expect(root.querySelector('#comparison-result')?.textContent).toBe(
      'Invalid fraction format'
    );
  });
});
