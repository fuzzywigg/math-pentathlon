/**
 * Wave 64 leftover after tip/#303 (unit-only) — poly set data attrs.
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

describe('Wave 64 demos — poly set-btn data-set catalog', () => {
  it('locks data-set attrs + tetrominoes selected idle', () => {
    const root = mount();
    renderPolyominoDemo(root);
    const btns = [...root.querySelectorAll('.shape-set-selector .set-btn')];
    expect(btns.map((b) => b.getAttribute('data-set'))).toEqual([
      'tetrominoes',
      'pentominoes',
      'simple',
      'pattern',
    ]);
    expect(btns[0].classList.contains('selected')).toBe(true);
  });
});
