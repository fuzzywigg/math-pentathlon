/**
 * Wave 43 — executeAITurn full board passes leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, hasValidMoves } from '../../src/games/stars-bars/rules';
import { executeAITurn } from '../../src/games/stars-bars/ai';
import type { AttributeCard } from '../../src/games/stars-bars/types';

describe('Wave 43 stars — AI fullboard pass', () => {
  it('full board → execute passes seat', () => {
    let s = createInitialState();
    const dummy: AttributeCard = {
      id: 'x',
      shape: 'circle',
      color: 'red',
      size: 'small',
      thickness: 'thin',
    };
    s = {
      ...s,
      cells: s.cells.map((row) =>
        row.map((cell) => ({ ...cell, card: dummy, owner: 'player1' as const }))
      ),
    };
    expect(hasValidMoves(s)).toBe(false);
    const next = executeAITurn(s, 'player1', 'medium');
    expect(next.currentPlayer).toBe('player2');
    expect(next.moveHistory.length).toBe(s.moveHistory.length);
  });
});
