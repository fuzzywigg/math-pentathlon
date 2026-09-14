/**
 * Wave 43 — Handshake sum passCount vs contig consecutivePasses. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState as sum } from '../../src/games/sum-dominoes/rules';
import { createInitialState as contig, CONFIG } from '../../src/games/contig-60/types';

describe('Wave 43 handshake — sum×contig pass counters', () => {
  it('sum uses scalar passCount; contig per-seat with MAX 3', () => {
    expect(sum().passCount).toBe(0);
    expect(contig().consecutivePasses).toEqual({ player1: 0, player2: 0 });
    expect(CONFIG.MAX_CONSECUTIVE_PASSES).toBe(3);
  });
});
