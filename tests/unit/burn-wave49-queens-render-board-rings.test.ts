/**
 * Wave 49 leftover after #221/#226/#227 — Queens renderBoard ring cells. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/queens-guards/types';
import { renderBoard } from '../../src/games/queens-guards/board-ui';

describe('Wave 49 queens — renderBoard rings', () => {
  it('renders svg cells for every board key', () => {
    const state = createInitialState();
    const svg = renderBoard(state, () => undefined);
    expect(svg.tagName.toLowerCase()).toBe('svg');
    expect(svg.querySelectorAll('[data-cell-key]').length).toBe(state.cells.size);
  });
});
