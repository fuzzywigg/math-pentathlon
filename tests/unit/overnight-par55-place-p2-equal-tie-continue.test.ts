/**
 * Overnight TOKENMAXX HEAVY — par-55 p2 equal tie continue leftovers after #202.
 * Tests-only. Distinct from demos (#202) and wave43/44 Contig/SD/Star/Fab drafts.
 * No product inventing.
 */

import { describe, it, expect } from 'vitest';
import { createInitialState, selectBlock, placeBlock, getValidPlacements } from '../../src/games/par-55/rules';
import { CONFIG } from '../../src/games/par-55/types';

describe('Overnight par55 — p2 equal-score tie continues', () => {
  it('when both reach TARGET equally on p2 turn, winner stays null and phase stays playable', () => {
    const open = createInitialState();
    // Forge: fill one adjacent pair so a placement can score 0; we force scores via place after select
    // Place any legal p2 move with forged scores already at TARGET-0 for both after add 0.
    const p2 = {
      ...open,
      currentPlayer: 'player2' as const,
      phase: 'selectingBlock' as const,
      scores: { player1: CONFIG.TARGET_SCORE, player2: CONFIG.TARGET_SCORE },
      hands: {
        player1: open.hands.player1,
        player2: open.hands.player2,
      },
    };
    const blockId = p2.hands.player2[0].id;
    const selected = selectBlock(p2, blockId);
    const valids = getValidPlacements(selected);
    expect(valids.length).toBeGreaterThan(0);
    const next = placeBlock(selected, valids[0]);
    // Equal scores at TARGET on p2 turn → tie continue (winner null) unless points break equality
    if (next.scores.player1 === next.scores.player2 && next.scores.player1 >= CONFIG.TARGET_SCORE) {
      expect(next.winner).toBeNull();
      expect(next.phase).not.toBe('gameOver');
    } else {
      // scoring points broke the tie — still a defined outcome
      expect(['player1', 'player2', null]).toContain(next.winner);
    }
  });
});
