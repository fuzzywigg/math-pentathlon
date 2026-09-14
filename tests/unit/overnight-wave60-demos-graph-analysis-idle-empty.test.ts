/**
 * Wave 60 leftover after #290 (unit-only) — Graph analysis idle empty/Total exact.
 * Distinct from wave56 Blue/Red card headings leftover. Tests-only.
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

describe('Wave 60 demos — graph analysis idle empty', () => {
  it('idle Board Status paints N empty matching Total N nodes', () => {
    const root = mount();
    renderGraphDemo(root);
    const text = root.querySelector('#game-analysis')?.textContent ?? '';
    const emptyMatch = /(\d+)\s+empty/.exec(text);
    const totalMatch = /Total:\s*(\d+)\s+nodes/.exec(text);
    expect(emptyMatch).toBeTruthy();
    expect(totalMatch).toBeTruthy();
    expect(Number(emptyMatch![1])).toBe(Number(totalMatch![1]));
    expect(text).toContain('0 nodes');
    expect(text).toContain('0 region(s)');
  });
});
