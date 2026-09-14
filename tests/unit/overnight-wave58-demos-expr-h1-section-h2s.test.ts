/**
 * Wave 58 leftover after #267 — Expr h1 + section h2 catalog.
 * Distinct from true/false equation leftovers. Tests-only.
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

describe('Wave 58 demos — expr h1 + section h2s', () => {
  it('mounts Expression Builder Demo and section h2 catalog', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    renderExpressionDemo(root);
    expect(root.querySelector('h1')?.textContent?.trim()).toBe(
      'Expression Builder Demo'
    );
    const h2s = [...root.querySelectorAll('h2')].map((h) => h.textContent?.trim());
    expect(h2s).toContain('Expression Evaluator');
    expect(h2s).toContain('Target Number Game');
    expect(h2s).toContain('24 Game Solver');
    expect(h2s).toContain('Equation Checker');
    expect(h2s).toContain('Card Builder');
  });
});
