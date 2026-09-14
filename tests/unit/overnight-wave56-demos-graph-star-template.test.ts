/**
 * Wave 56 leftover after #256 — Graph star template demo chrome.
 * Distinct from wave55 hex/track/complete leftovers. Tests-only.
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

describe('Wave 56 demos — graph star template', () => {
  it('star (6) selects and reports 7 nodes with Connected Yes', () => {
    const root = mount();
    renderGraphDemo(root);
    const star = root.querySelector(
      '.template-btn[data-template="star"]'
    ) as HTMLButtonElement;
    expect(star.textContent).toMatch(/Star \(6\)/);
    star.click();
    expect(star.classList.contains('selected')).toBe(true);
    const info = root.querySelector('#template-info')?.textContent ?? '';
    expect(info).toMatch(/Nodes:\s*7/);
    expect(info).toMatch(/Connected:\s*Yes/);
    expect(root.querySelectorAll('#template-graph .graph-node').length).toBe(7);
  });
});
