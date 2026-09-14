/**
 * Wave 61 leftover after #301 (unit-only) — Attribute set-result valid/invalid inject CSS leftovers.
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

describe('Wave 61 demos — attr set-result CSS', () => {
  it('locks .set-result.valid / .invalid verdict chrome', () => {
    const root = mount();
    renderAttributeDemo(root);
    const css = root.querySelector('style')?.textContent ?? '';
    expect(css).toContain('.set-result.valid {');
    expect(css).toContain('background: #e8f5e9');
    expect(css).toContain('color: #2e7d32');
    expect(css).toContain('.set-result.invalid {');
    expect(css).toContain('background: #ffebee');
    expect(css).toContain('color: #c62828');
  });
});
