/**
 * Wave 40 — player-colors aiSeat=player1 chrome / seatIcon.
 * Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import {
  applyGameModeChrome,
  clearGameModeChrome,
  getPlayerSeatColors,
  seatIcon,
} from '../../src/ui/player-colors';

describe('Wave 40 player-chrome — aiSeat player1', () => {
  let app: HTMLElement;

  beforeEach(() => {
    app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
  });

  afterEach(() => {
    clearGameModeChrome(app);
    app.remove();
    document.documentElement.style.removeProperty('--color-player1');
    document.documentElement.style.removeProperty('--color-player2');
    document.documentElement.style.removeProperty('--color-ai');
  });

  it('applyGameModeChrome aiSeat player1 stamps dataset and AI purple on P1', () => {
    applyGameModeChrome(app, 'human-vs-ai', 'player1');
    expect(app.dataset.opponent).toBe('ai');
    expect(app.dataset.aiSeat).toBe('player1');
    expect(app.classList.contains('game-vs-ai')).toBe(true);

    const colors = getPlayerSeatColors(app);
    expect(colors.player1).toBe('#8b5cf6');
    expect(colors.player2).toBe('#ef4444');
    expect(colors.player1Light).toBe('#ddd6fe');
    expect(colors.player2Light).toBe('#ffcdd2');
  });

  it('seatIcon player1 is purple when aiSeat is player1', () => {
    applyGameModeChrome(app, 'human-vs-ai', 'player1');
    expect(seatIcon('player1', app)).toBe('🟣');
    expect(seatIcon('player2', app)).toBe('🔴');
  });
});
