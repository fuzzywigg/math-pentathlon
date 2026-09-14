/**
 * Wave 64 leftover after tip/#303 (unit-only) — attr set result valid invalid css.
 * Distinct from wave58–60 demos chrome leftovers. Tests-only.
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

describe('Wave 64 demos — attr set-result valid/invalid CSS', () => {
  it('locks .set-result.valid/.invalid palette leftovers', () => {
    const root = mount();
    renderAttributeDemo(root);
    const css = root.querySelector('style')?.textContent ?? '';
    expect(css).toContain('.set-result.valid');
    expect(css).toContain('.set-result.invalid');
    expect(css).toContain('background: #e8f5e9');
    expect(css).toContain('background: #ffebee');
  });
});
