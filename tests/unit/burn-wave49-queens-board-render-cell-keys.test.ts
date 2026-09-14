/**
 * Wave 49 — Queens renderBoard cell keys leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/queens-guards/types';
import { renderBoard } from '../../src/games/queens-guards/board-ui';

describe('Wave 49 queens — renderBoard cells', () => {
  it('emits data-cell-key for every board cell', () => {
    const s = createInitialState();
    const svg = renderBoard(s, () => undefined);
    const keys = [...svg.querySelectorAll('[data-cell-key]')].map(
      (el) => (el as HTMLElement).dataset.cellKey
    );
    expect(keys.length).toBe(s.cells.size);
    expect(keys).toContain('0-0');
    expect(new Set(keys).size).toBe(keys.length);
  });
});
