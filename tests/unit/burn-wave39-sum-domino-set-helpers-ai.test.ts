/**
 * Wave 39 — Sum Dominoes set helpers + AI leftovers.
 * Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  createDominoSet,
  getDominoPips,
  getDiceSum,
  isDouble,
} from '../../src/games/sum-dominoes/types';
import {
  createInitialState,
  doRollDice,
  formatMove,
  getRemainingCount,
} from '../../src/games/sum-dominoes/rules';
import {
  getAIMove,
  hasPlayableMove,
  isAITurn,
  executeAITurn,
} from '../../src/games/sum-dominoes/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 39 Sum Dominoes — helpers AI', () => {
  it('domino set helpers', () => {
    const set = createDominoSet();
    expect(set.every((d) => d.face1 <= d.face2)).toBe(true);
    expect(
      getDominoPips({
        id: 'x',
        face1: 3,
        face2: 5,
        owner: null,
        orientation: 'horizontal',
      })
    ).toBe(8);
    expect(getDiceSum([6, 6])).toBe(12);
    expect(set.filter(isDouble).length).toBe(7);
  });

  it('getRemainingCount matches hand length', () => {
    const state = createInitialState();
    expect(getRemainingCount(state, 'player1')).toBe(
      state.hands.player1.length
    );
  });

  it('formatMove shapes history string', () => {
    const s = formatMove({
      player: 'player1',
      domino: {
        id: 'd',
        face1: 2,
        face2: 5,
        owner: 'player1',
        orientation: 'horizontal',
      },
      position: { row: 1, col: 1 },
      orientation: 'horizontal',
      matchedFace: 2,
      adjacentFace: 4,
      diceSum: 6,
      moveNumber: 1,
    });
    expect(s).toContain('[2|5]');
    expect(s).toContain('6');
  });

  it('AI move / playable / execute gates', () => {
    const base = createInitialState();
    expect(getAIMove(base, 'player1', 'hard')).toBeNull();
    expect(isAITurn(base, 'player1')).toBe(true);
    expect(isAITurn(base, 'player2')).toBe(false);
    expect(isAITurn(base, null)).toBe(false);

    for (let i = 0; i < 40; i++) {
      const rolled = doRollDice(createInitialState());
      if (!rolled.currentDice) continue;
      const sum = getDiceSum(rolled.currentDice);
      if (rolled.phase === 'placing') {
        expect(hasPlayableMove(rolled, 'player1', sum)).toBe(true);
        const move = getAIMove(rolled, 'player1', 'hard');
        expect(move).not.toBeNull();
        break;
      } else if (rolled.phase === 'passing') {
        expect(hasPlayableMove(rolled, 'player1', sum)).toBe(false);
      }
    }

    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const next = executeAITurn(createInitialState(), 'player1', 'medium');
    expect(['rolling', 'gameOver', 'placing', 'passing']).toContain(next.phase);
  });
});
