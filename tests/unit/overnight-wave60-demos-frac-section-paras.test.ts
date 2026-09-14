/**
 * Wave 60 leftover after #290 (unit-only) — Fraction section support paragraphs.
 * Distinct from wave59 lower-section titles + visual h3 catalog. Tests-only.
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

describe('Wave 60 demos — frac section paras', () => {
  it('exposes exact fraction section support paragraphs', () => {
    const root = mount();
    renderFractionDemo(root);
    const paras = [...root.querySelectorAll('.demo-section > p')].map(
      (el) => el.textContent ?? ''
    );
    expect(paras).toContain('Different styles of fraction visualization');
    expect(paras).toContain('Enter two fractions to perform operations');
    expect(paras).toContain('Click segments to set the fraction value');
    expect(paras).toContain('Compare two fractions visually');
    expect(paras).toContain('Find equivalent fractions for a given value');
    expect(paras).toContain(
      'Visual reference of common fractions used in Math Pentathlon'
    );
  });
});
