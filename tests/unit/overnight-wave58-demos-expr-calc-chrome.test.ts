/**
 * Wave 58 leftover after #267 — Expr calculator placeholder + example btn.
 * Distinct from section h2 leftover. Tests-only.
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

describe('Wave 58 demos — expr calc chrome', () => {
  it('exposes calc placeholder and 2 + 3 × 4 example button', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    renderExpressionDemo(root);
    expect(
      (root.querySelector('#calc-input') as HTMLInputElement)?.placeholder
    ).toBe('e.g., 2 + 3 * 4');
    const examples = [...root.querySelectorAll('.example-btn')].map(
      (b) => b.textContent?.trim()
    );
    expect(examples).toContain('2 + 3 × 4');
  });
});
