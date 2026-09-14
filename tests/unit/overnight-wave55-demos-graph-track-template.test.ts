/**
 * Wave 55 leftover after #250 — Graph track template 10-node chrome.
 * Tests-only.
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

describe('Wave 55 demos — graph track template', () => {
  it('track template reports 10 nodes and stays selected', () => {
    const root = mount();
    renderGraphDemo(root);
    const track = root.querySelector(
      '.template-btn[data-template="track"]'
    ) as HTMLButtonElement;
    track.click();
    expect(track.classList.contains('selected')).toBe(true);
    expect(
      root.querySelector('.template-btn[data-template="grid"]')?.classList.contains(
        'selected'
      )
    ).toBe(false);
    expect(root.querySelector('#template-info')?.textContent ?? '').toMatch(/Nodes:\s*10/);
    expect(root.querySelectorAll('#template-graph .graph-node').length).toBe(10);
  });
});
