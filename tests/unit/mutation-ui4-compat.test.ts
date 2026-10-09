/**
 * q-mp-144 mutation audit UI wave 4 — kill survivors in core/alignment/compat.
 * Pure structural pins — no game/tutorial copy.
 */
import { describe, expect, it } from 'vitest';

import {
  CARDINAL_DIRECTIONS,
  createArrayAccessor,
  getArrayDimensions,
} from '../../src/core/alignment/compat';

describe('mutation-ui4 alignment compat', () => {
  it('getArrayDimensions: empty / single-row / holey first row', () => {
    // Survivors around L54: `> 0` → `>= 0` (equiv), `0 → 1` on thresholds / ?? / else.
    expect(getArrayDimensions([])).toEqual({ rows: 0, cols: 0 });
    expect(getArrayDimensions([[]])).toEqual({ rows: 1, cols: 0 });
    expect(getArrayDimensions([['a']])).toEqual({ rows: 1, cols: 1 });
    expect(getArrayDimensions([['a', 'b'], ['c']])).toEqual({
      rows: 2,
      cols: 2,
    });
    // Holey first row: `grid[0]` undefined → `?? 0` (not `?? 1`).
    const holey = [] as unknown as string[][];
    holey.length = 1;
    expect(getArrayDimensions(holey)).toEqual({ rows: 1, cols: 0 });
  });

  it('createArrayAccessor fences row/col at exact length boundaries', () => {
    // Survivors: L69 `row < 0` / `row >= length`; L73 `col` fences + `!gridRow`.
    const grid = [
      ['A', 'B'],
      ['C', 'D'],
    ];
    const get = createArrayAccessor(grid);

    expect(get(0, 0)).toBe('A');
    expect(get(0, 1)).toBe('B');
    expect(get(1, 0)).toBe('C');
    expect(get(1, 1)).toBe('D');

    // `row < 0` → `row < 1` would wrongly reject row 0.
    expect(get(0, 0)).toBe('A');

    // `row >= length` → `row > length` would wrongly allow row === length.
    expect(get(2, 0)).toBeUndefined();
    expect(get(grid.length, 0)).toBeUndefined();
    expect(get(-1, 0)).toBeUndefined();

    // Column fences at exact length.
    expect(get(0, 2)).toBeUndefined();
    expect(get(0, -1)).toBeUndefined();
    expect(get(0, grid[0]!.length)).toBeUndefined();

    // Missing row object.
    const sparse = [['X']] as Array<Array<string | null>>;
    sparse[1] = undefined as unknown as Array<string | null>;
    const getSparse = createArrayAccessor(sparse);
    expect(getSparse(1, 0)).toBeUndefined();

    // Proxy grid: `row >= length` → `>` would read a leaked row at index === length.
    const proxied = new Proxy([['A', 'B']] as string[][], {
      get(target, prop, receiver) {
        if (prop === 'length') return 1;
        if (prop === '1') return ['LEAK'];
        return Reflect.get(target, prop, receiver);
      },
    });
    const getProxy = createArrayAccessor(proxied);
    expect(getProxy(1, 0)).toBeUndefined();
    expect(getProxy(0, 2)).toBeUndefined();
  });

  it('CARDINAL_DIRECTIONS reverse vectors are exact unit steps', () => {
    // Survivors: L106–L107 numeric ±1 on reverse dRow/dCol literals.
    expect(CARDINAL_DIRECTIONS).toHaveLength(4);
    const horizRev = CARDINAL_DIRECTIONS.find(
      (d) => d.name === 'horizontal-rev'
    );
    const vertRev = CARDINAL_DIRECTIONS.find((d) => d.name === 'vertical-rev');
    expect(horizRev).toEqual({ name: 'horizontal-rev', dRow: 0, dCol: -1 });
    expect(vertRev).toEqual({ name: 'vertical-rev', dRow: -1, dCol: 0 });
  });

  // Pinned: `grid.length > 0` → `>= 0` is equivalent for non-negative lengths.
  it.skip('getArrayDimensions > vs >= on empty length (pinned equivalent)', () => {
    expect(true).toBe(true);
  });

  // Pinned: `col >= length` → `>` still yields undefined on plain arrays.
  it.skip('createArrayAccessor col >= vs > fence (pinned near-equivalent)', () => {
    expect(true).toBe(true);
  });
});
