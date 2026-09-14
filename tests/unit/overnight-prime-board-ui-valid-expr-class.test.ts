/**
 * Overnight TOKENMAXX HEAVY — prime-gold valid expr class leftovers after #202.
 * Tests-only. Distinct from demos (#202) and wave43/44 Contig/SD/Star/Fab drafts.
 * No product inventing.
 */

import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { createInitialState, rollDice, getValidPlacements } from '../../src/games/prime-gold/rules';
import { renderBoard } from '../../src/games/prime-gold/board-ui';

beforeEach(() => { document.body.innerHTML = ''; });
afterEach(() => { vi.restoreAllMocks(); document.body.innerHTML = ''; });

describe('Overnight prime — valid expr class', () => {
  it('.valid cells match getValidPlacements count after roll', () => {
    let state = createInitialState();
    for (let i = 0; i < 25; i++) {
      vi.spyOn(Math, 'random').mockReturnValue((i * 0.041) % 1);
      state = rollDice(createInitialState());
      vi.restoreAllMocks();
      if (getValidPlacements(state).length > 0) break;
    }
    const valids = getValidPlacements(state);
    expect(valids.length).toBeGreaterThan(0);
    const board = renderBoard(state, () => {});
    expect(board.querySelectorAll('.pg-cell.valid').length).toBe(valids.length);
  });
});
