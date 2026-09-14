/**
 * Wave 59 leftover after #281 (unit-only) — Fraction arithmetic/interactive labels.
 * Distinct from wave58 h2 + wave56 invalid-format leftovers. Tests-only.
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

describe('Wave 59 demos — frac arithmetic labels', () => {
  it('exposes Fraction A/B, Denominator, Calculate exact labels', () => {
    const root = mount();
    renderFractionDemo(root);
    const labels = [...root.querySelectorAll('label')].map(
      (el) => el.textContent ?? ''
    );
    expect(labels).toContain('Fraction A:');
    expect(labels).toContain('Fraction B:');
    expect(labels).toContain('Denominator:');
    expect(root.querySelector('#calculate-btn')?.textContent).toBe('Calculate');
  });
});
