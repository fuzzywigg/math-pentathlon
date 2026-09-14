/**
 * Wave 65 leftover after tip/#311–#313 (unit-only) — frac calculate hover green.
 * Soft #4caf50 calculate btn in #311; lock hover #45a049 leftover. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderFractionDemo } from '../../src/demos/fraction-demo';

describe('Wave 65 demos — frac calculate hover', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('locks .calculate-btn:hover background #45a049 leftover', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    renderFractionDemo(root);
    const css = root.querySelector('style')?.textContent ?? '';
    expect(css).toMatch(/\.calculate-btn:hover\s*\{[^}]*background:\s*#45a049/);
  });
});
