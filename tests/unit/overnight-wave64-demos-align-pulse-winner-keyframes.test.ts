/**
 * Wave 64 leftover after tip/#303 (unit-only) — align pulse winner keyframes.
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

describe('Wave 64 demos — align pulse-winner keyframes', () => {
  it('locks @keyframes pulse-winner + winning-cell animation', () => {
    const root = mount();
    renderAlignmentDemo(root);
    const css = root.querySelector('style')?.textContent ?? '';
    expect(css).toContain('@keyframes pulse-winner');
    expect(css).toContain('animation: pulse-winner 0.5s ease infinite');
    expect(css).toContain('box-shadow: 0 0 10px rgba(76, 175, 80, 0.5)');
  });
});
