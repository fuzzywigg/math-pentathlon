/**
 * Wave 39 — findPath miss + custom neighbors leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  findPath,
  getNeighbors,
} from '../../src/core/alignment/contiguous';
import type {
  CellGetter,
  ContiguousConfig,
  GridPosition,
} from '../../src/core/alignment/types';

describe('Wave 39 contig — findPath custom neighbors', () => {
  const config: ContiguousConfig = { rows: 3, cols: 3 };

  it('null start yields null path', () => {
    const get: CellGetter = () => null;
    expect(
      findPath({ row: 0, col: 0 }, { row: 0, col: 1 }, get, config)
    ).toBeNull();
  });

  it('mismatched values yield null', () => {
    const board = [
      ['A', 'B', null],
      [null, null, null],
      [null, null, null],
    ];
    const get: CellGetter = (r, c) => board[r]?.[c] ?? null;
    expect(
      findPath({ row: 0, col: 0 }, { row: 0, col: 1 }, get, config)
    ).toBeNull();
  });

  it('connected path returns ordered cells', () => {
    const board = [
      ['X', 'X', null],
      [null, 'X', 'X'],
      [null, null, null],
    ];
    const get: CellGetter = (r, c) => board[r]?.[c] ?? null;
    const path = findPath({ row: 0, col: 0 }, { row: 1, col: 2 }, get, config);
    expect(path).not.toBeNull();
    expect(path![0]).toEqual({ row: 0, col: 0 });
    expect(path![path!.length - 1]).toEqual({ row: 1, col: 2 });
  });

  it('custom neighbors that return empty blocks path', () => {
    const board = [
      ['X', 'X', 'X'],
      [null, null, null],
      [null, null, null],
    ];
    const get: CellGetter = (r, c) => board[r]?.[c] ?? null;
    const none = (): GridPosition[] => [];
    expect(
      findPath({ row: 0, col: 0 }, { row: 0, col: 2 }, get, config, none)
    ).toBeNull();
    // same start/end still works even with empty neighbors (found immediately)
    expect(
      findPath({ row: 0, col: 0 }, { row: 0, col: 0 }, get, config, none)
    ).toEqual([{ row: 0, col: 0 }]);
    // sanity: default neighbors connect
    expect(
      findPath(
        { row: 0, col: 0 },
        { row: 0, col: 2 },
        get,
        config,
        getNeighbors
      )
    ).not.toBeNull();
  });
});
