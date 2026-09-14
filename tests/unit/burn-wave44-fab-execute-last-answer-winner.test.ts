/**
 * Wave 44 — Fab-a-Diffy executeMove triggering checkWinner via last answer.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  selectBar1,
  selectBar2,
  selectOperation,
  executeMove,
} from '../../src/games/fab-a-diffy/rules';
import type { FabADiffyState } from '../../src/games/fab-a-diffy/types';

describe('Wave 44 Fab — execute last-answer winner', () => {
  it('claiming final unclaimed answer ends game for majority', () => {
    const base = createInitialState();
    const fractionBars = new Map(base.fractionBars);
    const answerBars = new Map(base.answerBars);
    fractionBars.clear();
    answerBars.clear();
    // Extra unused bars so exhaust-bars branch is not the trigger
    for (let i = 0; i < 4; i++) {
      fractionBars.set(`extra-${i}`, {
        id: `extra-${i}`,
        fraction: { numerator: 1, denominator: 12 },
        owner: null,
        used: false,
      });
    }
    fractionBars.set('b1', {
      id: 'b1',
      fraction: { numerator: 1, denominator: 2 },
      owner: null,
      used: false,
    });
    fractionBars.set('b2', {
      id: 'b2',
      fraction: { numerator: 1, denominator: 2 },
      owner: null,
      used: false,
    });
    answerBars.set('claimed-p1', {
      id: 'claimed-p1',
      fraction: { numerator: 1, denominator: 3 },
      claimedBy: 'player1',
    });
    answerBars.set('last', {
      id: 'last',
      fraction: { numerator: 1, denominator: 1 },
      claimedBy: null,
    });
    let state: FabADiffyState = {
      ...base,
      fractionBars,
      answerBars,
      scores: { player1: 1, player2: 0 },
    };
    state = selectBar1(state, 'b1');
    state = selectBar2(state, 'b2');
    state = selectOperation(state, 'add');
    const next = executeMove(state, 'last');
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
    expect(next.scores.player1).toBe(2);
    // Winner keeps seat
    expect(next.currentPlayer).toBe('player1');
  });

  it('last answer tie-break prefers player2 when claims equal after move', () => {
    const base = createInitialState();
    const fractionBars = new Map(base.fractionBars);
    const answerBars = new Map(base.answerBars);
    fractionBars.clear();
    answerBars.clear();
    fractionBars.set('b1', {
      id: 'b1',
      fraction: { numerator: 1, denominator: 5 },
      owner: null,
      used: false,
    });
    fractionBars.set('b2', {
      id: 'b2',
      fraction: { numerator: 1, denominator: 5 },
      owner: null,
      used: false,
    });
    for (let i = 0; i < 4; i++) {
      fractionBars.set(`pad-${i}`, {
        id: `pad-${i}`,
        fraction: { numerator: 1, denominator: 8 },
        owner: null,
        used: false,
      });
    }
    // player2 already has 1; player1 will claim last → both at 1 → tie goes to player2
    answerBars.set('p2', {
      id: 'p2',
      fraction: { numerator: 2, denominator: 5 },
      claimedBy: 'player2',
    });
    answerBars.set('last', {
      id: 'last',
      fraction: { numerator: 2, denominator: 5 },
      claimedBy: null,
    });
    let state: FabADiffyState = {
      ...base,
      fractionBars,
      answerBars,
      scores: { player1: 0, player2: 1 },
    };
    state = selectBar1(state, 'b1');
    state = selectBar2(state, 'b2');
    state = selectOperation(state, 'add');
    const next = executeMove(state, 'last');
    expect(next.phase).toBe('gameOver');
    // all claimed: 1 vs 1 → ternary picks player2
    expect(next.winner).toBe('player2');
  });
});
