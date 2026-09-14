/**
 * Wave 59 leftover after #281 (unit-only) — Expression example button display labels.
 * Distinct from wave55 power data-expr click leftover. Tests-only.
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

describe('Wave 59 demos — expr example btn labels', () => {
  it('exposes exact unicode example button labels', () => {
    const root = mount();
    renderExpressionDemo(root);
    const labels = [...root.querySelectorAll('.example-btn')].map(
      (el) => el.textContent ?? ''
    );
    expect(labels).toContain('2 + 3 × 4');
    expect(labels).toContain('(2 + 3) × 4');
    expect(labels).toContain('10 ÷ 2 - 3');
    expect(labels).toContain('2³ + 1');
  });
});
