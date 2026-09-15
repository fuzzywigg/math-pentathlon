/**
 * Wave 67 leftover after tip/#324 (unit-only) — attr tag diff orange.
 * Distinct from wave64 demos residual leftovers (#311). Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderAttributeDemo } from '../../src/demos/attribute-demo';

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

describe('Wave 67 demos — attr-tag.diff orange css', () => {
  it('locks .attr-tag.diff #fff3e0 / #ef6c00', () => {
    const root = mount();
    renderAttributeDemo(root);
    const css = root.querySelector('style')?.textContent ?? '';
    expect(css).toContain('.attr-tag.diff');
    expect(css).toContain('background: #fff3e0');
    expect(css).toContain('color: #ef6c00');
  });
});
