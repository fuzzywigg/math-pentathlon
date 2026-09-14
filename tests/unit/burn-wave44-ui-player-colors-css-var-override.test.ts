/**
 * Wave 44 overnight HEAVY — player-colors CSS var override leftovers.
 * Distinct from demos (#202) and wave43 engines (#203). Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  applyGameModeChrome,
  clearGameModeChrome,
  getPlayerSeatColors,
  colorForSeat,
} from '../../src/ui/player-colors';

describe('Wave 44 UI — player-colors CSS vars', () => {
  let app: HTMLElement;

  beforeEach(() => {
    app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    document.documentElement.style.setProperty('--color-player1', '#111111');
    document.documentElement.style.setProperty('--color-player2', '#222222');
    document.documentElement.style.setProperty('--color-ai', '#333333');
  });

  afterEach(() => {
    clearGameModeChrome(app);
    app.remove();
    document.documentElement.style.removeProperty('--color-player1');
    document.documentElement.style.removeProperty('--color-player2');
    document.documentElement.style.removeProperty('--color-ai');
  });

  it('reads custom root vars in human mode', () => {
    applyGameModeChrome(app, 'human-vs-human');
    const c = getPlayerSeatColors(app);
    expect(c.player1).toBe('#111111');
    expect(c.player2).toBe('#222222');
    expect(colorForSeat('player1', app)).toBe('#111111');
  });

  it('AI seat uses --color-ai', () => {
    applyGameModeChrome(app, 'human-vs-ai', 'player2');
    const c = getPlayerSeatColors(app);
    expect(c.player1).toBe('#111111');
    expect(c.player2).toBe('#333333');
  });
});
