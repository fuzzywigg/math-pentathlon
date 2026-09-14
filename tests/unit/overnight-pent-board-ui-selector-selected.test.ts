/**
 * Overnight TOKENMAXX HEAVY — pent-em-in selector selected leftovers after #202.
 * Tests-only. Distinct from demos (#202) and wave43/44 Contig/SD/Star/Fab drafts.
 * No product inventing.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/pent-em-in/types';
import { selectPiece } from '../../src/games/pent-em-in/rules';
import { renderPieceSelector, getPlayerName, injectPentEmInStyles } from '../../src/games/pent-em-in/board-ui';

beforeEach(() => {
  document.body.innerHTML = '';
  document.getElementById('pent-em-in-styles')?.remove();
});
afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('pent-em-in-styles')?.remove();
});

describe('Overnight pent — selector selected + names + styles', () => {
  it('selected piece option has .selected', () => {
    const open = createInitialState();
    const shapeId = open.player1Pieces.available[0];
    const selected = selectPiece(open, shapeId);
    const el = renderPieceSelector(selected, () => {});
    expect(el.querySelector('.pent-piece-option.selected')).toBeTruthy();
  });

  it('player names differ and styles inject once', () => {
    expect(getPlayerName('player1')).not.toBe(getPlayerName('player2'));
    injectPentEmInStyles();
    injectPentEmInStyles();
    expect(document.querySelectorAll('#pent-em-in-styles').length).toBe(1);
  });
});
