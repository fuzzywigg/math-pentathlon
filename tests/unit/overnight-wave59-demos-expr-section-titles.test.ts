/**
 * Wave 59 leftover after #281 (unit-only) — Expression demo exact h1/h2 section titles.
 * Distinct from wave58 True! bang + wave56 challenge-grid leftovers. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderExpressionDemo } from '../../src/demos/expression-demo';

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

describe('Wave 59 demos — expr section titles', () => {
  it('exposes Expression Builder Demo h1 and catalog h2s', () => {
    const root = mount();
    renderExpressionDemo(root);
    expect(root.querySelector('h1')?.textContent).toBe('Expression Builder Demo');
    const h2 = [...root.querySelectorAll('h2')].map((el) => el.textContent ?? '');
    expect(h2).toContain('Expression Evaluator');
    expect(h2).toContain('Target Number Game');
    expect(h2).toContain('24 Game Solver');
    expect(h2).toContain('Equation Checker');
    expect(h2).toContain('Card Builder');
  });
});
