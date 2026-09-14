/**
 * Wave 43 TOKENMAXX — Contig board-ui names leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getPlayerName } from '../../src/games/contig-60/board-ui';

describe('Wave 43 contig — board-ui names', () => {
  it('distinct seat names', () => {
    expect(getPlayerName('player1')).not.toBe(getPlayerName('player2'));
  });
});
