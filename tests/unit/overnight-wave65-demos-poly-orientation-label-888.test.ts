/**
 * Wave 65 leftover after tip/#311–#313 (unit-only) — poly orientation-item label #888.
 * Soft shape-info dt catalog in #311; lock 11px/#888 leftover. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderPolyominoDemo } from '../../src/demos/polyomino-demo';

describe('Wave 65 demos — poly orientation label', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('locks .orientation-item .label 11px #888 leftover', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    renderPolyominoDemo(root);
    const css = root.querySelector('style')?.textContent ?? '';
    expect(css).toMatch(
      /\.orientation-item \.label\s*\{[^}]*font-size:\s*11px/
    );
    expect(css).toMatch(/\.orientation-item \.label\s*\{[^}]*color:\s*#888/);
  });
});
