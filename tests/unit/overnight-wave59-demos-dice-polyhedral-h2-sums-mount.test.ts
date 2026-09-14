/**
 * Wave 59 leftover after #281 — Dice polyhedral selector h2 + #selector-sums mount.
 * Distinct from wave58 Dice System Demo / Quick Roll / Possible Sums titles. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderDiceDemo } from '../../src/demos/dice-demo';

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 59 demos — dice polyhedral h2 + sums mount', () => {
  it('exposes 3 Polyhedral h2 and mounts #selector-sums', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    renderDiceDemo(root);
    const h2s = [...root.querySelectorAll('h2')].map((h) => h.textContent?.trim());
    expect(h2s).toContain(
      'Interactive Selector (3 Polyhedral - Prime Gold Style)'
    );
    expect(root.querySelector('#selector-sums')).toBeTruthy();
  });
});
