/**
 * Wave 39 — handshake: contig/sd engines registered + initial phases.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getGameById } from '../../src/core/game-registry';
import { createInitialState as contigInit } from '../../src/games/contig-60/types';
import { createInitialState as sdInit } from '../../src/games/sum-dominoes/rules';

describe('Wave 39 handshake — contig/sd registry', () => {
  it('registry chrome ids match engine boot phases', () => {
    expect(getGameById('contig-60')?.name.length).toBeGreaterThan(0);
    expect(getGameById('sum-dominoes')?.name.length).toBeGreaterThan(0);
    expect(contigInit().phase).toBe('rolling');
    expect(sdInit().phase).toBe('rolling');
  });
});
