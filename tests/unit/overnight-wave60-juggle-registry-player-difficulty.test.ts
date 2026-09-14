/**
 * Wave 60 leftover after tip/#279 — Juggle registry secondary fields.
 * Wave58 locked name/division/grade/description/icon. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getGameById } from '../../src/core/game-registry';

describe('Wave 60 juggle — registry player difficulty', () => {
  it('locks playerCount, intermediate, available', () => {
    const g = getGameById('juggle');
    expect(g?.playerCount).toBe('2 Players');
    expect(g?.difficulty).toBe('intermediate');
    expect(g?.available).toBe(true);
  });
});
