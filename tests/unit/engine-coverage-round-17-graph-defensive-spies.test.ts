/**
 * q-mp-506 — engine coverage round 17 (isolated): graph defensive-arm spies.
 *
 * Rounds 8–16 documented queue.shift / Map-miss / hex-id / complete-index
 * holes as unreachable and refused prototype spies under isolate:false.
 * This file runs under unit-isolated so Array/Map/String/Array.from
 * prototype patches cannot leak into shared AI/calibration suites.
 *
 * Does not change engine / rules.ts / AI source. Does not duplicate #954
 * r16 or #935 r15 tutorial cases.
 */
import { afterEach, describe, expect, it } from 'vitest';

import {
  bfs,
  findComponents,
  findNodesAtDistance,
  findNodesWithinDistance,
  findPlayerRegion,
  findReachable,
  isConnected,
  playerConnectsSets,
} from '../../src/core/graph/algorithms';
import {
  createCompleteGraph,
  createHexLatticeGraph,
  createTrackGraph,
  type GraphBoard,
} from '../../src/core/graph/types';

const originalShift = Array.prototype.shift;
const originalMapGet = Map.prototype.get;
const originalSplit = String.prototype.split;
const originalArrayFrom = Array.from;

afterEach(() => {
  Array.prototype.shift = originalShift;
  Map.prototype.get = originalMapGet;
  String.prototype.split = originalSplit;
  Array.from = originalArrayFrom;
});

function patchShift(
  decide: (head: unknown, queue: unknown[]) => 'force-undefined' | 'passthrough'
): void {
  Array.prototype.shift = function <T>(this: T[]): T | undefined {
    const head = this[0];
    if (decide(head, this as unknown[]) === 'force-undefined') {
      return undefined;
    }
    return originalShift.call(this) as T | undefined;
  };
}

describe('engine-coverage-round-17 — graph algorithms queue.shift undefined', () => {
  it('bfs breaks when shift returns undefined while queue is non-empty', () => {
    const g = createTrackGraph(4);
    let forced = false;
    patchShift((head) => {
      if (
        !forced &&
        head !== undefined &&
        typeof head === 'object' &&
        head !== null &&
        'node' in head &&
        'path' in head
      ) {
        forced = true;
        return 'force-undefined';
      }
      return 'passthrough';
    });
    const result = bfs(g, 't0', 't3');
    expect(forced).toBe(true);
    expect(result.found).toBe(false);
  });

  it('isConnected breaks on forced shift undefined', () => {
    const g = createTrackGraph(3);
    let forced = false;
    patchShift((head) => {
      if (!forced && typeof head === 'string' && head.startsWith('t')) {
        forced = true;
        return 'force-undefined';
      }
      return 'passthrough';
    });
    expect(isConnected(g)).toBe(false);
    expect(forced).toBe(true);
  });

  it('findComponents breaks on forced shift undefined', () => {
    const g = createTrackGraph(3);
    let forced = false;
    patchShift((head) => {
      if (!forced && typeof head === 'string' && head.startsWith('t')) {
        forced = true;
        return 'force-undefined';
      }
      return 'passthrough';
    });
    const components = findComponents(g);
    expect(forced).toBe(true);
    expect(components.length).toBeGreaterThan(0);
  });

  it('findReachable breaks on forced shift undefined', () => {
    const g = createTrackGraph(4);
    let forced = false;
    patchShift((head) => {
      if (!forced && head === 't0') {
        forced = true;
        return 'force-undefined';
      }
      return 'passthrough';
    });
    const reachable = findReachable(g, 't0');
    expect(forced).toBe(true);
    expect(reachable.size).toBe(0);
  });

  it('findNodesWithinDistance breaks on forced shift undefined', () => {
    const g = createTrackGraph(5);
    let forced = false;
    patchShift((head) => {
      if (!forced && typeof head === 'string' && head.startsWith('t')) {
        forced = true;
        return 'force-undefined';
      }
      return 'passthrough';
    });
    // distances already seeded with start before the loop.
    expect(findNodesWithinDistance(g, 't0', 3)).toEqual(['t0']);
    expect(forced).toBe(true);
  });

  it('findNodesAtDistance breaks on forced shift undefined', () => {
    const g = createTrackGraph(5);
    let forced = false;
    patchShift((head) => {
      if (!forced && typeof head === 'string' && head.startsWith('t')) {
        forced = true;
        return 'force-undefined';
      }
      return 'passthrough';
    });
    expect(findNodesAtDistance(g, 't0', 2)).toEqual([]);
    expect(forced).toBe(true);
  });

  it('findPlayerRegion breaks on forced shift undefined', () => {
    const g = createTrackGraph(3);
    const board: GraphBoard = {
      graph: g,
      nodeStates: new Map([
        ['t0', { owner: 1 }],
        ['t1', { owner: 1 }],
        ['t2', { owner: 2 }],
      ]),
    };
    let forced = false;
    patchShift((head) => {
      if (!forced && head === 't0') {
        forced = true;
        return 'force-undefined';
      }
      return 'passthrough';
    });
    expect(findPlayerRegion(board, 't0', 1)).toEqual([]);
    expect(forced).toBe(true);
  });

  it('playerConnectsSets breaks on forced shift undefined', () => {
    const g = createTrackGraph(4);
    const board: GraphBoard = {
      graph: g,
      nodeStates: new Map([
        ['t0', { owner: 1 }],
        ['t1', { owner: 1 }],
        ['t2', { owner: 1 }],
        ['t3', { owner: 1 }],
      ]),
    };
    let forced = false;
    patchShift((head) => {
      if (!forced && head === 't0') {
        forced = true;
        return 'force-undefined';
      }
      return 'passthrough';
    });
    expect(playerConnectsSets(board, 1, ['t0'], ['t3'])).toBe(false);
    expect(forced).toBe(true);
  });
});

