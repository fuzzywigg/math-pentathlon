/**
 * Wave 58 leftover after #267 — Fraction Find Equivalents CTA label.
 * Distinct from equiv result leftovers. Tests-only.
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

describe('Wave 58 demos — frac Find Equivalents', () => {
  it('exposes Find Equivalents button label', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    renderFractionDemo(root);
    expect(root.querySelector('#find-equiv-btn')?.textContent?.trim()).toBe(
      'Find Equivalents'
    );
  });
});
