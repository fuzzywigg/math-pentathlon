/**
 * Wave 64 leftover after tip/#303 (unit-only) — graph analysis auto fit.
 * Distinct from wave58–60 demos chrome leftovers. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderGraphDemo } from '../../src/demos/graph-demo';

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

describe('Wave 64 demos — graph analysis auto-fit grid', () => {
  it('locks .game-analysis auto-fit minmax(200px, 1fr)', () => {
    const root = mount();
    renderGraphDemo(root);
    const css = root.querySelector('style')?.textContent ?? '';
    expect(css).toContain(
      'grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))'
    );
  });
});
