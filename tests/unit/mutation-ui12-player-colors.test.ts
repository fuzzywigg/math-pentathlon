/**
 * q-mp-373 mutation audit UI wave 12 — player-colors structural re-pins.
 * Separate from characterization q-mp-376. No player-facing copy asserts.
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  applyGameModeChrome,
  clearGameModeChrome,
  colorForSeat,
  getGameModeChromeRoot,
  getPlayerSeatColors,
  seatIcon,
  syncAppOpponentChrome,
} from '../../src/ui/player-colors';

describe('mutation-ui12 player-colors', () => {
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

  it('getGameModeChromeRoot prefers explicit root over #app', () => {
    const other = document.createElement('div');
    expect(getGameModeChromeRoot(other)).toBe(other);
    expect(getGameModeChromeRoot(null)).toBe(app);
    expect(getGameModeChromeRoot(undefined)).toBe(app);
  });

  it('getGameModeChromeRoot returns null when #app is missing', () => {
    app.remove();
    expect(getGameModeChromeRoot(null)).toBeNull();
    expect(getGameModeChromeRoot()).toBeNull();
    document.body.appendChild(app);
  });

  it('syncAppOpponentChrome no-ops without #app (kills L77 remove !)', () => {
    app.remove();
    syncAppOpponentChrome(true, 'player1');
    // Re-attach a fresh #app — must stay clean (no chrome stamped on detached node).
    const fresh = document.createElement('div');
    fresh.id = 'app';
    document.body.appendChild(fresh);
    expect(fresh.dataset.opponent).toBeUndefined();
    expect(fresh.classList.contains('game-vs-ai')).toBe(false);
    fresh.remove();
    document.body.appendChild(app);
  });

  it('syncAppOpponentChrome accepts GameModeChrome string modes', () => {
    syncAppOpponentChrome('human-vs-ai', 'player1');
    expect(app.dataset.opponent).toBe('ai');
    expect(app.dataset.aiSeat).toBe('player1');
    expect(app.classList.contains('game-vs-ai')).toBe(true);

    syncAppOpponentChrome('human-vs-human');
    expect(app.dataset.opponent).toBeUndefined();
    expect(app.dataset.aiSeat).toBeUndefined();
    expect(app.classList.contains('game-vs-ai')).toBe(false);
  });

  it('clearGameModeChrome strips opponent chrome completely', () => {
    applyGameModeChrome(app, 'human-vs-ai', 'player1');
    clearGameModeChrome(app);
    expect(app.dataset.opponent).toBeUndefined();
    expect(app.dataset.aiSeat).toBeUndefined();
    expect(app.classList.contains('game-vs-ai')).toBe(false);
  });

  it('whitespace-only CSS vars fall back (kills L25 ||→&&)', () => {
    document.documentElement.style.setProperty('--color-player1', '   ');
    document.documentElement.style.setProperty('--color-player2', '\t');
    document.documentElement.style.setProperty('--color-ai', ' ');
    applyGameModeChrome(app, 'human-vs-human');
    const colors = getPlayerSeatColors(app);
    expect(colors.player1).toBe('#3b82f6');
    expect(colors.player2).toBe('#ef4444');
  });

  it('colorForSeat selects seat channel (kills L134 === flip)', () => {
    applyGameModeChrome(app, 'human-vs-human');
    expect(colorForSeat('player1', app)).toBe('#3b82f6');
    expect(colorForSeat('player2', app)).toBe('#ef4444');
    applyGameModeChrome(app, 'human-vs-ai', 'player2');
    expect(colorForSeat('player2', app)).toBe('#8b5cf6');
    expect(colorForSeat('player1', app)).toBe('#3b82f6');
  });

  it('seatIcon AI gate requires opponent=ai AND matching seat (kills L141 &&→||)', () => {
    applyGameModeChrome(app, 'human-vs-human');
    app.dataset.aiSeat = 'player2';
    // Human mode must ignore aiSeat residue.
    expect(seatIcon('player2', app)).toBe('🔴');
    expect(seatIcon('player1', app)).toBe('🔵');

    applyGameModeChrome(app, 'human-vs-ai', 'player2');
    expect(seatIcon('player2', app)).toBe('🟣');
    expect(seatIcon('player1', app)).toBe('🔵');
  });

  it('human-vs-ai default aiSeat is player2 (kills L38 mode === flip)', () => {
    applyGameModeChrome(app, 'human-vs-ai');
    expect(app.dataset.opponent).toBe('ai');
    expect(app.dataset.aiSeat).toBe('player2');
    const colors = getPlayerSeatColors(app);
    expect(colors.player2).toBe('#8b5cf6');
    expect(colors.player2Light).toBe('#ddd6fe');
    expect(colors.player1).toBe('#3b82f6');
    expect(colors.player1Light).toBe('#bbdefb');
  });
});
