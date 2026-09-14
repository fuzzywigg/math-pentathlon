/**
 * Wave 61 leftover after #301 (unit-only) — Attribute attr-tag match/diff inject CSS leftovers.
 * Distinct from wave60 demos residual leftovers. Tests-only.
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

describe('Wave 61 demos — attr-tag colors CSS', () => {
  it('locks match green / diff orange attr-tag chrome', () => {
    const root = mount();
    renderAttributeDemo(root);
    const css = root.querySelector('style')?.textContent ?? '';
    expect(css).toContain('.attr-tag.match {');
    expect(css).toContain('background: #e8f5e9');
    expect(css).toContain('color: #2e7d32');
    expect(css).toContain('.attr-tag.diff {');
    expect(css).toContain('background: #fff3e0');
    expect(css).toContain('color: #ef6c00');
  });
});
