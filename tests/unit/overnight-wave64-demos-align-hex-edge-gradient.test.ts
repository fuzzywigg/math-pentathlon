/**
 * Wave 64 leftover after tip/#303 (unit-only) — align hex edge gradient.
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

describe('Wave 64 demos — align hex edge gradient', () => {
  it('locks hex-board blue/red edge linear-gradient', () => {
    const root = mount();
    renderAlignmentDemo(root);
    const css = root.querySelector('style')?.textContent ?? '';
    expect(css).toContain(
      'linear-gradient(135deg, #1976d2 0%, #1976d2 10%, transparent 10%, transparent 90%, #d32f2f 90%)'
    );
  });
});
