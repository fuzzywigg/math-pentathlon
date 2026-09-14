/**
 * Wave 64 leftover after tip/#303 (unit-only) — align demo cell 50px.
 * Distinct from wave58–60 demos chrome leftovers. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderAlignmentDemo } from '../../src/demos/alignment-demo';

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

describe('Wave 64 demos — align demo-cell 50×50', () => {
  it('locks .demo-cell width/height 50px', () => {
    const root = mount();
    renderAlignmentDemo(root);
    const css = root.querySelector('style')?.textContent ?? '';
    expect(css).toMatch(/\.demo-cell\s*\{[^}]*width:\s*50px/);
    expect(css).toMatch(/\.demo-cell\s*\{[^}]*height:\s*50px/);
  });
});
