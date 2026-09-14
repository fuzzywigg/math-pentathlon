/**
 * Wave 45 TOKENMAXX — Kwatro passTurn seat flip leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, passTurn } from '../../src/games/kwatro-sinko/rules';

describe('Wave 45 kwatro — passTurn', () => {
  it('flips seat and clears selection', () => {
    const open = createInitialState();
    const next = passTurn({ ...open, selectedChip: 'p1-0', phase: 'selectingDest' });
    expect(next.currentPlayer).toBe('player2');
    expect(next.selectedChip).toBeNull();
    expect(next.phase).toBe('selectingChip');
  });
});
