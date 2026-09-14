/**
 * Wave 60 leftover after #290 (unit-only) — Fraction equals exact comparison copy.
 * Distinct from wave59 less/greater + soft equals leftover. Tests-only.
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

describe('Wave 60 demos — frac equals exact', () => {
  it('1/2 vs 2/4 paints exact equals copy', () => {
    const root = mount();
    renderFractionDemo(root);
    (root.querySelector('#compare-a') as HTMLInputElement).value = '1/2';
    (root.querySelector('#compare-b') as HTMLInputElement).value = '2/4';
    (root.querySelector('#compare-btn') as HTMLButtonElement).click();
    expect(root.querySelector('.comparison-text')?.textContent).toBe(
      '1/2 equals 2/4'
    );
  });
});
