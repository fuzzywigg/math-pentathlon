/**
 * Wave 58 leftover after #267 — Poly shape-info idle placeholder.
 * Distinct from wave56 Unique Orientations leftover. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderPolyominoDemo } from '../../src/demos/polyomino-demo';

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 58 demos — poly info placeholder', () => {
  it('mounts Select a shape to see details before selection', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    renderPolyominoDemo(root);
    expect(root.querySelector('#shape-info')?.textContent?.trim()).toBe(
      'Select a shape to see details'
    );
  });
});
