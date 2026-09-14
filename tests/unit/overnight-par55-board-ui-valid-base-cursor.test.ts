/**
 * Overnight TOKENMAXX HEAVY — par-55 valid-base class leftovers after #202.
 * Tests-only. Distinct from demos (#202) and wave43/44 Contig/SD/Star/Fab drafts.
 * No product inventing.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createInitialState, selectBlock, getValidPlacements } from '../../src/games/par-55/rules';
import { renderBoard } from '../../src/games/par-55/board-ui';

beforeEach(() => { document.body.innerHTML = ''; });
afterEach(() => { document.body.innerHTML = ''; });

describe('Overnight par55 — valid-base class', () => {
  it('placingBlock marks exactly getValidPlacements count with .par55-valid-base', () => {
    const open = createInitialState();
    const selected = selectBlock(open, open.hands.player1[0].id);
    const valids = getValidPlacements(selected);
    const board = renderBoard(selected, () => {});
    expect(board.querySelectorAll('.par55-valid-base').length).toBe(valids.length);
  });

  it('selectingBlock phase has zero valid-base markers', () => {
    const open = createInitialState();
    const board = renderBoard(open, () => {});
    expect(board.querySelectorAll('.par55-valid-base').length).toBe(0);
  });
});
