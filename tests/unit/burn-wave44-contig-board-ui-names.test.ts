/**
 * Wave 44 — Contig board-ui name leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getPlayerName } from '../../src/games/contig-60/board-ui';

describe('Wave 44 Contig — board-ui names', () => {
  it('names both seats', () => {
    expect(getPlayerName('player1').length).toBeGreaterThan(0);
    expect(getPlayerName('player2').length).toBeGreaterThan(0);
    expect(getPlayerName('player1')).not.toBe(getPlayerName('player2'));
  });
});
