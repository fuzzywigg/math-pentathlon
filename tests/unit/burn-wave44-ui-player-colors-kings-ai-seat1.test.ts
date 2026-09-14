/**
 * Wave 44 overnight HEAVY — Kings-style AI seat player1 chrome.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  applyGameModeChrome,
  clearGameModeChrome,
  getPlayerSeatColors,
  seatIcon,
  colorForSeat,
} from '../../src/ui/player-colors';

describe('Wave 44 UI — AI seat player1', () => {
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

  it('paints P1 purple when AI sits first', () => {
    applyGameModeChrome(app, 'human-vs-ai', 'player1');
    expect(app.dataset.aiSeat).toBe('player1');
    expect(seatIcon('player1', app)).toBe('🟣');
    expect(seatIcon('player2', app)).toBe('🔴');
    const c = getPlayerSeatColors(app);
    expect(c.player1).toBe('#8b5cf6');
    expect(c.player2).toBe('#ef4444');
    expect(colorForSeat('player1', app)).toBe('#8b5cf6');
  });
});
