/**
 * Wave 45 — Sum createInitialState seed fallback with no remaining doubles
 * Distinct leftover vs #204 rules / #207 fab-sum-core / #208 overnight core.
 * Tests-only.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import * as types from '../../src/games/sum-dominoes/types';
import { createInitialState } from '../../src/games/sum-dominoes/rules';

afterEach(() => vi.restoreAllMocks());

describe('Wave 45 Sum — seed fallback no doubles', () => {
  it('uses first remaining tile when remaining pile has no doubles', () => {
    const set = types.createDominoSet();
    const doubles = set.filter((d) => d.face1 === d.face2);
    const non = set.filter((d) => d.face1 !== d.face2);
    const ordered = [...doubles, ...non]; // first 14 include all 7 doubles + 7 non
    expect(ordered.slice(14).every((d) => d.face1 !== d.face2)).toBe(true);
    vi.spyOn(types, 'shuffleArray').mockImplementation((arr) => {
      if (arr[0] && typeof arr[0] === 'object' && 'face1' in (arr[0] as object)) {
        return ordered as typeof arr;
      }
      return arr;
    });
    const state = createInitialState();
    const center = state.board[types.CONFIG.CENTER_ROW][types.CONFIG.CENTER_COL];
    expect(center).not.toBeNull();
    expect(center!.domino.face1).not.toBe(center!.domino.face2);
    expect(center!.domino.id).toBe(ordered[14].id);
  });
});
