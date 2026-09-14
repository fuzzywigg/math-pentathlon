/**
 * Wave 60 leftover after #290 (unit-only) — Graph Player 2 selected class toggle.
 * Distinct from wave59 player-clear btn labels leftover. Tests-only.
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

describe('Wave 60 demos — graph player2 selected', () => {
  it('Player 2 click gains .selected; Player 1 loses it', () => {
    const root = mount();
    renderGraphDemo(root);
    const p1 = root.querySelector(
      '.player-btn[data-player="1"]'
    ) as HTMLButtonElement;
    const p2 = root.querySelector(
      '.player-btn[data-player="2"]'
    ) as HTMLButtonElement;
    expect(p1.classList.contains('selected')).toBe(true);
    expect(p2.classList.contains('selected')).toBe(false);
    p2.click();
    expect(p2.classList.contains('selected')).toBe(true);
    expect(p1.classList.contains('selected')).toBe(false);
  });
});
