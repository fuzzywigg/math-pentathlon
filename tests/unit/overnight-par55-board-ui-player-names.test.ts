/**
 * Overnight TOKENMAXX HEAVY — par-55 player names leftovers after #202.
 * Tests-only. Distinct from demos (#202) and wave43/44 Contig/SD/Star/Fab drafts.
 * No product inventing.
 */

import { describe, it, expect } from 'vitest';
import { getPlayerName } from '../../src/games/par-55/board-ui';

describe('Overnight par55 — player names', () => {
  it('seat labels differ and are non-empty', () => {
    expect(getPlayerName('player1').length).toBeGreaterThan(0);
    expect(getPlayerName('player2').length).toBeGreaterThan(0);
    expect(getPlayerName('player1')).not.toBe(getPlayerName('player2'));
  });
});
