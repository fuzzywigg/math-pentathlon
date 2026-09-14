/**
 * Wave 58 leftover after #267 — Graph analysis opening empty/Total exact.
 * Distinct from wave56 Blue/Red headings leftover. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderGraphDemo } from '../../src/demos/graph-demo';

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 58 demos — graph analysis empty mount', () => {
  it('opening analysis shows 0 nodes and empty equals Total', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    renderGraphDemo(root);
    const text = root.querySelector('#game-analysis')?.textContent ?? '';
    expect(text).toMatch(/0 nodes/);
    expect(text).toMatch(/0 region\(s\)/);
    const empty = text.match(/(\d+) empty/);
    const total = text.match(/Total:\s*(\d+) nodes/);
    expect(empty?.[1]).toBe(total?.[1]);
  });
});
