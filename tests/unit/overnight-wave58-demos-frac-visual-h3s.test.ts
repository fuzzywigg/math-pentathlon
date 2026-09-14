/**
 * Wave 58 leftover after #267 — Fraction visual section h3 catalog.
 * Distinct from wave56 4dp / invalid format leftovers. Tests-only.
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

describe('Wave 58 demos — frac visual h3s', () => {
  it('exposes Horizontal/Vertical Bars and Circle Pie h3s', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    renderFractionDemo(root);
    const h3s = [...root.querySelectorAll('h3')].map((h) => h.textContent?.trim());
    expect(h3s).toContain('Horizontal Bars');
    expect(h3s).toContain('Vertical Bars');
    expect(h3s).toContain('Circle (Pie) Charts');
  });
});
