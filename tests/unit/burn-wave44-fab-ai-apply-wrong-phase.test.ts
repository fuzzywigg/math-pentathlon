/**
 * Wave 44 — Fab-a-Diffy applyAIMoveSteps wrong starting phase leftovers.
 * Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/fab-a-diffy/rules';
import { applyAIMoveSteps, type AIMove } from '../../src/games/fab-a-diffy/ai';
import type { FabADiffyState, GamePhase } from '../../src/games/fab-a-diffy/types';

afterEach(() => vi.restoreAllMocks());

describe('Wave 44 Fab AI — apply from wrong phase', () => {
  const phases: GamePhase[] = [
    'selectingBar2',
    'selectingOperation',
    'confirmingMove',
    'gameOver',
  ];

  it.each(phases)('phase %s → selectBar1 fail → passTurn', (phase) => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const state = createInitialState();
    const ids = [...state.fractionBars.keys()];
    const stuck: FabADiffyState = {
      ...state,
      phase,
      winner: phase === 'gameOver' ? 'player1' : null,
    };
    const move: AIMove = {
      bar1Id: ids[0],
      bar2Id: ids[1],
      operation: 'add',
      answerId: [...state.answerBars.keys()][0],
    };
    const next = applyAIMoveSteps(stuck, move);
    expect(next.moveHistory).toHaveLength(0);
    expect(errorSpy).toHaveBeenCalled();
  });

  it('happy path from selectingBar1 marks both bars used', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = createInitialState();
    const bars = new Map(state.fractionBars);
    const answers = new Map(state.answerBars);
    bars.clear();
    bars.set('a', {
      id: 'a',
      fraction: { numerator: 1, denominator: 4 },
      owner: null,
      used: false,
    });
    bars.set('b', {
      id: 'b',
      fraction: { numerator: 1, denominator: 4 },
      owner: null,
      used: false,
    });
    answers.clear();
    answers.set('half', {
      id: 'half',
      fraction: { numerator: 1, denominator: 2 },
      claimedBy: null,
    });
    const synthetic: FabADiffyState = {
      ...state,
      fractionBars: bars,
      answerBars: answers,
    };
    const next = applyAIMoveSteps(synthetic, {
      bar1Id: 'a',
      bar2Id: 'b',
      operation: 'add',
      answerId: 'half',
    });
    expect(next.fractionBars.get('a')?.used).toBe(true);
    expect(next.fractionBars.get('b')?.used).toBe(true);
    expect(next.answerBars.get('half')?.claimedBy).toBe('player1');
    expect(next.moveHistory).toHaveLength(1);
  });
});
