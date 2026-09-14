/**
 * Wave 60 leftover after #290 (unit-only) — Align hex idle region info.
 * Distinct from wave58 Winner: Blue! leftover. Tests-only.
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

describe('Wave 60 demos — align hex idle regions', () => {
  it('hex-info mounts Blue/Red 0 region(s), largest: 0', () => {
    const root = mount();
    renderAlignmentDemo(root);
    const info = root.querySelector('#hex-info')?.textContent ?? '';
    expect(info).toContain('Blue: 0 region(s), largest: 0');
    expect(info).toContain('Red: 0 region(s), largest: 0');
  });
});
