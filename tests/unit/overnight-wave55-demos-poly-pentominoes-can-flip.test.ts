/**
 * Wave 55 leftover after #250 — Polyomino pentominoes Can Flip chrome.
 * Adjacent to wave51 pattern ID/Size leftover. Tests-only.
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

describe('Wave 55 demos — poly pentominoes Can Flip', () => {
  it('pentominoes first shape fills Can Flip Yes/No in shape-info', () => {
    const root = mount();
    renderPolyominoDemo(root);
    (
      root.querySelector('.set-btn[data-set="pentominoes"]') as HTMLButtonElement
    ).click();
    (root.querySelector('#shape-gallery > *') as HTMLElement).click();

    const info = root.querySelector('#shape-info')?.textContent ?? '';
    expect(info).toMatch(/Can Flip/);
    expect(info).toMatch(/Yes|No/);
    expect(info).toMatch(/Can Rotate/);
    expect(root.querySelector('#selected-shape svg')).toBeTruthy();
  });
});
