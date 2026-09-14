/**
 * Wave 41 — Fab-a-Diffy pass / winner / hasAnyValidMove leftovers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  passTurn,
  checkWinner,
  hasAnyValidMove,
  selectBar1,
  selectBar2,
  selectOperation,
} from '../../src/games/fab-a-diffy/rules';
import type { AnswerBar, FractionBar, FabADiffyState } from '../../src/games/fab-a-diffy/types';

describe('Wave 41 Fab — pass / winner settle', () => {
  it('passTurn clears selection and flips seat when opponent can move', () => {
    let state = createInitialState();
    const [a, b] = [...state.fractionBars.keys()];
    state = selectBar1(state, a);
    state = selectBar2(state, b);
    state = selectOperation(state, 'add');
    const next = passTurn(state);
    expect(next.currentPlayer).toBe('player2');
    expect(next.phase).toBe('selectingBar1');
    expect(next.selectedBar1).toBeNull();
    expect(next.selectedBar2).toBeNull();
    expect(next.selectedOperation).toBeNull();
  });

  it('passTurn ends game when neither side has a valid move', () => {
    const state = createInitialState();
    const bars = new Map<string, FractionBar>();
    for (const [id, bar] of state.fractionBars) {
      bars.set(id, { ...bar, used: true });
    }
    // leave only one unused → hasAnyValidMove false
    const ids = [...bars.keys()];
    bars.set(ids[0], { ...bars.get(ids[0])!, used: false });
    const jammed: FabADiffyState = {
      ...state,
      fractionBars: bars,
      scores: { player1: 3, player2: 1 },
    };
    expect(hasAnyValidMove(jammed)).toBe(false);
    const next = passTurn(jammed);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
  });

  it('passTurn tie scores → winner null when jammed', () => {
    const state = createInitialState();
    const bars = new Map(state.fractionBars);
    for (const [id, bar] of bars) {
      bars.set(id, { ...bar, used: true });
    }
    const jammed: FabADiffyState = {
      ...state,
      fractionBars: bars,
      scores: { player1: 2, player2: 2 },
    };
    const next = passTurn(jammed);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBeNull();
  });

  it('checkWinner all answers claimed → majority leader', () => {
    const state = createInitialState();
    const answers = new Map<string, AnswerBar>();
    const ids = [...state.answerBars.keys()];
    ids.forEach((id, i) => {
      answers.set(id, {
        ...state.answerBars.get(id)!,
        claimedBy: i === ids.length - 1 ? 'player2' : 'player1',
      });
    });
    expect(checkWinner(answers, state.fractionBars)).toBe('player1');
  });

  it('checkWinner near-exhaust bars with unequal claims', () => {
    const state = createInitialState();
    const answers = new Map(state.answerBars);
    // claim a few unequally, leave some open so first branch skipped
    const ids = [...answers.keys()];
    answers.set(ids[0], { ...answers.get(ids[0])!, claimedBy: 'player2' });
    answers.set(ids[1], { ...answers.get(ids[1])!, claimedBy: 'player2' });
    const bars = new Map(state.fractionBars);
    const barIds = [...bars.keys()];
    barIds.forEach((id, idx) => {
      bars.set(id, { ...bars.get(id)!, used: idx < barIds.length - 1 });
    });
    expect(checkWinner(answers, bars)).toBe('player2');
  });

  it('opening hasAnyValidMove true; zero bars false', () => {
    expect(hasAnyValidMove(createInitialState())).toBe(true);
    const empty: FabADiffyState = {
      ...createInitialState(),
      fractionBars: new Map(),
    };
    expect(hasAnyValidMove(empty)).toBe(false);
  });
});
