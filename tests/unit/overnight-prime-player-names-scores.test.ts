/**
 * Overnight TOKENMAXX HEAVY — prime-gold names + scores leftovers after #202.
 * Tests-only. Distinct from demos (#202) and wave43/44 Contig/SD/Star/Fab drafts.
 * No product inventing.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/prime-gold/rules';
import { getPlayerName, renderScores } from '../../src/games/prime-gold/board-ui';

beforeEach(() => { document.body.innerHTML = ''; });
afterEach(() => { document.body.innerHTML = ''; });

describe('Overnight prime — names + scores', () => {
  it('seat names differ', () => {
    expect(getPlayerName('player1')).not.toBe(getPlayerName('player2'));
  });

  it('renderScores shows chip counts', () => {
    const state = createInitialState();
    const el = renderScores(state);
    expect(el.textContent).toContain(String(state.playerChips.player1));
    expect(el.textContent).toMatch(/chips/i);
  });
});
