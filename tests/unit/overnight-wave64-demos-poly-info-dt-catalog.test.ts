/**
 * Wave 64 leftover after tip/#303 (unit-only) — poly info dt catalog.
 * Distinct from wave58–60 demos chrome leftovers. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderPolyominoDemo } from '../../src/demos/polyomino-demo';

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

describe('Wave 64 demos — poly shape-info dt catalog', () => {
  it('selecting a gallery shape exposes exact dl dt labels', () => {
    const root = mount();
    renderPolyominoDemo(root);
    const item = root.querySelector('.shape-item') as HTMLElement;
    expect(item).toBeTruthy();
    item.click();
    expect(
      [...root.querySelectorAll('#shape-info dt')].map(
        (el) => el.textContent ?? ''
      )
    ).toEqual([
      'ID',
      'Size',
      'Can Rotate',
      'Can Flip',
      'Unique Orientations',
      'Color',
    ]);
  });
});
