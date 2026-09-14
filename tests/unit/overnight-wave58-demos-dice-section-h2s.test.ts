/**
 * Wave 58 leftover after #267 — Dice section h2 catalog.
 * Distinct from wave56 Roll NdM labels. Tests-only.
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

describe('Wave 58 demos — dice section h2s', () => {
  it('exposes Quick Roll / Interactive Selector / Possible Sums h2s', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    renderDiceDemo(root);
    const h2s = [...root.querySelectorAll('h2')].map((h) => h.textContent?.trim());
    expect(h2s).toContain('Quick Roll (No Animation)');
    expect(h2s).toContain('Interactive Selector (2d6 - Standard)');
    expect(h2s).toContain('Interactive Selector (3 Polyhedral - Prime Gold Style)');
    expect(h2s).toContain('Possible Sums Display');
  });
});
