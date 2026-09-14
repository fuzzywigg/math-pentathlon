/**
 * Overnight HEAVY leftover after #274 — Graph default grid template chrome.
 * Distinct from wave57 complete / wave56 star+circular. Tests-only.
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

describe('Wave 58 demos — graph grid default template', () => {
  it('default selected grid reports Nodes:16 and Connected Yes', () => {
    const root = mount();
    renderGraphDemo(root);
    const btn = root.querySelector(
      '.template-btn[data-template="grid"]'
    ) as HTMLButtonElement;
    expect(btn.classList.contains('selected')).toBe(true);
    const info = root.querySelector('#template-info')?.textContent ?? '';
    expect(info).toMatch(/Nodes:\s*16/);
    expect(info).toMatch(/Connected:\s*Yes/);
    expect(root.querySelectorAll('#template-graph .graph-node').length).toBe(16);
  });
});
