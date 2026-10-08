/**
 * Wave 64 leftover after tip/#303 (unit-only) — frac op data attrs.
 * Distinct from wave58–60 demos chrome leftovers. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderFractionDemo } from '../../src/demos/fraction-demo';
import { mountRoot } from './helpers/dom';

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 64 demos — frac op-btn data-op catalog', () => {
  it('locks data-op attrs + add selected idle', () => {
    const root = mountRoot();
    renderFractionDemo(root);
    const btns = [...root.querySelectorAll('.op-btn')];
    expect(btns.map((b) => b.getAttribute('data-op'))).toEqual([
      'add',
      'subtract',
      'multiply',
      'divide',
    ]);
    expect(btns[0].classList.contains('selected')).toBe(true);
  });
});
