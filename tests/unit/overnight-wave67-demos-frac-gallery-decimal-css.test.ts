/**
 * Wave 67 leftover after tip/#324 (unit-only) — frac gallery decimal css.
 * Distinct from wave64 demos residual leftovers (#311). Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderFractionDemo } from '../../src/demos/fraction-demo';

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

describe('Wave 67 demos — frac gallery-item decimal css', () => {
  it('locks .gallery-item .decimal 0.75rem + #888', () => {
    const root = mount();
    renderFractionDemo(root);
    const css = root.querySelector('style')?.textContent ?? '';
    expect(css).toContain('.gallery-item .decimal');
    expect(css).toContain('font-size: 0.75rem');
    expect(css).toContain('color: #888');
  });
});
