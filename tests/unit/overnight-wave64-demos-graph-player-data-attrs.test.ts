/**
 * Wave 64 leftover after tip/#303 (unit-only) — graph player data attrs.
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

describe('Wave 64 demos — graph player data-player attrs', () => {
  it('locks Player 1/2 data-player attrs + idle selected P1', () => {
    const root = mount();
    renderGraphDemo(root);
    const p1 = root.querySelector('.player-btn[data-player="1"]');
    const p2 = root.querySelector('.player-btn[data-player="2"]');
    expect(p1?.classList.contains('selected')).toBe(true);
    expect(p2?.classList.contains('selected')).toBe(false);
    expect(p1?.textContent).toBe('Player 1');
    expect(p2?.textContent).toBe('Player 2');
  });
});
