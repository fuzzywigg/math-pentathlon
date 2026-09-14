/**
 * Wave 59 leftover after #281 (unit-only) — Graph Player/Clear Board control labels.
 * Distinct from wave56 analysis Blue/Red leftovers. Tests-only.
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

describe('Wave 59 demos — graph player clear board btns', () => {
  it('exposes Player 1 / Player 2 / Clear Board exact labels', () => {
    const root = mount();
    renderGraphDemo(root);
    const playerLabels = [...root.querySelectorAll('.player-btn')].map(
      (el) => el.textContent ?? ''
    );
    expect(playerLabels).toContain('Player 1');
    expect(playerLabels).toContain('Player 2');
    expect(root.querySelector('#clear-game-btn')?.textContent).toBe('Clear Board');
  });
});
