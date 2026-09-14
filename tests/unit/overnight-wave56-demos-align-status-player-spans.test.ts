/**
 * Wave 56 leftover after #256 — Alignment status .player-x / .player-o / .player-b spans.
 * Distinct from win/winner-cell leftovers. Tests-only.
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

describe('Wave 56 demos — align status player spans', () => {
  it('four mounts .player-x X then .player-o O after one drop; hex mounts .player-b', () => {
    const root = mount();
    renderAlignmentDemo(root);

    expect(root.querySelector('#four-status .player-x')?.textContent).toBe('X');
    const cell = root.querySelector(
      '#four-board .demo-cell[data-col="0"]'
    ) as HTMLElement;
    cell.click();
    expect(root.querySelector('#four-status .player-o')?.textContent).toBe('O');

    expect(root.querySelector('#hex-status .player-b')?.textContent).toBe('Blue');
  });
});
