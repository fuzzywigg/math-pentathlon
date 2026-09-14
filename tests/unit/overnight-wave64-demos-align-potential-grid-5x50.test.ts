/**
 * Wave 64 leftover after tip/#303 (unit-only) — align potential grid 5x50.
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

describe('Wave 64 demos — align potential-board 5×50 grid', () => {
  it('locks potential-board grid-template-columns repeat(5, 50px)', () => {
    const root = mount();
    renderAlignmentDemo(root);
    const css = root.querySelector('style')?.textContent ?? '';
    expect(css).toContain('grid-template-columns: repeat(5, 50px)');
    expect(css).toContain('.potential-board');
  });
});
