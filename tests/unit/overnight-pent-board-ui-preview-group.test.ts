/**
 * Overnight TOKENMAXX HEAVY — pent-em-in preview group leftovers after #202.
 * Tests-only. Distinct from demos (#202) and wave43/44 Contig/SD/Star/Fab drafts.
 * No product inventing.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/pent-em-in/types';
import { selectPiece, setPreviewPosition } from '../../src/games/pent-em-in/rules';
import { renderBoard } from '../../src/games/pent-em-in/board-ui';

beforeEach(() => { document.body.innerHTML = ''; });
afterEach(() => { document.body.innerHTML = ''; });

describe('Overnight pent — preview group', () => {
  it('selected + previewPosition renders .preview group', () => {
    const open = createInitialState();
    const shapeId = open.player1Pieces.available[0];
    let state = selectPiece(open, shapeId);
    state = setPreviewPosition(state, { row: 4, col: 4 });
    const board = renderBoard(state, () => {}, () => {});
    expect(board.querySelector('g.preview')).toBeTruthy();
  });
});
