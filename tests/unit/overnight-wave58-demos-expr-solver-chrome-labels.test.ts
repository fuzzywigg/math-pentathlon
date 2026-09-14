/**
 * Wave 58 leftover after #267 — Expr 24 Game Solver chrome labels.
 * Distinct from wave56 No solutions leftover. Tests-only.
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

describe('Wave 58 demos — expr solver chrome', () => {
  it('exposes 24 Game Solver h2 and Find Solutions button', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    renderExpressionDemo(root);
    const h2s = [...root.querySelectorAll('h2')].map((h) => h.textContent?.trim());
    expect(h2s).toContain('24 Game Solver');
    expect(root.querySelector('#solve-btn')?.textContent?.trim()).toBe(
      'Find Solutions'
    );
  });
});
