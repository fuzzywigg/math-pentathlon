/**
 * Wave 43 — juggle getPlayerName leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getPlayerName } from '../../src/games/juggle/board-ui';

describe('Wave 43 juggle — board-ui names', () => {
  it('maps seats to Blue/Red', () => {
    expect(getPlayerName('player1')).toMatch(/blue/i);
    expect(getPlayerName('player2')).toMatch(/red/i);
  });
});
