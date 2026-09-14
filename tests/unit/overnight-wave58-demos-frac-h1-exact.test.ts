/**
 * Wave 58 leftover after #267 — Fraction demo exact h1.
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

describe('Wave 58 demos — frac h1 exact', () => {
  it('mounts Fraction System Demo h1', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    renderFractionDemo(root);
    expect(root.querySelector('h1')?.textContent?.trim()).toBe(
      'Fraction System Demo'
    );
  });
});
