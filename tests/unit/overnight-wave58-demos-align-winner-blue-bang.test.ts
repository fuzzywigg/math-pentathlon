/**
 * Wave 58 leftover after #267 — Align exact Winner: Blue! bang copy.
 * Distinct from wave51 soft /Blue/i leftover. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderAlignmentDemo } from '../../src/demos/alignment-demo';

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 58 demos — align Winner: Blue!', () => {
  it('Blue vertical spine yields exact Winner: Blue!', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    renderAlignmentDemo(root);
    const clickHex = (row: number, col: number) => {
      (
        root.querySelector(
          `#hex-board [data-row="${row}"][data-col="${col}"]`
        ) as HTMLElement
      ).click();
    };
    for (let row = 0; row < 6; row++) {
      clickHex(row, 3);
      clickHex(row, 6);
    }
    clickHex(6, 3);
    expect(root.querySelector('#hex-status .winner')?.textContent).toBe(
      'Winner: Blue!'
    );
  });
});