describe('engine-coverage-round-17 — graph algorithms Map-miss continues', () => {
  it('findNodesAtDistance continues when distances.get misses after shift', () => {
    const g = createTrackGraph(5);
    let missOnce = true;
    Map.prototype.get = function (this: Map<unknown, unknown>, key: unknown) {
      if (missOnce && key === 't0') {
        missOnce = false;
        return undefined;
      }
      return originalMapGet.call(this, key);
    };
    const at = findNodesAtDistance(g, 't0', 2);
    expect(missOnce).toBe(false);
    expect(Array.isArray(at)).toBe(true);
  });

  it('findNodesWithinDistance continues when distances.get misses after shift', () => {
    const g = createTrackGraph(5);
    let missOnce = true;
    Map.prototype.get = function (this: Map<unknown, unknown>, key: unknown) {
      if (missOnce && key === 't0') {
        missOnce = false;
        return undefined;
      }
      return originalMapGet.call(this, key);
    };
    const within = findNodesWithinDistance(g, 't0', 3);
    expect(missOnce).toBe(false);
    expect(within).toContain('t0');
  });
});

describe('engine-coverage-round-17 — graph types defensive holes via spies', () => {
  it('hex lattice skips edge creation when axial split yields undefined', () => {
    String.prototype.split = function (
      this: string,
      separator: string | RegExp,
      limit?: number
    ): string[] {
      if (
        typeof separator === 'string' &&
        separator === ',' &&
        /^-?\d+,-?\d+$/.test(this)
      ) {
        return [undefined as unknown as string];
      }
      return originalSplit.call(this, separator, limit);
    };
    const hex = createHexLatticeGraph(1);
    expect(hex.nodes.size).toBeGreaterThan(0);
    expect(hex.edges.length).toBe(0);
  });

  it('complete graph skips push when Array.from yields a hole', () => {
    let hit = false;
    Array.from = function <T>(...args: Parameters<typeof Array.from>): T[] {
      const result = originalArrayFrom.apply(null, args as never) as unknown[];
      if (
        Array.isArray(result) &&
        result.length >= 3 &&
        typeof result[0] === 'string' &&
        String(result[0]).startsWith('n')
      ) {
        hit = true;
        const sparse = [...result];
        sparse[0] = undefined;
        return sparse as T[];
      }
      return result as T[];
    } as typeof Array.from;
    const g = createCompleteGraph(4);
    expect(hit).toBe(true);
    expect(g.nodes.size).toBe(4);
    expect(g.edges.length).toBeGreaterThan(0);
  });
});
