/**
 * Wave 59 leftover after #281 — Expr Target Number Game h2.
 * Distinct from Evaluator/Equation/Card Builder leftover. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderExpressionDemo } from '../../src/demos/expression-demo';

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 59 demos — expr Target Number h2', () => {
  it('exposes Target Number Game section h2', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    renderExpressionDemo(root);
    const h2s = [...root.querySelectorAll('h2')].map((h) => h.textContent?.trim());
    expect(h2s).toContain('Target Number Game');
  });
});
