/**
 * Wave 55 leftover after #250 — Graph complete-5 template info chrome.
 * Distinct from hex/track leftovers; poly diceType log is a dead ID leftover. Tests-only.
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

describe('Wave 55 demos — graph complete template', () => {
  it('complete template reports 5 nodes and Connected Yes', () => {
    const root = mount();
    renderGraphDemo(root);
    const complete = root.querySelector(
      '.template-btn[data-template="complete"]'
    ) as HTMLButtonElement;
    complete.click();
    expect(complete.classList.contains('selected')).toBe(true);
    const info = root.querySelector('#template-info')?.textContent ?? '';
    expect(info).toMatch(/Nodes:\s*5/);
    expect(info).toMatch(/Connected:\s*Yes/);
    expect(root.querySelectorAll('#template-graph .graph-node').length).toBe(5);
  });
});
