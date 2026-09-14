/**
 * Wave 42 — player-colors CSS var fallback leftovers.
 * Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import {
  applyGameModeChrome,
  clearGameModeChrome,
  colorForSeat,
  getPlayerSeatColors,
  seatIcon,
  getGameModeChromeRoot,
} from '../../src/ui/player-colors';

describe('Wave 42 player-colors — css fallback', () => {
  let root: HTMLElement;

  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
    root = document.getElementById('app')!;
    // Clear any CSS vars so fallbacks apply
    document.documentElement.style.removeProperty('--color-player1');
    document.documentElement.style.removeProperty('--color-player2');
    document.documentElement.style.removeProperty('--color-ai');
  });

  afterEach(() => {
    clearGameModeChrome(root);
    document.body.innerHTML = '';
  });

  it('2P fallbacks are blue / red hex', () => {
    clearGameModeChrome(root);
    expect(colorForSeat('player1', root)).toBe('#3b82f6');
    expect(colorForSeat('player2', root)).toBe('#ef4444');
  });

  it('vs-AI default seat paints player2 purple fallback', () => {
    applyGameModeChrome(root, 'human-vs-ai', 'player2');
    expect(colorForSeat('player2', root)).toBe('#8b5cf6');
    expect(seatIcon('player2', root)).toBe('🟣');
    expect(seatIcon('player1', root)).toBe('🔵');
  });

  it('AI seat flip paints player1 purple', () => {
    applyGameModeChrome(root, 'human-vs-ai', 'player1');
    expect(colorForSeat('player1', root)).toBe('#8b5cf6');
    expect(seatIcon('player1', root)).toBe('🟣');
  });

  it('getGameModeChromeRoot falls back to #app', () => {
    expect(getGameModeChromeRoot()).toBe(root);
    expect(getGameModeChromeRoot(root)).toBe(root);
  });

  it('custom CSS var overrides fallback when set', () => {
    document.documentElement.style.setProperty('--color-player1', '#112233');
    clearGameModeChrome(root);
    expect(getPlayerSeatColors(root).player1).toBe('#112233');
    document.documentElement.style.removeProperty('--color-player1');
  });
});
