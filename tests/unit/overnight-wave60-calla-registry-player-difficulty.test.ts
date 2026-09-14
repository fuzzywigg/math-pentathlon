/**
 * Wave 60 leftover after tip/#279 — Calla registry playerCount × difficulty.
 * Wave58 locked name/division/grade/description/icon/available. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getGameById } from '../../src/core/game-registry';

describe('Wave 60 calla — registry player difficulty', () => {
  it('locks playerCount and intermediate difficulty', () => {
    const g = getGameById('calla');
    expect(g?.playerCount).toBe('2 Players');
    expect(g?.difficulty).toBe('intermediate');
  });
});
