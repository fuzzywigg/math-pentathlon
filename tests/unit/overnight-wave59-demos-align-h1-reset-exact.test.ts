/**
 * Wave 59 leftover after #281 (unit-only) — Alignment h1 + Reset Game exact.
 * Distinct from wave58 h3 + Winner: Blue leftovers. Tests-only.
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

describe('Wave 59 demos — align h1 reset exact', () => {
  it('exposes Alignment Detection Demo h1 and Reset Game buttons', () => {
    const root = mount();
    renderAlignmentDemo(root);
    expect(root.querySelector('h1')?.textContent).toBe(
      '🔗 Alignment Detection Demo'
    );
    expect(root.querySelector('#four-reset')?.textContent).toBe('Reset Game');
    expect(root.querySelector('#hex-reset')?.textContent).toBe('Reset Game');
  });
});
