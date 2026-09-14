/**
 * Wave 65 leftover after tip/#311–#313 (unit-only) — poly orientations-gallery 15px.
 * Soft shape-gallery leftovers; lock orientations-gallery gap/pad. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderPolyominoDemo } from '../../src/demos/polyomino-demo';

describe('Wave 65 demos — poly orientations gallery', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('locks .orientations-gallery gap/pad 15px leftover', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    renderPolyominoDemo(root);
    const css = root.querySelector('style')?.textContent ?? '';
    expect(css).toMatch(/\.orientations-gallery\s*\{[^}]*gap:\s*15px/);
    expect(css).toMatch(/\.orientations-gallery\s*\{[^}]*padding:\s*15px/);
  });
});
