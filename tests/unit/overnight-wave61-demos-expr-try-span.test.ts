/**
 * Wave 61 leftover after #301 (unit-only) — Expression Try: lead-in span exact.
 * Distinct from wave59 example button labels leftover. Tests-only.
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

describe('Wave 61 demos — expr Try span', () => {
  it('mounts exact Try: span before example buttons', () => {
    const root = mount();
    renderExpressionDemo(root);
    expect(
      root.querySelector('.example-expressions > span')?.textContent
    ).toBe('Try:');
  });
});
