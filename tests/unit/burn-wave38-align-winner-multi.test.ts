/**
 * Wave 38 — checkForWinner with multiple simultaneous alignments.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  checkForWinner,
  findAllAlignments,
  createArrayGetter,
} from '../../src/core/alignment/grid-alignment';
import { ALL_DIRECTIONS, type AlignmentConfig, type CellValue } from '../../src/core/alignment/types';

describe('Wave 38 align-winner — empty / single / multi', () => {
  it('empty board has no winner', () => {
    const board: CellValue[][] = Array.from({ length: 4 }, () =>
      Array.from({ length: 4 }, () => null)
    );
    const get = createArrayGetter(board);
    const cfg: AlignmentConfig = {
      rows: 4,
      cols: 4,
      targetLength: 3,
      directions: ALL_DIRECTIONS,
    };
    const r = checkForWinner(get, cfg);
    expect(r.hasWinner).toBe(false);
    expect(r.winner).toBeNull();
    expect(r.alignments).toEqual([]);
  });

  it('cross of X yields multiple alignments and X as winner', () => {
    const board: CellValue[][] = [
      ['X', null, null, 'X'],
      [null, 'X', 'X', null],
      [null, 'X', 'X', null],
      ['X', null, null, 'X'],
    ];
    const get = createArrayGetter(board);
    const cfg: AlignmentConfig = {
      rows: 4,
      cols: 4,
      targetLength: 2,
      directions: ALL_DIRECTIONS,
    };
    const all = findAllAlignments(get, cfg);
    expect(all.length).toBeGreaterThan(1);
    const result = checkForWinner(get, cfg);
    expect(result.hasWinner).toBe(true);
    expect(result.winner).toBe('X');
    expect(result.alignments.length).toBe(all.length);
  });
});
