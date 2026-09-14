/**
 * Wave 57 leftover after #267 — Sum blank [0|0] face has zero pips. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/sum-dominoes/rules';
import { renderHand } from '../../src/games/sum-dominoes/board-ui';

describe('Wave 57 sum — blank face zero pips', () => {
  it('double-blank hand domino faces render zero .sd-pip', () => {
    const blank = {
      id: 'blank-00',
      face1: 0,
      face2: 0,
      owner: 'player1' as const,
      orientation: 'horizontal' as const,
    };
    const state = {
      ...createInitialState(),
      hands: { player1: [blank], player2: [] },
      phase: 'placing' as const,
      currentDice: [1, 1] as [number, number],
    };
    const el = renderHand(state, 'player1', () => undefined);
    const faces = el.querySelectorAll('.sd-domino-face');
    expect(faces.length).toBe(2);
    for (const face of faces) {
      expect(face.querySelectorAll('.sd-pip')).toHaveLength(0);
    }
  });
});
