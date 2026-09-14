/**
 * Wave 45 — Sum createInitialState seed fallback without 6-6
 * Distinct leftover vs #204 rules / #207 fab-sum-core / #208 overnight core.
 * Tests-only.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import * as types from '../../src/games/sum-dominoes/types';
import { createInitialState } from '../../src/games/sum-dominoes/rules';

afterEach(() => vi.restoreAllMocks());

describe('Wave 45 Sum — seed fallback highest double', () => {
  it('centers a remaining double when 6-6 is dealt into a hand', () => {
    const set = types.createDominoSet();
    // Put 6-6 (id d27 typically last) into first 14 so remaining has other doubles
    const sixSix = set.find((d) => d.face1 === 6 && d.face2 === 6)!;
    const rest = set.filter((d) => d.id !== sixSix.id);
    const ordered = [...rest.slice(0, 13), sixSix, ...rest.slice(13)];
    vi.spyOn(types, 'shuffleArray').mockImplementation((arr) => {
      if (arr[0] && typeof arr[0] === 'object' && 'face1' in (arr[0] as object)) {
        return ordered as typeof arr;
      }
      return arr;
    });
    const state = createInitialState();
    const center = state.board[types.CONFIG.CENTER_ROW][types.CONFIG.CENTER_COL];
    expect(center).not.toBeNull();
    expect(center!.domino.face1).toBe(center!.domino.face2);
    expect(center!.domino.face1).not.toBe(6);
  });
});
