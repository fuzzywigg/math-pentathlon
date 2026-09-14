/**
 * Wave 41 — Star Track isGameOver / getProgress / getPhaseMessage.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import {
  isGameOver,
  getProgress,
  getPhaseMessage,
  drawChains,
} from '../../src/games/star-track/rules';
import {
  createInitialState,
  TRACK_LENGTH,
} from '../../src/games/star-track/types';

describe('Wave 41 Star Track — progress / phase / over', () => {
  it('isGameOver false at start; true on gameOver phase or winner set', () => {
    const fresh = createInitialState();
    expect(isGameOver(fresh)).toBe(false);
    expect(isGameOver({ ...fresh, phase: 'gameOver', winner: null })).toBe(
      true
    );
    expect(
      isGameOver({
        ...fresh,
        phase: 'drawChains',
        winner: 'player2',
      })
    ).toBe(true);
  });

  it('getProgress scales 0 → 100 with TRACK_LENGTH', () => {
    const state = createInitialState();
    expect(getProgress(state, 'player1')).toBe(0);
    expect(getProgress(state, 'player2')).toBe(0);
    const mid = {
      ...state,
      player1Position: TRACK_LENGTH / 2,
      player2Position: TRACK_LENGTH,
    };
    expect(getProgress(mid, 'player1')).toBe(50);
    expect(getProgress(mid, 'player2')).toBe(100);
  });

  it('getPhaseMessage covers draw / select / over / draw text', () => {
    const draw = createInitialState();
    expect(getPhaseMessage(draw)).toContain('Draw chains');
    expect(getPhaseMessage(draw)).toContain('Blue');

    const select = drawChains(draw);
    expect(getPhaseMessage(select)).toContain('Choose a chain');

    const p1Win = {
      ...draw,
      phase: 'gameOver' as const,
      winner: 'player1' as const,
    };
    expect(getPhaseMessage(p1Win)).toContain('Blue wins');

    const p2Win = {
      ...draw,
      phase: 'gameOver' as const,
      winner: 'player2' as const,
      currentPlayer: 'player2' as const,
    };
    expect(getPhaseMessage(p2Win)).toContain('Red wins');

    const tie = {
      ...draw,
      phase: 'gameOver' as const,
      winner: null,
    };
    expect(getPhaseMessage(tie)).toContain('draw');

    const unknown = {
      ...draw,
      phase: 'moving' as const,
    };
    expect(getPhaseMessage(unknown)).toBe('');
  });
});
