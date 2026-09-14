/**
 * Wave 64 leftover after tip/#303 (unit-only) — align hex clip path.
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

describe('Wave 64 demos — align hex clip-path', () => {
  it('locks hex cell clip-path polygon + 36px size', () => {
    const root = mount();
    renderAlignmentDemo(root);
    const css = root.querySelector('style')?.textContent ?? '';
    expect(css).toContain(
      'clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
    );
    expect(css).toMatch(/\.demo-hex-cell\s*\{[^}]*width:\s*36px/);
    expect(css).toMatch(/\.demo-hex-cell\s*\{[^}]*height:\s*36px/);
  });
});
