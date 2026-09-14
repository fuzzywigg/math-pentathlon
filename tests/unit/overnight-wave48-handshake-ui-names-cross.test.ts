/**
 * Wave 48 overnight handshake — UI getPlayerName cross leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getPlayerName as ramrodName } from '../../src/games/ramrod/board-ui';
import { getPlayerName as juggleName } from '../../src/games/juggle/board-ui';

describe('Wave 48 handshake overnight — UI names', () => {
  it('Blue/Red labels consistent across ramrod+juggle', () => {
    expect(ramrodName('player1')).toBe('Blue');
    expect(ramrodName('player2')).toBe('Red');
    expect(juggleName('player1')).toBe('Blue');
    expect(juggleName('player2')).toBe('Red');
  });
});
