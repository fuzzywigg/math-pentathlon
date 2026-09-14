/**
 * Wave 41 — handshake: contig-60 + remainder registry boot (sd only id lookup).
 * Tests-only. No sum-dominoes reject paths (claimed by #181).
 */
import { describe, it, expect } from 'vitest';
import { getGameById } from '../../src/core/game-registry';
import { createInitialState as contigInit } from '../../src/games/contig-60/types';
import { createInitialState as remInit } from '../../src/games/remainder-islands/types';

describe('Wave 41 handshake — contig/remainder registry', () => {
  it('registry chrome ids match engine boot phases', () => {
    expect(getGameById('contig-60')?.name.length).toBeGreaterThan(0);
    expect(getGameById('remainder-islands')?.name.length).toBeGreaterThan(0);
    expect(getGameById('sum-dominoes')?.id).toBe('sum-dominoes');
    expect(contigInit().phase).toBe('rolling');
    expect(remInit().phase).toBe('rolling');
  });
});
