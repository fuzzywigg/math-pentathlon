/**
 * Overnight HEAVY leftovers after #236 — Contig rolling board has no valids. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/contig-60/types';
import { renderBoard } from '../../src/games/contig-60/board-ui';

describe('Wave 53 contig — opening no valid', () => {
  it('renders no contig-cell-valid before dice are rolled', () => {
    const el = renderBoard(createInitialState(), () => undefined);
    expect(el.querySelector('.contig-cell-valid')).toBeNull();
  });
});
