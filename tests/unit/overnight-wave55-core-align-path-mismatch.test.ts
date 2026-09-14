/**
 * Overnight HEAVY leftover after #250 — findPath rejects mismatched / empty starts.
 * Distinct from wave25 areConnected same-region. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { findPath, createArrayGetter } from '../../src/core/alignment';

describe('Wave 55 core align — findPath mismatch', () => {
  it('different values and empty start return null; same region returns a path', () => {
    const board = [
      ['A', 'A', null],
      ['B', 'A', null],
    ];
    const get = createArrayGetter(board);
    const cfg = { rows: 2, cols: 3 };
    expect(
      findPath({ row: 0, col: 0 }, { row: 1, col: 0 }, get, cfg)
    ).toBeNull();
    expect(
      findPath({ row: 0, col: 2 }, { row: 0, col: 0 }, get, cfg)
    ).toBeNull();
    const path = findPath({ row: 0, col: 0 }, { row: 1, col: 1 }, get, cfg);
    expect(path).not.toBeNull();
    expect(path![0]).toEqual({ row: 0, col: 0 });
    expect(path!.at(-1)).toEqual({ row: 1, col: 1 });
  });
});
