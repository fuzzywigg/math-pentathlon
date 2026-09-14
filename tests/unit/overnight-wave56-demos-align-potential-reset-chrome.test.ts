/**
 * Wave 56 leftover after #256 — Alignment four-info / potential Reset label chrome.
 * Distinct from wave55 four-board dataset leftover. Tests-only.
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

describe('Wave 56 demos — align potential reset chrome', () => {
  it('potential section mounts Reset control and default info copy', () => {
    const root = mount();
    renderAlignmentDemo(root);
    expect(root.querySelector('#potential-reset')?.textContent).toMatch(/^Reset$/);
    expect(root.querySelector('#potential-info')?.textContent ?? '').toMatch(
      /Click a cell to see alignment potential/i
    );
    expect(root.querySelector('#potential-board')).toBeTruthy();
    expect(
      [...root.querySelectorAll('h3')].some((h) =>
        /Alignment Potential Analysis/.test(h.textContent ?? '')
      )
    ).toBe(true);
  });
});
