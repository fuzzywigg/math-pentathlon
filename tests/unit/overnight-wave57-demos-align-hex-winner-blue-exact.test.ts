/**
 * Wave 57 leftover after #267 — Align hex exact Winner: Blue! copy.
 * Distinct from soft Winner:Blue wave51 leftover. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderAlignmentDemo } from '../../src/demos/alignment-demo';

function mount(): HTMLElement {
  const root = document.createElement('div');
  document.body.appendChild(root);
  return root;
}

function clickHex(root: HTMLElement, row: number, col: number): void {
  (
    root.querySelector(
      `#hex-board [data-row="${row}"][data-col="${col}"]`
    ) as HTMLElement
  ).click();
}

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 57 demos — align hex Winner Blue exact', () => {
  it('Blue vertical spine paints exact Winner: Blue!', () => {
    const root = mount();
    renderAlignmentDemo(root);
    for (let row = 0; row < 6; row++) {
      clickHex(root, row, 3);
      clickHex(root, row, 6);
    }
    clickHex(root, 6, 3);
    expect(root.querySelector('#hex-status .winner')?.textContent).toBe(
      'Winner: Blue!'
    );
  });
});
