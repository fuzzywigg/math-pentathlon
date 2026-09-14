/**
 * Wave 42 — Par-55 calculateScore + forced target win via score inject. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  selectBlock,
  placeBlock,
  calculateScore,
  formatMove,
  getAttributeDisplayName,
} from '../../src/games/par-55/rules';
import { CONFIG } from '../../src/games/par-55/types';

describe('Wave 42 par-55 — score / target', () => {
  it('placeBlock scores matches and records history', () => {
    let s = createInitialState();
    const block = s.hands.player1[0];
    s = selectBlock(s, block.id);
    let placed = s;
    for (const id of s.bases.keys()) {
      const next = placeBlock(s, id);
      if (next !== s) {
        placed = next;
        break;
      }
    }
    expect(placed).not.toBe(s);
    expect(placed.moveHistory).toHaveLength(1);
    expect(placed.scores.player1).toBeGreaterThanOrEqual(0);
    expect(formatMove(placed.moveHistory[0])).toMatch(/pts/);
  });

  it('calculateScore missing base → zeros', () => {
    const s = createInitialState();
    const block = s.hands.player1[0];
    expect(calculateScore(s, block, 'nope')).toEqual({
      totalPoints: 0,
      matchDetails: [],
    });
  });

  it('injected near-target score wins on place when points ≥1', () => {
    let s = createInitialState();
    s = { ...s, scores: { player1: CONFIG.TARGET_SCORE - 1, player2: 0 } };
    const block = s.hands.player1[0];
    s = selectBlock(s, block.id);
    let next = s;
    for (const id of s.bases.keys()) {
      const cand = placeBlock(s, id);
      if (cand !== s) {
        next = cand;
        break;
      }
    }
    if (next.scores.player1 >= CONFIG.TARGET_SCORE) {
      expect(next.phase).toBe('gameOver');
      expect(next.winner).toBe('player1');
    } else {
      expect(next.phase).toBe('selectingBlock');
    }
  });

  it('attribute display names cover catalog', () => {
    expect(getAttributeDisplayName('shape')).toBe('Shape');
    expect(getAttributeDisplayName('color')).toBe('Color');
    expect(getAttributeDisplayName('size')).toBe('Size');
    expect(getAttributeDisplayName('thickness')).toBe('Thickness');
    expect(getAttributeDisplayName('unknown')).toBe('unknown');
  });
});
