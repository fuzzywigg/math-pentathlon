/**
 * Wave 64 leftover after tip/#303 (unit-only) — graph analysis h4 catalog.
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

describe('Wave 64 demos — graph analysis h4 catalog', () => {
  it('locks exact analysis-card h4 titles on idle mount', () => {
    const root = mount();
    renderGraphDemo(root);
    expect(
      [...root.querySelectorAll('#game-analysis h4')].map(
        (el) => el.textContent ?? ''
      )
    ).toEqual(['Player 1 (Blue)', 'Player 2 (Red)', 'Board Status']);
  });
});
