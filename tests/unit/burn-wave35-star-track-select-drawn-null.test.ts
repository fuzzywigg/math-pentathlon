/**
 * Wave 35 — Star Track selectChain without drawnChains + progress/AI null.
 * Distinct from wave14 phase messages and empty-bucket exhaust suites.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  TRACK_LENGTH,
} from '../../src/games/star-track/types';
import {
  drawChains,
  selectChain,
  getProgress,
  getPhaseMessage,
  isGameOver,
} from '../../src/games/star-track/rules';
import { getAIChainChoice, isAITurn } from '../../src/games/star-track/ai';

describe('Wave 35 Star Track — select drawn null', () => {
  it('selectChain identity when drawnChains null even if phase forged', () => {
    const state = {
      ...createInitialState(),
      phase: 'selectChain' as const,
      drawnChains: null,
    };
    expect(selectChain(state, 0)).toBe(state);
  });

  it('getProgress scales with position / TRACK_LENGTH', () => {
    const state = createInitialState();
    expect(getProgress(state, 'player1')).toBe(0);
    const mid = {
      ...state,
      player1Position: Math.floor(TRACK_LENGTH / 2),
    };
    const p = getProgress(mid, 'player1');
    expect(p).toBe(Math.round((Math.floor(TRACK_LENGTH / 2) / TRACK_LENGTH) * 100));
  });

  it('drawChains then getPhaseMessage for selectChain', () => {
    const drawn = drawChains(createInitialState());
    expect(drawn.drawnChains).not.toBeNull();
    expect(getPhaseMessage(drawn).length).toBeGreaterThan(0);
  });

  it('AI choice null without drawnChains; isAITurn hvh false', () => {
    const forged = {
      ...createInitialState(),
      phase: 'selectChain' as const,
      drawnChains: null,
    };
    expect(getAIChainChoice(forged, 'player1', 'hard')).toBeNull();
    expect(isAITurn(createInitialState(), 'player1', 'human-vs-human')).toBe(false);
    expect(isGameOver(createInitialState())).toBe(false);
  });
});
