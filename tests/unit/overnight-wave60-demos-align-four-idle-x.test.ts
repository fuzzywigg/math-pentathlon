/**
 * Wave 60 leftover after #290 (unit-only) — Align four idle Current player X.
 * Distinct from wave59 reset/instructions leftovers. Tests-only.
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

describe('Wave 60 demos — align four idle X', () => {
  it('four status mounts Current player X with .player-x span', () => {
    const root = mount();
    renderAlignmentDemo(root);
    const status = root.querySelector('#four-status');
    expect(status?.textContent).toBe('Current player: X');
    expect(status?.querySelector('.player-x')?.textContent).toBe('X');
  });
});
