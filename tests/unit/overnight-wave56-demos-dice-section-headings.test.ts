/**
 * Wave 56 leftover after #256 — Dice demo section heading chrome.
 * Distinct from wave55 log-cap-20 leftover. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderDiceDemo } from '../../src/demos/dice-demo';

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

describe('Wave 56 demos — dice section headings', () => {
  it('mounts Quick Roll / Prime Gold / Possible Sums section chrome', () => {
    const root = mount();
    renderDiceDemo(root);
    const headings = [...root.querySelectorAll('.demo-section h2')].map(
      (h) => h.textContent ?? ''
    );
    expect(headings.some((t) => /Quick Roll \(No Animation\)/.test(t))).toBe(true);
    expect(headings.some((t) => /Prime Gold Style/.test(t))).toBe(true);
    expect(headings.some((t) => /Possible Sums Display/.test(t))).toBe(true);
    expect(root.querySelector('#selector-poly')).toBeTruthy();
    expect(root.querySelector('#selector-sums')).toBeTruthy();
    expect(root.querySelector('#quick-roll-result')?.textContent).toMatch(
      /Click a button to roll/i
    );
  });
});
