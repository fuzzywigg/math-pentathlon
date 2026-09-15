/**
 * Wave 67 leftover after tip/#324 (unit-only) — expr equation-result fontsize.
 * Distinct from wave64 demos residual leftovers (#311). Tests-only.
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

describe('Wave 67 demos — expr #equation-result font-size 1.25rem', () => {
  it('locks #equation-result font-size 1.25rem', () => {
    const root = mount();
    renderExpressionDemo(root);
    const css = root.querySelector('style')?.textContent ?? '';
    expect(css).toContain('#equation-result');
    expect(css).toContain('font-size: 1.25rem');
  });
});
