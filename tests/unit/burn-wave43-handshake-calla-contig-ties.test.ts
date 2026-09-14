/**
 * Wave 43 — Handshake calla tie string vs contig null winner. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState as calla } from '../../src/games/calla/types';
import { createInitialState as contig } from '../../src/games/contig-60/types';
import { getPhaseMessage } from '../../src/games/calla/rules';
import { checkWinner } from '../../src/games/contig-60/rules';

describe('Wave 43 handshake — calla×contig ties', () => {
  it('calla can be tie; contig checkWinner null on open', () => {
    const tied = {
      ...calla(),
      phase: 'gameOver' as const,
      winner: 'tie' as const,
    };
    expect(getPhaseMessage(tied)).toBe("It's a tie!");
    expect(checkWinner(contig())).toBeNull();
  });
});
