/**
 * Wave 65 leftover after tip/#311–#313 (unit-only) — frac gallery minmax 100px.
 * Soft max-width 1000 in #311; lock gallery minmax leftover. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderFractionDemo } from '../../src/demos/fraction-demo';

describe('Wave 65 demos — frac gallery minmax', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('locks .fraction-gallery minmax(100px, 1fr) leftover', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    renderFractionDemo(root);
    const css = root.querySelector('style')?.textContent ?? '';
    expect(css).toMatch(
      /\.fraction-gallery\s*\{[^}]*grid-template-columns:\s*repeat\(auto-fill, minmax\(100px, 1fr\)\)/
    );
  });
});
