/**
 * Wave 24 — player-colors chrome helpers (colorForSeat, root resolution, CSS vars).
 * Deepens beyond player-colors.test.ts seatIcon / apply chrome basics.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import {
  applyGameModeChrome,
  clearGameModeChrome,
  getGameModeChromeRoot,
  getPlayerSeatColors,
  colorForSeat,
  seatIcon,
} from '../../src/ui/player-colors';

describe('Wave 24 player-chrome — root / clear / colorForSeat', () => {
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

  it('getGameModeChromeRoot prefers explicit root then #app', () => {
    const other = document.createElement('div');
    expect(getGameModeChromeRoot(other)).toBe(other);
    expect(getGameModeChromeRoot()).toBe(app);
    expect(getGameModeChromeRoot(null)).toBe(app);
  });

  it('clearGameModeChrome strips opponent dataset and class', () => {
    applyGameModeChrome(app, 'human-vs-ai', 'player1');
    expect(app.dataset.opponent).toBe('ai');
    expect(app.dataset.aiSeat).toBe('player1');
    clearGameModeChrome(app);
    expect(app.dataset.opponent).toBeUndefined();
    expect(app.dataset.aiSeat).toBeUndefined();
    expect(app.classList.contains('game-vs-ai')).toBe(false);
  });

  it('colorForSeat mirrors getPlayerSeatColors for each seat', () => {
    applyGameModeChrome(app, 'human-vs-human');
    expect(colorForSeat('player1')).toBe(getPlayerSeatColors().player1);
    expect(colorForSeat('player2')).toBe(getPlayerSeatColors().player2);

    applyGameModeChrome(app, 'human-vs-ai');
    expect(colorForSeat('player2', app)).toBe('#8b5cf6');
    expect(colorForSeat('player1', app)).toBe('#3b82f6');
  });

  it('reads CSS custom properties when present on documentElement', () => {
    document.documentElement.style.setProperty('--color-player1', '#111111');
    document.documentElement.style.setProperty('--color-player2', '#222222');
    document.documentElement.style.setProperty('--color-ai', '#333333');

    applyGameModeChrome(app, 'human-vs-human');
    const human = getPlayerSeatColors(app);
    expect(human.player1).toBe('#111111');
    expect(human.player2).toBe('#222222');

    applyGameModeChrome(app, 'human-vs-ai', 'player2');
    const ai = getPlayerSeatColors(app);
    expect(ai.player1).toBe('#111111');
    expect(ai.player2).toBe('#333333');
  });

  it('seatIcon with explicit root ignores document #app when root has no AI', () => {
    applyGameModeChrome(app, 'human-vs-ai');
    const local = document.createElement('div');
    applyGameModeChrome(local, 'human-vs-human');
    expect(seatIcon('player2', local)).toBe('🔴');
    expect(seatIcon('player2', app)).toBe('🟣');
    clearGameModeChrome(local);
  });
});
