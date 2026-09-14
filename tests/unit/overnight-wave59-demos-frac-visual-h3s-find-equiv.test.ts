/**
 * Wave 59 leftover after #281 — Fraction visual h3s + Find Equivalents + leftover h2s.
 * Distinct from wave58 Fraction System Demo / Visual/Arithmetic/Interactive h2s. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderFractionDemo } from '../../src/demos/fraction-demo';

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 59 demos — frac visual h3s + Find Equivalents', () => {
  it('locks visual h3s, Find Equivalents, and Comparison/Equivalent/Gallery h2s', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    renderFractionDemo(root);
    const h3s = [...root.querySelectorAll('h3')].map((h) => h.textContent?.trim());
    expect(h3s).toContain('Horizontal Bars');
    expect(h3s).toContain('Vertical Bars');
    expect(h3s).toContain('Circle (Pie) Charts');
    expect(root.querySelector('#find-equiv-btn')?.textContent?.trim()).toBe(
      'Find Equivalents'
    );
    const h2s = [...root.querySelectorAll('h2')].map((h) => h.textContent?.trim());
    expect(h2s).toContain('Fraction Comparison');
    expect(h2s).toContain('Equivalent Fractions');
    expect(h2s).toContain('Common Fractions Gallery');
  });
});
