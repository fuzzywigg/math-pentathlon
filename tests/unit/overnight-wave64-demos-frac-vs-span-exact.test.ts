/**
 * Wave 64 leftover after tip/#303 (unit-only) — frac vs span exact.
 * Distinct from wave58–60 demos chrome leftovers. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderFractionDemo } from '../../src/demos/fraction-demo';

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

describe('Wave 64 demos — frac vs span exact', () => {
  it('locks comparison-inputs vs separator span', () => {
    const root = mount();
    renderFractionDemo(root);
    expect(
      [...root.querySelectorAll('.comparison-inputs > span')].map(
        (el) => el.textContent ?? ''
      )
    ).toContain('vs');
  });
});
