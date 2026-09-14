/**
 * Wave 44 overnight HEAVY — fab × player-colors handshake.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getPlayerName } from '../../src/games/fab-a-diffy/board-ui';
import {
  applyGameModeChrome,
  clearGameModeChrome,
  seatIcon,
} from '../../src/ui/player-colors';

describe('Wave 44 handshake — fab × chrome', () => {
  let app: HTMLElement;
  beforeEach(() => {
    app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
  });
  afterEach(() => {
    clearGameModeChrome(app);
    app.remove();
  });

  it('human chrome icons align with fab seat names', () => {
    applyGameModeChrome(app, 'human-vs-human');
    expect(getPlayerName('player1')).toBe('Blue');
    expect(seatIcon('player1', app)).toBe('🔵');
    expect(getPlayerName('player2')).toBe('Red');
    expect(seatIcon('player2', app)).toBe('🔴');
  });
});
