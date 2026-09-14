/**
 * Wave 49 — Queens empty cell aria leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/queens-guards/types';
import { renderBoard } from '../../src/games/queens-guards/board-ui';

describe('Wave 49 queens — empty aria', () => {
  it('labels center empty cell without Blue/Red owner', () => {
    const svg = renderBoard(createInitialState(), () => undefined);
    const label = svg.querySelector('[data-cell-key="0-0"]')?.getAttribute('aria-label') || '';
    expect(label.toLowerCase()).toMatch(/empty|ring/);
    expect(label).not.toMatch(/Blue|Red/);
  });
});
