/**
 * Wave 43 — Stars adjacency scoring + star double leftover. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import {
  createInitialState,
  selectCard,
  placeCard,
  getValidPlacements,
} from '../../src/games/stars-bars/rules';
import { countDifferences } from '../../src/games/stars-bars/types';

afterEach(() => vi.restoreAllMocks());

describe('Wave 43 stars-bars — adjacency score star', () => {
  it('second card adjacent scores diffs; non-adjacent reject', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let s = createInitialState();
    const c1 = s.playerHands.player1[0];
    s = placeCard(selectCard(s, c1.id), 2, 2);
    // p2 turn
    const c2 = s.playerHands.player2[0];
    const selected = selectCard(s, c2.id);
    const valids = getValidPlacements(selected);
    expect(valids.some((p) => p.row === 2 && p.col === 3)).toBe(true);
    expect(valids.some((p) => p.row === 0 && p.col === 0)).toBe(false); // not adjacent to center-only
    const far = placeCard(selected, 0, 0);
    expect(far).toBe(selected);
    const near = placeCard(selected, 2, 3);
    expect(near).not.toBe(selected);
    const expected = countDifferences(c2, c1);
    // non-star cell (2,3) — score equals diffs
    expect(near.playerScores.player2).toBe(expected);
  });

  it('placing on star cell doubles positive adjacency score', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let s = createInitialState();
    // seed near a star: place at (0,1) then opponent on star (0,0)
    const c1 = s.playerHands.player1[0];
    s = placeCard(selectCard(s, c1.id), 0, 1);
    const c2 = s.playerHands.player2[0];
    const selected = selectCard(s, c2.id);
    const diffs = countDifferences(c2, c1);
    const onStar = placeCard(selected, 0, 0);
    if (diffs > 0) {
      expect(onStar.playerScores.player2).toBe(diffs * 2);
      expect(onStar.moveHistory.at(-1)?.breakdown).toMatch(/star/i);
    } else {
      expect(onStar.playerScores.player2).toBe(0);
    }
  });
});
