/**
 * Wave 65 leftover after tip/#311–#313 (unit-only) — frac input-group label 0.875rem.
 * Soft op-btn 40px in #311; lock label font-size leftover. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderFractionDemo } from '../../src/demos/fraction-demo';

describe('Wave 65 demos — frac label 875', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('locks .fraction-input-group label font-size 0.875rem leftover', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    renderFractionDemo(root);
    const css = root.querySelector('style')?.textContent ?? '';
    expect(css).toMatch(
      /\.fraction-input-group label\s*\{[^}]*font-size:\s*0\.875rem/
    );
  });
});
