/**
 * Wave 43 — Contig CONFIG alignment/pass constants leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { CONFIG, createInitialState, BOARD_NUMBERS } from '../../src/games/contig-60/types';
import { getPlayerName } from '../../src/games/contig-60/board-ui';

describe('Wave 43 contig — config + ui', () => {
  it('WIN_BY_ALIGNMENT 5; MAX passes 3; board 6x10; names', () => {
    expect(CONFIG.WIN_BY_ALIGNMENT).toBe(5);
    expect(CONFIG.MAX_CONSECUTIVE_PASSES).toBe(3);
    expect(BOARD_NUMBERS).toHaveLength(6);
    expect(BOARD_NUMBERS[0]).toHaveLength(10);
    expect(createInitialState().cells.size).toBe(60);
    expect(getPlayerName('player1')).toBe('Blue');
    expect(getPlayerName('player2')).toBe('Red');
  });
});
