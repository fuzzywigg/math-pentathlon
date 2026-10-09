/**
 * q-mp-167 / UI coverage round 8 — pure layout helpers under src/ui/three.
 * Characterization only: no AI choice / timing / copy asserts.
 */
import { describe, expect, it } from 'vitest';
import { axialToWorld } from '../../src/ui/three/hex-a-gone-board-3d';
import { ringPosToWorld } from '../../src/ui/three/queens-guards-board-3d';
import {
  collectPathwayEdgeKeys,
  nodeToWorld,
  parseKwatroNodeId,
} from '../../src/ui/three/kwatro-sinko-board-3d';
import { createInitialState as createKwatroState } from '../../src/games/kwatro-sinko/rules';

describe('q-mp-167 ui-cov-r8 three layout helpers', () => {
  it('axialToWorld maps flat-top axial coords to XZ', () => {
    expect(axialToWorld(0, 0)).toEqual({ x: 0, z: 0 });
    const right = axialToWorld(1, 0);
    expect(right.x).toBeGreaterThan(0);
    expect(Number.isFinite(right.z)).toBe(true);
    const down = axialToWorld(0, 1);
    expect(down.z).toBeGreaterThan(0);
  });

  it('ringPosToWorld centers ring 0 and fans outer rings', () => {
    expect(ringPosToWorld(0, 0)).toEqual({ x: 0, z: 0 });
    const outer = ringPosToWorld(2, 0);
    expect(outer.x).toBeCloseTo(0, 5);
    expect(outer.z).toBeLessThan(0);
    const side = ringPosToWorld(1, 1);
    expect(Number.isFinite(side.x)).toBe(true);
    expect(Number.isFinite(side.z)).toBe(true);
  });

  it('parseKwatroNodeId / nodeToWorld accept grid ids', () => {
    expect(parseKwatroNodeId('bad')).toBeNull();
    expect(parseKwatroNodeId('n2-3')).toEqual({ row: 2, col: 3 });
    const a = nodeToWorld(0, 0);
    const b = nodeToWorld(0, 1);
    expect(b.x).toBeGreaterThan(a.x);
    expect(a.z).toBe(b.z);
  });

  it('collectPathwayEdgeKeys dedupes undirected connections', () => {
    const state = createKwatroState();
    const keys = collectPathwayEdgeKeys(state);
    expect(keys.length).toBeGreaterThan(0);
    expect(new Set(keys).size).toBe(keys.length);
    for (const key of keys) {
      expect(key).toMatch(/\|/);
    }
  });
});
