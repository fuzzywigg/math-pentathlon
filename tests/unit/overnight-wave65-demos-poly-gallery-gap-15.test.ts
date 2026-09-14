/**
 * Wave 65 leftover after tip/#311–#313 (unit-only) — poly shape-gallery gap 15px.
 * Soft selected #bbdefb in #311; lock gallery gap/pad/min-height leftovers. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderPolyominoDemo } from '../../src/demos/polyomino-demo';

describe('Wave 65 demos — poly gallery gap 15', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('locks .shape-gallery gap/pad 15px + min-height 100px leftover', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    renderPolyominoDemo(root);
    const css = root.querySelector('style')?.textContent ?? '';
    expect(css).toMatch(/\.shape-gallery\s*\{[^}]*gap:\s*15px/);
    expect(css).toMatch(/\.shape-gallery\s*\{[^}]*padding:\s*15px/);
    expect(css).toMatch(/\.shape-gallery\s*\{[^}]*min-height:\s*100px/);
  });
});
