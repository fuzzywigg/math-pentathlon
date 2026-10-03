/**
 * Wave 56 leftover after #256 — Polyomino simple set Can Flip chrome.
 * Distinct from wave55 pentominoes Can Flip. Tests-only.
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

describe('Wave 56 demos — poly simple Can Flip', () => {
  it('simple first shape fills Can Flip Yes/No in shape-info', () => {
    const root = mount();
    renderPolyominoDemo(root);
    (
      root.querySelector('.set-btn[data-set="simple"]') as HTMLButtonElement
    ).click();
    (root.querySelector('#shape-gallery > *') as HTMLElement).click();

    const info = root.querySelector('#shape-info')?.textContent ?? '';
    expect(info).toMatch(/Can Flip/);
    expect(info).toMatch(/Yes|No/);
    expect(info).toMatch(/Can Rotate/);
    expect(info).toMatch(/Unique Orientations/);
    expect(root.querySelector('#selected-shape svg')).toBeTruthy();
  });
});
