/**
 * Overnight TOKENMAXX HEAVY — par-55 hand selected class leftovers after #202.
 * Tests-only. Distinct from demos (#202) and wave43/44 Contig/SD/Star/Fab drafts.
 * No product inventing.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createInitialState, selectBlock } from '../../src/games/par-55/rules';
import { renderHand } from '../../src/games/par-55/board-ui';

beforeEach(() => { document.body.innerHTML = ''; });
afterEach(() => { document.body.innerHTML = ''; });

describe('Overnight par55 — hand selected class', () => {
  it('selected block wrapper has .selected', () => {
    const open = createInitialState();
    const selected = selectBlock(open, open.hands.player1[0].id);
    const hand = renderHand(selected, 'player1', () => {});
    expect(hand.querySelectorAll('.par55-hand-block.selected').length).toBe(1);
  });

  it('non-current player hand has no clickable class', () => {
    const open = createInitialState();
    const hand = renderHand(open, 'player2', () => {});
    expect(hand.querySelectorAll('.par55-hand-block.clickable').length).toBe(0);
  });
});
