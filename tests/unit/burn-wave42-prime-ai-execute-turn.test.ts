/**
 * Wave 42 — Prime Gold executeAITurn leftovers after #186. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import { executeAITurn } from '../../src/games/prime-gold/ai';
import {
  createInitialState,
  rollDice,
  getValidPlacements,
  findCellByValue,
} from '../../src/games/prime-gold/rules';

afterEach(() => vi.restoreAllMocks());

describe('Wave 42 prime — executeAITurn', () => {
  it('rolls then places on rolling phase for AI seat', () => {
    vi.spyOn(Math, 'random').mockReturnValue(1);
    const start = createInitialState();
    expect(start.phase).toBe('rolling');
    const next = executeAITurn(start, 'player1', 'medium');
    expect(next.phase).toBe('rolling');
    expect(next.diceRoll).toBeNull();
    expect(next.currentPlayer).toBe('player2');
    expect(next.moveHistory).toHaveLength(1);
  });

  it('places directly when already in placing phase', () => {
    vi.spyOn(Math, 'random').mockReturnValue(1);
    const placing = rollDice(createInitialState());
    const next = executeAITurn(placing, 'player1', 'medium');
    expect(next.moveHistory.length).toBeGreaterThan(0);
    expect(next.diceRoll).toBeNull();
  });

  it('passes when no valid placements after roll', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let placing = rollDice(createInitialState());
    for (const p of getValidPlacements(placing)) {
      findCellByValue(placing, p.value)!.owner = 'player2';
    }
    const next = executeAITurn(
      { ...placing, phase: 'placing' as const },
      'player1',
      'medium'
    );
    expect(next.diceRoll).toBeNull();
    expect(next.phase).toBe('rolling');
    expect(next.currentPlayer).toBe('player2');
    expect(next.moveHistory).toHaveLength(0);
  });

  it('easy difficulty completes turn without throwing', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.2);
    const next = executeAITurn(createInitialState(), 'player1', 'easy');
    expect(next.currentPlayer).toBe('player2');
  });

  it('passes when placing but wrong seat (getAIPlacement null)', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const placing = rollDice(createInitialState());
    placing.currentPlayer = 'player2';
    const next = executeAITurn(placing, 'player1', 'medium');
    expect(next.diceRoll).toBeNull();
    expect(next.phase).toBe('rolling');
    expect(next.currentPlayer).toBe('player1');
    expect(next.moveHistory).toHaveLength(0);
  });
});
