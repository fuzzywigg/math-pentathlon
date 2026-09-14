/**
 * Wave 56 leftover after #256 — Graph circular template demo chrome.
 * Distinct from wave55 hex/track leftovers and demos path-restart circular click. Tests-only.
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

describe('Wave 56 demos — graph circular template', () => {
  it('circular (8) selects and reports 8 nodes with Connected Yes', () => {
    const root = mount();
    renderGraphDemo(root);
    const circular = root.querySelector(
      '.template-btn[data-template="circular"]'
    ) as HTMLButtonElement;
    expect(circular.textContent).toMatch(/Circular \(8\)/);
    circular.click();
    expect(circular.classList.contains('selected')).toBe(true);
    const info = root.querySelector('#template-info')?.textContent ?? '';
    expect(info).toMatch(/Nodes:\s*8/);
    expect(info).toMatch(/Edges:/);
    expect(info).toMatch(/Connected:\s*Yes/);
    expect(root.querySelectorAll('#template-graph .graph-node').length).toBe(8);
  });
});
