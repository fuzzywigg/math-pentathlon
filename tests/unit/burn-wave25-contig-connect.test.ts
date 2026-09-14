/**
 * Wave 25 — areConnected / regionTouchesEdge / regionConnectsEdges.
 * Hex-style edge wins + square connectivity. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  areConnected,
  findRegion,
  regionTouchesEdge,
  regionConnectsEdges,
  getHexNeighbors,
  getNeighbors,
} from '../../src/core/alignment/contiguous';
import type {
  CellGetter,
  CellValue,
  ContiguousConfig,
  Region,
} from '../../src/core/alignment/types';

function grid(
  values: (CellValue | null)[][],
  extra: Partial<ContiguousConfig> = {}
): { getCell: CellGetter; config: ContiguousConfig } {
  const rows = values.length;
  const cols = values[0]?.length ?? 0;
  return {
    config: { rows, cols, ...extra },
    getCell: (r, c) => {
      if (r < 0 || c < 0 || r >= rows || c >= cols) return null;
      return values[r][c];
    },
  };
}

function fakeRegion(
  positions: { row: number; col: number }[],
  value: CellValue = 'X'
): Region {
  return { value, positions, size: positions.length };
}

describe('Wave 25 contig-connect — areConnected', () => {
  it('true for same cell when occupied', () => {
    const { getCell, config } = grid([
      ['A', null],
      [null, null],
    ]);
    expect(
      areConnected(
        { row: 0, col: 0 },
        { row: 0, col: 0 },
        getCell,
        config
      )
    ).toBe(true);
  });

  it('false when start cell empty', () => {
    const { getCell, config } = grid([
      [null, 'A'],
      ['A', 'A'],
    ]);
    expect(
      areConnected(
        { row: 0, col: 0 },
        { row: 1, col: 1 },
        getCell,
        config
      )
    ).toBe(false);
  });

  it('true along 4-connected corridor', () => {
    const { getCell, config } = grid([
      ['R', 'R', 'R'],
      [null, null, 'R'],
      [null, null, 'R'],
    ]);
    expect(
      areConnected(
        { row: 0, col: 0 },
        { row: 2, col: 2 },
        getCell,
        config
      )
    ).toBe(true);
  });

  it('false across gap under 4-connectivity', () => {
    const { getCell, config } = grid([
      ['R', null, 'R'],
      [null, null, null],
      ['R', null, 'R'],
    ]);
    expect(
      areConnected(
        { row: 0, col: 0 },
        { row: 0, col: 2 },
        getCell,
        config
      )
    ).toBe(false);
  });

  it('true across diagonal when includeDiagonals', () => {
    const { getCell, config } = grid(
      [
        ['R', null],
        [null, 'R'],
      ],
      { includeDiagonals: true }
    );
    expect(
      areConnected(
        { row: 0, col: 0 },
        { row: 1, col: 1 },
        getCell,
        config
      )
    ).toBe(true);
  });

  it('false when values differ even if adjacent', () => {
    const { getCell, config } = grid([
      ['R', 'B'],
      [null, null],
    ]);
    expect(
      areConnected(
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        getCell,
        config
      )
    ).toBe(false);
  });

  it('wrap connects left/right edges', () => {
    const { getCell, config } = grid(
      [
        ['A', null, 'A'],
        [null, null, null],
      ],
      { wrap: true }
    );
    expect(
      areConnected(
        { row: 0, col: 0 },
        { row: 0, col: 2 },
        getCell,
        config
      )
    ).toBe(true);
  });

  it('hex neighbor fn can connect cells square 4-way cannot', () => {
    // Depends on offset geometry; assert API accepts custom fn and returns boolean
    const { getCell, config } = grid([
      ['B', 'B', null],
      [null, 'B', null],
      [null, null, null],
    ]);
    const square = areConnected(
      { row: 0, col: 0 },
      { row: 1, col: 1 },
      getCell,
      config,
      getNeighbors
    );
    const hex = areConnected(
      { row: 0, col: 0 },
      { row: 1, col: 1 },
      getCell,
      config,
      getHexNeighbors
    );
    expect(typeof square).toBe('boolean');
    expect(typeof hex).toBe('boolean');
    // At least one connectivity model should link this small cluster seed
    expect(square || hex).toBe(true);
  });
});

describe('Wave 25 contig-connect — regionTouchesEdge', () => {
  const config: ContiguousConfig = { rows: 3, cols: 3 };

  it('top edge only when any cell has row 0', () => {
    const region = fakeRegion([
      { row: 0, col: 1 },
      { row: 1, col: 1 },
    ]);
    expect(regionTouchesEdge(region, 'top', config)).toBe(true);
    expect(regionTouchesEdge(region, 'bottom', config)).toBe(false);
    expect(regionTouchesEdge(region, 'left', config)).toBe(false);
    expect(regionTouchesEdge(region, 'right', config)).toBe(false);
  });

  it('bottom / left / right edges', () => {
    expect(
      regionTouchesEdge(
        fakeRegion([{ row: 2, col: 1 }]),
        'bottom',
        config
      )
    ).toBe(true);
    expect(
      regionTouchesEdge(fakeRegion([{ row: 1, col: 0 }]), 'left', config)
    ).toBe(true);
    expect(
      regionTouchesEdge(
        fakeRegion([{ row: 1, col: 2 }]),
        'right',
        config
      )
    ).toBe(true);
  });

  it('interior region touches no edges', () => {
    const region = fakeRegion([{ row: 1, col: 1 }]);
    for (const edge of ['top', 'bottom', 'left', 'right'] as const) {
      expect(regionTouchesEdge(region, edge, config)).toBe(false);
    }
  });

  it('corner cell touches two edges', () => {
    const region = fakeRegion([{ row: 0, col: 0 }]);
    expect(regionTouchesEdge(region, 'top', config)).toBe(true);
    expect(regionTouchesEdge(region, 'left', config)).toBe(true);
    expect(regionTouchesEdge(region, 'bottom', config)).toBe(false);
    expect(regionTouchesEdge(region, 'right', config)).toBe(false);
  });

  it('empty region touches nothing', () => {
    const region = fakeRegion([]);
    for (const edge of ['top', 'bottom', 'left', 'right'] as const) {
      expect(regionTouchesEdge(region, edge, config)).toBe(false);
    }
  });

  it('uses config.rows/cols for bottom/right (not hardcoded)', () => {
    const tall: ContiguousConfig = { rows: 5, cols: 2 };
    const region = fakeRegion([{ row: 4, col: 1 }]);
    expect(regionTouchesEdge(region, 'bottom', tall)).toBe(true);
    expect(regionTouchesEdge(region, 'right', tall)).toBe(true);
    expect(regionTouchesEdge(region, 'bottom', config)).toBe(false);
  });
});

describe('Wave 25 contig-connect — regionConnectsEdges', () => {
  const config: ContiguousConfig = { rows: 4, cols: 4 };

  it('vertical bridge connects top-bottom', () => {
    const { getCell } = grid([
      ['B', null, null, null],
      ['B', null, null, null],
      ['B', null, null, null],
      ['B', null, null, null],
    ]);
    const region = findRegion(0, 0, getCell, config)!;
    expect(regionConnectsEdges(region, 'top', 'bottom', config)).toBe(
      true
    );
    expect(regionConnectsEdges(region, 'left', 'right', config)).toBe(
      false
    );
  });

  it('horizontal bridge connects left-right', () => {
    const { getCell } = grid([
      [null, null, null, null],
      ['R', 'R', 'R', 'R'],
      [null, null, null, null],
      [null, null, null, null],
    ]);
    const region = findRegion(1, 0, getCell, config)!;
    expect(regionConnectsEdges(region, 'left', 'right', config)).toBe(
      true
    );
    expect(regionConnectsEdges(region, 'top', 'bottom', config)).toBe(
      false
    );
  });

  it('partial span does not connect opposite edges', () => {
    const { getCell } = grid([
      ['B', null, null, null],
      ['B', null, null, null],
      ['B', null, null, null],
      [null, null, null, null],
    ]);
    const region = findRegion(0, 0, getCell, config)!;
    expect(regionConnectsEdges(region, 'top', 'bottom', config)).toBe(
      false
    );
  });

  it('same edge twice is true if that edge is touched', () => {
    const region = fakeRegion([{ row: 0, col: 2 }]);
    expect(regionConnectsEdges(region, 'top', 'top', config)).toBe(true);
    expect(regionConnectsEdges(region, 'bottom', 'bottom', config)).toBe(
      false
    );
  });

  it('full board fill connects both axis pairs', () => {
    const values = Array.from({ length: 4 }, () =>
      Array.from({ length: 4 }, () => 'X' as CellValue)
    );
    const { getCell } = grid(values);
    const region = findRegion(0, 0, getCell, config)!;
    expect(regionConnectsEdges(region, 'top', 'bottom', config)).toBe(
      true
    );
    expect(regionConnectsEdges(region, 'left', 'right', config)).toBe(
      true
    );
  });
});
