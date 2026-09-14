/**
 * Overnight TOKENMAXX HEAVY leftovers after #234 — poly pattern set shape-info fill.
 * Distinct from simple Can Rotate leftovers. Tests-only.
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

describe('Wave 51 demos — poly pattern info chrome', () => {
  it('pattern set selection fills ID/Size/Color; set switch restores placeholder', () => {
    const root = mount();
    renderPolyominoDemo(root);
    (
      root.querySelector('.set-btn[data-set="pattern"]') as HTMLButtonElement
    ).click();
    const shape = root.querySelector('#shape-gallery > *') as HTMLElement | null;
    expect(shape).toBeTruthy();
    shape!.click();

    const info = root.querySelector('#shape-info')?.textContent ?? '';
    expect(info).toMatch(/ID/i);
    expect(info).toMatch(/Size/i);
    expect(info).toMatch(/Color/i);
    expect(root.querySelector('#orientation-count')?.textContent ?? '').toMatch(
      /orientation/i
    );

    (
      root.querySelector('.set-btn[data-set="simple"]') as HTMLButtonElement
    ).click();
    expect(root.querySelector('#shape-info')?.textContent ?? '').toMatch(
      /Select a shape/i
    );
  });
});
