/**
 * Wave 56 leftover after #256 — circular template Connected/Edges residual.
 * Distinct from overnight Nodes:8-only and wave55 complete. Tests-only.
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

describe('Wave 56 demos — graph circular connected', () => {
  it('circular template reports Edges 8 + Connected Yes + Components 1', () => {
    const root = mount();
    renderGraphDemo(root);
    (
      root.querySelector(
        '.template-btn[data-template="circular"]'
      ) as HTMLButtonElement
    ).click();
    const info = root.querySelector('#template-info')?.textContent ?? '';
    expect(info).toMatch(/Nodes:\s*8/);
    expect(info).toMatch(/Edges:\s*8/);
    expect(info).toMatch(/Connected:\s*Yes/);
    expect(info).toMatch(/Components:\s*1/);
  });
});
