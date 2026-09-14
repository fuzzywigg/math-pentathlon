/**
 * Wave 24 — countAlignmentPotential AI evaluation edges.
 * Raw grid-alignment Map<direction,{count,blocked}> contract.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  countAlignmentPotential,
  createArrayGetter,
} from '../../src/core/alignment/grid-alignment';
import {
  DIRECTIONS,
  ALL_DIRECTIONS,
  type AlignmentConfig,
  type CellValue,
} from '../../src/core/alignment/types';

function setup(values: CellValue[][], opts: Partial<AlignmentConfig> = {}) {
  return {
    get: createArrayGetter(values),
    config: {
      rows: values.length,
      cols: values[0]?.length ?? 0,
      targetLength: 3,
      ...opts,
    } satisfies AlignmentConfig,
  };
}

describe('Wave 24 align-potential — map keys and baseline counts', () => {
  it('returns an entry for every default direction', () => {
    const { get, config } = setup([
      [null, null, null],
      [null, 'X', null],
      [null, null, null],
    ]);
    const map = countAlignmentPotential(1, 1, 'X', get, config);
    expect(map.size).toBe(ALL_DIRECTIONS.length);
    for (const d of ALL_DIRECTIONS) {
      expect(map.has(d.name)).toBe(true);
      const entry = map.get(d.name)!;
      expect(entry.count).toBeGreaterThanOrEqual(1);
      expect(typeof entry.blocked).toBe('boolean');
    }
  });

  it('single isolated cell counts as 1 in each direction', () => {
    const { get, config } = setup([
      [null, null, null],
      [null, 'X', null],
      [null, null, null],
    ]);
    const map = countAlignmentPotential(1, 1, 'X', get, config);
    for (const entry of map.values()) {
      expect(entry.count).toBe(1);
    }
  });

  it('counts friendly neighbors along a line', () => {
    const { get, config } = setup([
      [null, null, null],
      ['X', 'X', 'X'],
      [null, null, null],
    ]);
    const map = countAlignmentPotential(1, 1, 'X', get, config);
    expect(map.get('horizontal')!.count).toBe(3);
    expect(map.get('vertical')!.count).toBe(1);
  });
});

describe('Wave 24 align-potential — blocked flags', () => {
  it('open ends are not blocked; edge alone is one-sided', () => {
    // Center of empty board — both ends open → blocked false
    const open = setup([
      [null, null, null],
      [null, 'X', null],
      [null, null, null],
    ]);
    const openMap = countAlignmentPotential(1, 1, 'X', open.get, open.config);
    expect(openMap.get('horizontal')!.blocked).toBe(false);

    // Corner cell: horizontal positive may be open, negative hits edge →
    // blocked only if BOTH ends blocked
    const corner = setup([
      ['X', null, null],
      [null, null, null],
      [null, null, null],
    ]);
    const cornerMap = countAlignmentPotential(
      0,
      0,
      'X',
      corner.get,
      corner.config
    );
    // Negative horizontal hits edge (blockedNegative); positive is open
    expect(cornerMap.get('horizontal')!.blocked).toBe(false);
  });

  it('blocked true only when both ends are closed by edge or opponent', () => {
    // Horizontal: O X X X O — both ends opponent-blocked
    const { get, config } = setup([
      ['O', 'X', 'X', 'X', 'O'],
      [null, null, null, null, null],
    ]);
    const map = countAlignmentPotential(0, 2, 'X', get, {
      ...config,
      cols: 5,
    });
    expect(map.get('horizontal')!.count).toBe(3);
    expect(map.get('horizontal')!.blocked).toBe(true);
  });

  it('one opponent + one open end → blocked false', () => {
    const { get, config } = setup([
      ['O', 'X', 'X', null],
      [null, null, null, null],
    ]);
    const map = countAlignmentPotential(0, 1, 'X', get, {
      ...config,
      cols: 4,
    });
    expect(map.get('horizontal')!.count).toBe(2);
    expect(map.get('horizontal')!.blocked).toBe(false);
  });

  it('both ends at board edge on a full-width line → blocked', () => {
    const { get, config } = setup([['X', 'X', 'X']]);
    const map = countAlignmentPotential(0, 1, 'X', get, {
      ...config,
      directions: [DIRECTIONS.HORIZONTAL],
    });
    expect(map.get('horizontal')!.count).toBe(3);
    expect(map.get('horizontal')!.blocked).toBe(true);
  });
});

describe('Wave 24 align-potential — direction filter and wrap', () => {
  it('only reports requested directions', () => {
    const { get, config } = setup(
      [
        [null, 'X', null],
        [null, 'X', null],
        [null, 'X', null],
      ],
      { directions: [DIRECTIONS.VERTICAL] }
    );
    const map = countAlignmentPotential(1, 1, 'X', get, config);
    expect([...map.keys()]).toEqual(['vertical']);
    expect(map.get('vertical')!.count).toBe(3);
  });

  it('wrap mode continues counting across edges', () => {
    const values: CellValue[][] = [
      ['X', null, null, 'X'],
      [null, null, null, null],
    ];
    const get = createArrayGetter(values);
    const noWrap = countAlignmentPotential(0, 0, 'X', get, {
      rows: 2,
      cols: 4,
      targetLength: 3,
      wrap: false,
      directions: [DIRECTIONS.HORIZONTAL],
    });
    expect(noWrap.get('horizontal')!.count).toBe(1);

    const wrapped = countAlignmentPotential(0, 0, 'X', get, {
      rows: 2,
      cols: 4,
      targetLength: 3,
      wrap: true,
      directions: [DIRECTIONS.HORIZONTAL],
    });
    // From col0: +dir empty stop; -dir wraps to col3 X → count 2
    expect(wrapped.get('horizontal')!.count).toBe(2);
  });

  it('ignores opponent pieces for count; treats them as blockers', () => {
    const { get, config } = setup([
      ['X', 'O', 'X'],
      [null, null, null],
      [null, null, null],
    ]);
    const map = countAlignmentPotential(0, 0, 'X', get, {
      ...config,
      directions: [DIRECTIONS.HORIZONTAL],
    });
    // Positive hits O immediately → count stays 1
    expect(map.get('horizontal')!.count).toBe(1);
  });
});
