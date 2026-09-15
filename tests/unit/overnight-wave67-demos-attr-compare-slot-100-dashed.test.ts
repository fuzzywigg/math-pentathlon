/**
 * Wave 67 leftover after tip/#324 (unit-only) — attr compare-slot dashed.
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

describe('Wave 67 demos — attr compare-slot 100 dashed', () => {
  it('locks .compare-slot 100px + 2px dashed #ccc', () => {
    const root = mount();
    renderAttributeDemo(root);
    const css = root.querySelector('style')?.textContent ?? '';
    expect(css).toMatch(/\.compare-slot\s*\{[^}]*width:\s*100px/);
    expect(css).toMatch(/\.compare-slot\s*\{[^}]*height:\s*100px/);
    expect(css).toContain('border: 2px dashed #ccc');
  });
});
