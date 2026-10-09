/**
 * Overnight TOKENMAXX HEAVY leftovers after #234 — poly orientation #N labels.
 * Distinct from orientation count text leftovers. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderPolyominoDemo } from '../../src/demos/polyomino-demo';
import { mountRoot } from './helpers/dom';

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 51 demos — poly orientations numbered', () => {
  it('all-orientations gallery labels include #1', () => {
    const root = mountRoot();
    renderPolyominoDemo(root);
    (
      root.querySelector('.set-btn[data-set="tetrominoes"]') as HTMLButtonElement
    ).click();
    (root.querySelector('#shape-gallery > *') as HTMLElement).click();

    const labels = [
      ...root.querySelectorAll('#all-orientations .orientation-item .label'),
    ].map((el) => el.textContent ?? '');
    expect(labels).toContain('#1');
    expect(labels.length).toBeGreaterThanOrEqual(1);
  });
});
