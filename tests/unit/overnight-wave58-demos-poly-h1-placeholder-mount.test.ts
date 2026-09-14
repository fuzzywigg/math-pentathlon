/**
 * Wave 58 leftover after #267 — Poly h1 + select placeholder + Empty: 100.
 * Distinct from orientation leftover. Tests-only.
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

describe('Wave 58 demos — poly h1 placeholder mount', () => {
  it('mounts Polyomino System Demo + Click a shape + Empty: 100 + Undo', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    renderPolyominoDemo(root);
    expect(root.querySelector('h1')?.textContent?.trim()).toBe(
      'Polyomino System Demo'
    );
    expect(root.querySelector('#selected-shape .placeholder')?.textContent?.trim()).toBe(
      'Click a shape above to select'
    );
    expect(root.querySelector('#empty-count')?.textContent).toBe('Empty: 100');
    expect(root.querySelector('#undo-btn')?.textContent?.trim()).toBe('Undo');
  });
});
