/**
 * Wave 61 leftover after #301 (unit-only) — Align demo-board className leftovers.
 * Distinct from wave60 idle status/info + potential instructions. Tests-only.
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

describe('Wave 61 demos — align board class names', () => {
  it('mounts four/hex/potential boards with demo-board + variant classes', () => {
    const root = mount();
    renderAlignmentDemo(root);
    expect(root.querySelector('#four-board')?.className).toBe(
      'demo-board four-board'
    );
    expect(root.querySelector('#hex-board')?.className).toBe(
      'demo-board hex-board'
    );
    expect(root.querySelector('#potential-board')?.className).toBe(
      'demo-board potential-board'
    );
  });
});
