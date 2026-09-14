/**
 * Wave 61 leftover after #301 (unit-only) — Graph connectivity-info idle empty.
 * Distinct from wave60 analysis idle empty leftover. Tests-only.
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

describe('Wave 61 demos — graph connectivity empty', () => {
  it('mounts empty #connectivity-info', () => {
    const root = mount();
    renderGraphDemo(root);
    expect(root.querySelector('#connectivity-info')?.textContent).toBe('');
  });
});
