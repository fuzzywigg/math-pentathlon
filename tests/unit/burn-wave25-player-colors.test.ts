/**
 * Wave 25 — player-colors chrome: CSS var reads, colorForSeat, root helpers, flips.
 * Deepens beyond player-colors.test.ts seatIcon smoke. Distinct from wave 24 inventory.
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

let app: HTMLElement;

beforeEach(() => {
  app = document.createElement('div');
  app.id = 'app';
  document.body.appendChild(app);
  document.documentElement.style.removeProperty('--color-player1');
  document.documentElement.style.removeProperty('--color-player2');
  document.documentElement.style.removeProperty('--color-ai');
});

afterEach(() => {
  clearGameModeChrome(app);
  app.remove();
  document.documentElement.style.removeProperty('--color-player1');
  document.documentElement.style.removeProperty('--color-player2');
  document.documentElement.style.removeProperty('--color-ai');
});

describe('Wave 25 player-colors — root helpers', () => {
  it('getGameModeChromeRoot prefers explicit root then #app', () => {
    const other = document.createElement('div');
    expect(getGameModeChromeRoot(other)).toBe(other);
    expect(getGameModeChromeRoot()).toBe(app);
    expect(getGameModeChromeRoot(null)).toBe(app);
  });

  it('getGameModeChromeRoot returns null when #app missing', () => {
    app.remove();
    expect(getGameModeChromeRoot()).toBeNull();
    document.body.appendChild(app);
  });
});

describe('Wave 25 player-colors — colorForSeat + CSS vars', () => {
  it('colorForSeat mirrors getPlayerSeatColors for both seats', () => {
    applyGameModeChrome(app, 'human-vs-human');
    expect(colorForSeat('player1')).toBe(getPlayerSeatColors().player1);
    expect(colorForSeat('player2')).toBe(getPlayerSeatColors().player2);

    applyGameModeChrome(app, 'human-vs-ai');
    expect(colorForSeat('player2', app)).toBe('#8b5cf6');
    expect(colorForSeat('player1', app)).toBe('#3b82f6');
  });

  it('reads CSS custom properties when present', () => {
    document.documentElement.style.setProperty('--color-player1', '#111111');
    document.documentElement.style.setProperty('--color-player2', '#222222');
    document.documentElement.style.setProperty('--color-ai', '#333333');

    applyGameModeChrome(app, 'human-vs-human');
    let colors = getPlayerSeatColors(app);
    expect(colors.player1).toBe('#111111');
    expect(colors.player2).toBe('#222222');

    applyGameModeChrome(app, 'human-vs-ai', 'player2');
    colors = getPlayerSeatColors(app);
    expect(colors.player1).toBe('#111111');
    expect(colors.player2).toBe('#333333');

    applyGameModeChrome(app, 'human-vs-ai', 'player1');
    colors = getPlayerSeatColors(app);
    expect(colors.player1).toBe('#333333');
    expect(colors.player2).toBe('#222222');
  });

  it('clearGameModeChrome restores human seat icons', () => {
    applyGameModeChrome(app, 'human-vs-ai', 'player1');
    expect(seatIcon('player1', app)).toBe('🟣');
    clearGameModeChrome(app);
    expect(app.dataset.opponent).toBeUndefined();
    expect(seatIcon('player1', app)).toBe('🔵');
    expect(seatIcon('player2', app)).toBe('🔴');
  });

  it('explicit root ignores missing #app for AI seat resolution', () => {
    const local = document.createElement('div');
    applyGameModeChrome(local, 'human-vs-ai', 'player1');
    expect(colorForSeat('player1', local)).toBe('#8b5cf6');
    expect(seatIcon('player1', local)).toBe('🟣');
    expect(seatIcon('player2', local)).toBe('🔴');
    clearGameModeChrome(local);
  });

  it('idempotent re-apply of same AI mode keeps dataset stable', () => {
    applyGameModeChrome(app, 'human-vs-ai', 'player2');
    applyGameModeChrome(app, 'human-vs-ai', 'player2');
    expect(app.dataset.opponent).toBe('ai');
    expect(app.dataset.aiSeat).toBe('player2');
    applyGameModeChrome(app, 'human-vs-ai', 'player1');
    expect(app.dataset.aiSeat).toBe('player1');
  });
});
