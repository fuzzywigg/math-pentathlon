/** Wave 42 — Par 55 both hands empty score settle. Tests-only. */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  placeBlock,
  getValidPlacements,
} from '../../src/games/par-55/rules';

describe('Wave 42 par55 — both hands empty settle', () => {
  it('last block with empty opponent hand → higher score wins', () => {
    const open = createInitialState();
    const last = open.hands.player1[0];
    const forged = {
      ...open,
      phase: 'placingBlock' as const,
      selectedBlock: last.id,
      hands: {
        player1: [last],
        player2: [] as typeof open.hands.player2,
      },
      scores: { player1: 12, player2: 7 },
    };
    const next = placeBlock(forged, getValidPlacements(forged)[0]);
    expect(next.hands.player1).toHaveLength(0);
    expect(next.hands.player2).toHaveLength(0);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
  });

  it('last block empty hands equal scores → draw winner null', () => {
    const open = createInitialState();
    const last = open.hands.player1[0];
    const forged = {
      ...open,
      phase: 'placingBlock' as const,
      selectedBlock: last.id,
      hands: {
        player1: [last],
        player2: [] as typeof open.hands.player2,
      },
      scores: { player1: 0, player2: 0 },
    };
    const next = placeBlock(forged, getValidPlacements(forged)[0]);
    // Points from place may break the draw
    if (next.scores.player1 === next.scores.player2) {
      expect(next.phase).toBe('gameOver');
      expect(next.winner).toBeNull();
    } else {
      expect(next.phase).toBe('gameOver');
      expect(next.winner).toBe(
        next.scores.player1 > next.scores.player2 ? 'player1' : 'player2'
      );
    }
  });

  it('empty own hand but opponent still has cards → no empty-hand settle', () => {
    const open = createInitialState();
    const last = open.hands.player1[0];
    const forged = {
      ...open,
      phase: 'placingBlock' as const,
      selectedBlock: last.id,
      hands: {
        player1: [last],
        player2: open.hands.player2, // opponent still has cards
      },
      scores: { player1: 3, player2: 9 },
    };
    const next = placeBlock(forged, getValidPlacements(forged)[0]);
    expect(next.hands.player1).toHaveLength(0);
    expect(next.hands.player2.length).toBeGreaterThan(0);
    // No TARGET and opponent has cards → continue
    expect(next.phase).toBe('selectingBlock');
    expect(next.winner).toBeNull();
    expect(next.currentPlayer).toBe('player2');
  });

  it('p2 last block with empty p1 hand → p2 score wins when higher', () => {
    const open = createInitialState();
    const last = open.hands.player2[0];
    const forged = {
      ...open,
      currentPlayer: 'player2' as const,
      phase: 'placingBlock' as const,
      selectedBlock: last.id,
      hands: {
        player1: [] as typeof open.hands.player1,
        player2: [last],
      },
      scores: { player1: 5, player2: 18 },
    };
    const next = placeBlock(forged, getValidPlacements(forged)[0]);
    expect(next.hands.player1).toHaveLength(0);
    expect(next.hands.player2).toHaveLength(0);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player2');
  });
});
