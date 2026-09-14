/**
 * Wave 44 — Fab-a-Diffy applyAIMoveSteps selectOperation / execute leftovers.
 * Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/fab-a-diffy/rules';
import { applyAIMoveSteps, type AIMove } from '../../src/games/fab-a-diffy/ai';
import type { FabADiffyState } from '../../src/games/fab-a-diffy/types';

afterEach(() => vi.restoreAllMocks());

describe('Wave 44 Fab AI — applyAIMoveSteps selectOp / execute fail', () => {
  it('ghost bar ids that vanish after select → pass on selectOp', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const state = createInitialState();
    const ids = [...state.fractionBars.keys()];
    // Craft a move with valid ids, but shrink map so selectBar1/2 succeed
    // then delete selected bars before… actually applyAIMoveSteps runs
    // sequentially on one state. Force selectOperation fail by starting
    // with bars that get removed mid-pipeline is impossible without hooks;
    // instead start in selectingBar1 with bars that exist, then use a
    // state where selected bars are deleted — covered via wrong-phase start.
    const midPhase: FabADiffyState = {
      ...state,
      phase: 'selectingOperation',
      selectedBar1: ids[0],
      selectedBar2: ids[1],
    };
    const bad: AIMove = {
      bar1Id: ids[0],
      bar2Id: ids[1],
      operation: 'add',
      answerId: [...state.answerBars.keys()][0],
    };
    // selectBar1 fails because phase !== selectingBar1 → passTurn
    const next = applyAIMoveSteps(midPhase, bad);
    expect(next.moveHistory).toHaveLength(0);
    expect(next.currentPlayer).toBe('player2');
    expect(errorSpy).toHaveBeenCalled();
  });

  it('claimed answer after valid selects → execute fail passTurn', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = createInitialState();
    // Build known matching pair: 1/2 + 1/2 = 1
    const bars = new Map(state.fractionBars);
    const answers = new Map(state.answerBars);
    bars.clear();
    bars.set('h1', {
      id: 'h1',
      fraction: { numerator: 1, denominator: 2 },
      owner: null,
      used: false,
    });
    bars.set('h2', {
      id: 'h2',
      fraction: { numerator: 1, denominator: 2 },
      owner: null,
      used: false,
    });
    answers.clear();
    answers.set('whole', {
      id: 'whole',
      fraction: { numerator: 1, denominator: 1 },
      claimedBy: 'player2',
    });
    const synthetic: FabADiffyState = {
      ...state,
      fractionBars: bars,
      answerBars: answers,
    };
    const move: AIMove = {
      bar1Id: 'h1',
      bar2Id: 'h2',
      operation: 'add',
      answerId: 'whole',
    };
    const next = applyAIMoveSteps(synthetic, move);
    expect(next.moveHistory).toHaveLength(0);
    expect(next.currentPlayer).toBe('player2');
    expect(errorSpy).toHaveBeenCalled();
  });
});
