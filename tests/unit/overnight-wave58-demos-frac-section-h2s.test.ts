/**
 * Wave 58 leftover after #267 — Fraction section h2 catalog.
 * Distinct from visual h3 leftover. Tests-only.
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

describe('Wave 58 demos — frac section h2s', () => {
  it('exposes Visual/Arithmetic/Interactive/Comparison/Equivalent/Gallery h2s', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    renderFractionDemo(root);
    const h2s = [...root.querySelectorAll('h2')].map((h) => h.textContent?.trim() ?? '');
    expect(h2s.some((t) => t.includes('Visual'))).toBe(true);
    expect(h2s.some((t) => t.includes('Arithmetic'))).toBe(true);
    expect(h2s.some((t) => t.includes('Interactive'))).toBe(true);
    expect(h2s.some((t) => t.includes('Comparison'))).toBe(true);
    expect(h2s.some((t) => t.includes('Equivalent'))).toBe(true);
    expect(h2s.some((t) => t.includes('Gallery'))).toBe(true);
  });
});
