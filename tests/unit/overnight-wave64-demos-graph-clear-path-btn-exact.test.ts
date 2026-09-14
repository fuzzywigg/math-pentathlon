/**
 * Wave 64 leftover after tip/#303 (unit-only) — graph clear path btn exact.
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

describe('Wave 64 demos — graph clear-path btn exact', () => {
  it('locks #clear-path-btn label Clear (not Clear Board)', () => {
    const root = mount();
    renderGraphDemo(root);
    expect(root.querySelector('#clear-path-btn')?.textContent).toBe('Clear');
    expect(root.querySelector('#clear-game-btn')?.textContent).toBe(
      'Clear Board'
    );
  });
});
