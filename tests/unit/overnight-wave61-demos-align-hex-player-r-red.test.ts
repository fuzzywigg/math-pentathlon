/**
 * Wave 61 leftover after #301 (unit-only) — Align hex post-Blue Current player Red.
 * Distinct from wave60 idle Blue / .player-b leftover. Tests-only.
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

describe('Wave 61 demos — align hex player-r Red', () => {
  it('after Blue place, hex status paints Red with .player-r', () => {
    const root = mount();
    renderAlignmentDemo(root);
    (
      root.querySelector(
        '#hex-board .demo-hex-cell[data-row="0"][data-col="0"]'
      ) as HTMLElement
    ).click();
    const status = root.querySelector('#hex-status');
    expect(status?.textContent).toBe('Current player: Red');
    expect(status?.querySelector('.player-r')?.textContent).toBe('Red');
  });
});
