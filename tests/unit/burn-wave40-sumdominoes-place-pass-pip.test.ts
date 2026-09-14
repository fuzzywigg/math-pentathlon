/**
 * Wave 40 — sum-dominoes placeDomino / passTurn pip leftovers after #176.
 * Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  createInitialState,
  selectDomino,
  passTurn,
  isValidPlacement,
  getRemainingCount,
  formatMove,
} from '../../src/games/sum-dominoes/rules';

beforeEach(() => {
  let n = 0;
  vi.spyOn(Math, 'random').mockImplementation(() => {
    n = (n + 1) % 97;
    return n / 97;
  });
});
afterEach(() => vi.restoreAllMocks());

describe('Wave 40 sum-dominoes — place / pass / pip', () => {
  it('selectDomino rejects wrong phase; OOB placement invalid', () => {
    let s = createInitialState();
    expect(selectDomino(s, 'ghost')).toEqual(s);
    const hand = s.hands.player1[0];
    expect(
      isValidPlacement(s, hand, { row: -1, col: 0 }, 'horizontal', 7)
    ).toBe(false);
    expect(getRemainingCount(s, 'player1')).toBe(7);
  });

  it('double pass ends with lower-pip winner or tie', () => {
    let s = createInitialState();
    s = {
      ...s,
      phase: 'passing',
      passCount: 0,
      hands: {
        player1: [
          {
            id: 'a',
            face1: 1,
            face2: 1,
            owner: 'player1',
            orientation: 'horizontal',
          },
        ],
        player2: [
          {
            id: 'b',
            face1: 6,
            face2: 6,
            owner: 'player2',
            orientation: 'horizontal',
          },
        ],
      },
    };
    s = passTurn(s);
    expect(s.phase).toBe('rolling');
    s = { ...s, phase: 'passing' };
    s = passTurn(s);
    expect(s.phase).toBe('gameOver');
    expect(s.winner).toBe('player1');
  });

  it('formatMove includes faces and dice sum', () => {
    const text = formatMove({
      player: 'player1',
      domino: {
        id: 'd',
        face1: 2,
        face2: 5,
        owner: 'player1',
        orientation: 'horizontal',
      },
      position: { row: 0, col: 0 },
      orientation: 'horizontal',
      matchedFace: 2,
      adjacentFace: 5,
      diceSum: 7,
      moveNumber: 1,
    });
    expect(text).toContain('[2|5]');
    expect(text).toContain('7');
  });
});
