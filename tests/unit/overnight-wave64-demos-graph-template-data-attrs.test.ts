/**
 * Wave 64 leftover after tip/#303 (unit-only) — graph template data attrs.
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

describe('Wave 64 demos — graph template data-template catalog', () => {
  it('locks data-template attrs across template buttons', () => {
    const root = mount();
    renderGraphDemo(root);
    expect(
      [...root.querySelectorAll('.template-btn')].map((b) =>
        b.getAttribute('data-template')
      )
    ).toEqual(['grid', 'circular', 'star', 'hex', 'track', 'complete']);
  });
});
