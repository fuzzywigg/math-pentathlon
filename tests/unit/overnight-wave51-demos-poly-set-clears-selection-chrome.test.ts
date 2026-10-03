/**
 * Overnight TOKENMAXX HEAVY leftovers after #234 — poly set switch clears selection chrome.
 * Distinct from demos46 CCW / flip leftovers. (valid-positions is not wiped on set switch
 * in the live module — assert selection/info chrome that is.) Tests-only.
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

describe('Wave 51 demos — poly set clears selection chrome', () => {
  it('switching set restores placeholder and clears orientation-count', () => {
    const root = mount();
    renderPolyominoDemo(root);
    (root.querySelector('#clear-board-btn') as HTMLButtonElement).click();
    (
      root.querySelector('.set-btn[data-set="tetrominoes"]') as HTMLButtonElement
    ).click();
    (root.querySelector('#shape-gallery > *') as HTMLElement).click();
    expect(root.querySelector('#selected-shape svg')).toBeTruthy();
    expect(
      (root.querySelector('#orientation-count')?.textContent ?? '').length
    ).toBeGreaterThan(0);

    (
      root.querySelector('.set-btn[data-set="simple"]') as HTMLButtonElement
    ).click();
    expect(root.querySelector('#selected-shape')?.textContent ?? '').toMatch(
      /Click a shape/i
    );
    expect(root.querySelector('#orientation-count')?.textContent ?? '').toBe('');
    expect(root.querySelector('#shape-info')?.textContent ?? '').toMatch(
      /Select a shape/i
    );
  });
});
