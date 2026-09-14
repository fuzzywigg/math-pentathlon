/**
 * Wave 61 leftover after #301 (unit-only) — Polyomino orientation-count exact suffix.
 * Distinct from wave51 numbered #1 / soft orientation leftovers. Tests-only.
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

describe('Wave 61 demos — poly orientation-count exact', () => {
  it('I-tetromino paints N unique orientation(s) exact format', () => {
    const root = mount();
    renderPolyominoDemo(root);
    (
      root.querySelector('.set-btn[data-set="tetrominoes"]') as HTMLButtonElement
    ).click();
    (root.querySelector('#shape-gallery .shape-item') as HTMLElement).click();
    expect(root.querySelector('#orientation-count')?.textContent).toMatch(
      /^\d+ unique orientation\(s\)$/
    );
  });
});
