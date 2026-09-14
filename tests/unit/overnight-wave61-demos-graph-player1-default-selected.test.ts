/**
 * Wave 61 leftover after #301 (unit-only) — Graph Player 1 default selected class.
 * Distinct from wave60 Player 2 selected leftover. Tests-only.
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

describe('Wave 61 demos — graph player1 default selected', () => {
  it('mounts Player 1 selected and Player 2 not selected', () => {
    const root = mount();
    renderGraphDemo(root);
    const p1 = root.querySelector('.player-btn[data-player="1"]');
    const p2 = root.querySelector('.player-btn[data-player="2"]');
    expect(p1?.classList.contains('selected')).toBe(true);
    expect(p2?.classList.contains('selected')).toBe(false);
  });
});
