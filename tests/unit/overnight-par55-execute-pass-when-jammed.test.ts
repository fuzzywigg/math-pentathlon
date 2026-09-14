/**
 * Overnight TOKENMAXX HEAVY — par-55 executeAITurn pass when jammed leftovers after #202.
 * Tests-only. Distinct from demos (#202) and wave43/44 Contig/SD/Star/Fab drafts.
 * No product inventing.
 */

import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/par-55/rules';
import { executeAITurn } from '../../src/games/par-55/ai';

describe('Overnight par55 — executeAITurn pass when jammed', () => {
  it('empty hand forces passTurn path via executeAITurn', () => {
    const open = createInitialState();
    const jammed = {
      ...open,
      hands: { player1: [], player2: open.hands.player2 },
    };
    const next = executeAITurn(jammed, 'player1', 'hard');
    expect(next.currentPlayer).toBe('player2');
  });
});
