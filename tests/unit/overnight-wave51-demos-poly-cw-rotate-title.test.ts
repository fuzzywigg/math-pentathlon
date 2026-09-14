/**
 * Overnight TOKENMAXX HEAVY leftovers after #234 — polyomino CW rotate title control.
 * Distinct from demos46 CCW leftovers. Tests-only.
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

describe('Wave 51 demos — poly CW rotate', () => {
  it('Rotate clockwise keeps selected-shape svg + valid-positions chrome', () => {
    const root = mount();
    renderPolyominoDemo(root);
    (root.querySelector('#clear-board-btn') as HTMLButtonElement).click();
    (
      root.querySelector('.set-btn[data-set="tetrominoes"]') as HTMLButtonElement
    ).click();
    (root.querySelector('#shape-gallery > *') as HTMLElement).click();

    const cw = root.querySelector(
      '#rotation-controls button[title="Rotate clockwise"]'
    ) as HTMLButtonElement | null;
    expect(cw).toBeTruthy();
    cw!.click();
    expect(root.querySelector('#selected-shape svg')).toBeTruthy();
    expect(root.querySelector('#valid-positions')?.textContent ?? '').toMatch(
      /valid position|Can be placed|Cannot be placed/i
    );
  });
});
