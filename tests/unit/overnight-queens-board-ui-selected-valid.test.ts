/**
 * Overnight TOKENMAXX HEAVY — queens-guards board selected + valids leftovers after #202.
 * Tests-only. Distinct from demos (#202) and wave43/44 Contig/SD/Star/Fab drafts.
 * No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { selectPiece, getValidMoves } from '../../src/games/queens-guards/rules';
import { createInitialState } from '../../src/games/queens-guards/types';
import { renderBoard } from '../../src/games/queens-guards/board-ui';

beforeEach(() => {
  document.body.innerHTML = '';
});
afterEach(() => {
  document.body.innerHTML = '';
});

describe('Overnight queens — board selected + valids', () => {
  it('renderBoard returns svg with ring cells after select', () => {
    const state = createInitialState();
    const coord = { ring: 5, position: 1 };
    expect(getValidMoves(state, coord).length).toBeGreaterThan(0);
    const selected = selectPiece(state, coord);
    const board = renderBoard(selected, () => {});
    document.body.appendChild(board);
    expect(board.tagName.toLowerCase()).toBe('svg');
    expect(board.querySelectorAll('g, circle, polygon').length).toBeGreaterThan(
      0
    );
  });
});
