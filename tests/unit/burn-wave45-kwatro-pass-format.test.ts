/**
 * Wave 45 — Kwatro passTurn / formatMove leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, passTurn, formatMove } from '../../src/games/kwatro-sinko/rules';
import type { KwaMove } from '../../src/games/kwatro-sinko/types';

describe('Wave 45 kwatro — pass/format', () => {
  it('pass flips seat; formatMove embeds chip value', () => {
    const next = passTurn(createInitialState());
    expect(next.currentPlayer).toBe('player2');
    expect(next.phase).toBe('selectingChip');
    const move: KwaMove = {
      player: 'player1',
      chip: { id: 'p1-0', value: 0, owner: 'player1', position: 'n1-0' },
      fromNode: 'n0-0',
      toNode: 'n1-0',
      alignment: null,
      moveNumber: 1,
    };
    expect(formatMove(move)).toBe('Chip 0');
  });
});
