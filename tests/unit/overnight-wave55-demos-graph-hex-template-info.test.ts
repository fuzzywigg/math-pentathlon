/**
 * Wave 55 leftover after #250 — Graph hex lattice template info chrome.
 * Distinct from wave51 Path from status. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderGraphDemo } from '../../src/demos/graph-demo';
import { mountRoot } from './helpers/dom';

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 55 demos — graph hex template', () => {
  it('hex button selects and fills Nodes/Edges/Connected info', () => {
    const root = mountRoot();
    renderGraphDemo(root);
    const hex = root.querySelector(
      '.template-btn[data-template="hex"]'
    ) as HTMLButtonElement;
    hex.click();
    expect(hex.classList.contains('selected')).toBe(true);
    const info = root.querySelector('#template-info')?.textContent ?? '';
    expect(info).toMatch(/Nodes:/);
    expect(info).toMatch(/Edges:/);
    expect(info).toMatch(/Connected:/);
    expect(info).toMatch(/Components:/);
    expect(root.querySelectorAll('#template-graph .graph-node').length).toBeGreaterThan(1);
  });
});
