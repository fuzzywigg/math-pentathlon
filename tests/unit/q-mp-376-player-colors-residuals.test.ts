/**
 * q-mp-376 — Characterize player-colors residuals (override / seat / missing
 * css-var / chrome-root soft paths). Tests only. Structural asserts on
 * dataset, classList, hex tokens, and seat icons. No player-facing copy pins.
 * Orthogonal to mutation wave 12 (q-mp-373) — own file; no shared fixtures.
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

const FALLBACK = {
  player1: '#3b82f6',
  player2: '#ef4444',
  ai: '#8b5cf6',
  player1Light: '#bbdefb',
  player2Light: '#ffcdd2',
  aiLight: '#ddd6fe',
} as const;

function clearRootColorVars(): void {
  document.documentElement.style.removeProperty('--color-player1');
  document.documentElement.style.removeProperty('--color-player2');
  document.documentElement.style.removeProperty('--color-ai');
}

describe('q-mp-376 player-colors residuals', () => {
  let app: HTMLElement;

  beforeEach(() => {
    app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    clearRootColorVars();
  });

  afterEach(() => {
    clearGameModeChrome(app);
    app.remove();
    clearRootColorVars();
    document.getElementById('app')?.remove();
  });

  describe('missing / empty / whitespace CSS vars → fallbacks', () => {
    it('unset root vars resolve to hard-coded fallbacks in human mode', () => {
      applyGameModeChrome(app, 'human-vs-human');
      const colors = getPlayerSeatColors(app);
      expect(colors).toEqual({
        player1: FALLBACK.player1,
        player2: FALLBACK.player2,
        player1Light: FALLBACK.player1Light,
        player2Light: FALLBACK.player2Light,
      });
      expect(colorForSeat('player1', app)).toBe(FALLBACK.player1);
      expect(colorForSeat('player2', app)).toBe(FALLBACK.player2);
    });

    it('empty-string CSS vars fall back (value || fallback)', () => {
      document.documentElement.style.setProperty('--color-player1', '');
      document.documentElement.style.setProperty('--color-player2', '');
      document.documentElement.style.setProperty('--color-ai', '');
      applyGameModeChrome(app, 'human-vs-ai', 'player2');
      const colors = getPlayerSeatColors(app);
      expect(colors.player1).toBe(FALLBACK.player1);
      expect(colors.player2).toBe(FALLBACK.ai);
      expect(colors.player2Light).toBe(FALLBACK.aiLight);
    });

    it('whitespace-only CSS vars trim to empty and fall back', () => {
      document.documentElement.style.setProperty('--color-player1', '   ');
      document.documentElement.style.setProperty('--color-player2', '\t');
      document.documentElement.style.setProperty('--color-ai', ' \n ');
      applyGameModeChrome(app, 'human-vs-ai', 'player1');
      const colors = getPlayerSeatColors(app);
      expect(colors.player1).toBe(FALLBACK.ai);
      expect(colors.player2).toBe(FALLBACK.player2);
      expect(colors.player1Light).toBe(FALLBACK.aiLight);
    });

    it('partial override keeps unset seats on fallbacks', () => {
      document.documentElement.style.setProperty('--color-player1', '#010101');
      // --color-player2 / --color-ai intentionally unset
      applyGameModeChrome(app, 'human-vs-ai', 'player2');
      const colors = getPlayerSeatColors(app);
      expect(colors.player1).toBe('#010101');
      expect(colors.player2).toBe(FALLBACK.ai);
      expect(colors.player1Light).toBe(FALLBACK.player1Light);
      expect(colors.player2Light).toBe(FALLBACK.aiLight);
    });

    it('light tokens ignore CSS overrides (base only is overridable)', () => {
      document.documentElement.style.setProperty('--color-player1', '#aaaaaa');
      document.documentElement.style.setProperty('--color-player2', '#bbbbbb');
      document.documentElement.style.setProperty('--color-ai', '#cccccc');
      applyGameModeChrome(app, 'human-vs-human');
      const human = getPlayerSeatColors(app);
      expect(human.player1).toBe('#aaaaaa');
      expect(human.player2).toBe('#bbbbbb');
      expect(human.player1Light).toBe(FALLBACK.player1Light);
      expect(human.player2Light).toBe(FALLBACK.player2Light);

      applyGameModeChrome(app, 'human-vs-ai', 'player1');
      const ai = getPlayerSeatColors(app);
      expect(ai.player1).toBe('#cccccc');
      expect(ai.player1Light).toBe(FALLBACK.aiLight);
      expect(ai.player2Light).toBe(FALLBACK.player2Light);
    });
  });

  describe('seat chrome residuals', () => {
    it('AI chrome without aiSeat dataset defaults seat to player2', () => {
      app.dataset.opponent = 'ai';
      delete app.dataset.aiSeat;
      app.classList.add('game-vs-ai');
      const colors = getPlayerSeatColors(app);
      expect(colors.player1).toBe(FALLBACK.player1);
      expect(colors.player2).toBe(FALLBACK.ai);
      expect(seatIcon('player2', app)).toBe('🟣');
      expect(seatIcon('player1', app)).toBe('🔵');
      expect(colorForSeat('player2', app)).toBe(FALLBACK.ai);
    });

    it('non-ai opponent dataset is ignored (human blue/red)', () => {
      app.dataset.opponent = 'human';
      app.dataset.aiSeat = 'player1';
      app.classList.add('game-vs-ai');
      const colors = getPlayerSeatColors(app);
      expect(colors.player1).toBe(FALLBACK.player1);
      expect(colors.player2).toBe(FALLBACK.player2);
      expect(seatIcon('player1', app)).toBe('🔵');
      expect(seatIcon('player2', app)).toBe('🔴');
    });

    it('explicit detached root drives seat paint independent of #app', () => {
      applyGameModeChrome(app, 'human-vs-ai', 'player2');
      const local = document.createElement('div');
      applyGameModeChrome(local, 'human-vs-ai', 'player1');
      expect(getGameModeChromeRoot(local)).toBe(local);
      expect(getPlayerSeatColors(local).player1).toBe(FALLBACK.ai);
      expect(getPlayerSeatColors(app).player2).toBe(FALLBACK.ai);
      expect(colorForSeat('player1', local)).toBe(FALLBACK.ai);
      expect(colorForSeat('player2', app)).toBe(FALLBACK.ai);
      expect(seatIcon('player1', local)).toBe('🟣');
      expect(seatIcon('player2', app)).toBe('🟣');
      clearGameModeChrome(local);
    });

    it('syncAppOpponentChrome mode string + aiSeat stamps Kings flip', () => {
      syncAppOpponentChrome('human-vs-ai', 'player1');
      expect(app.dataset.opponent).toBe('ai');
      expect(app.dataset.aiSeat).toBe('player1');
      expect(app.classList.contains('game-vs-ai')).toBe(true);
      expect(getPlayerSeatColors().player1).toBe(FALLBACK.ai);
      expect(seatIcon('player1')).toBe('🟣');

      syncAppOpponentChrome('human-vs-human');
      expect(app.dataset.opponent).toBeUndefined();
      expect(app.dataset.aiSeat).toBeUndefined();
      expect(app.classList.contains('game-vs-ai')).toBe(false);
    });

    it('syncAppOpponentChrome(true, player1) mirrors apply chrome', () => {
      syncAppOpponentChrome(true, 'player1');
      expect(app.dataset.aiSeat).toBe('player1');
      expect(colorForSeat('player1')).toBe(FALLBACK.ai);
      expect(colorForSeat('player2')).toBe(FALLBACK.player2);
    });
  });

  describe('chrome-root soft paths', () => {
    it('getGameModeChromeRoot / syncAppOpponentChrome no-op without #app', () => {
      app.remove();
      expect(getGameModeChromeRoot()).toBeNull();
      expect(getGameModeChromeRoot(null)).toBeNull();
      // Must not throw when shell is absent.
      syncAppOpponentChrome(true, 'player1');
      syncAppOpponentChrome('human-vs-ai', 'player2');
      expect(document.getElementById('app')).toBeNull();
    });

    it('getPlayerSeatColors without root or #app uses human fallbacks', () => {
      app.remove();
      const colors = getPlayerSeatColors();
      expect(colors.player1).toBe(FALLBACK.player1);
      expect(colors.player2).toBe(FALLBACK.player2);
      expect(seatIcon('player1')).toBe('🔵');
      expect(seatIcon('player2')).toBe('🔴');
    });

    it('SSR-style document undefined → fallbacks / null root', () => {
      const saved = globalThis.document;
      // Reach typeof document === 'undefined' arms (lines 19–20, 62–63).
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete -- intentional SSR probe
      delete (globalThis as { document?: Document }).document;
      try {
        expect(getGameModeChromeRoot()).toBeNull();
        expect(getGameModeChromeRoot(null)).toBeNull();
        const colors = getPlayerSeatColors(null);
        expect(colors.player1).toBe(FALLBACK.player1);
        expect(colors.player2).toBe(FALLBACK.player2);
        expect(colors.player1Light).toBe(FALLBACK.player1Light);
        expect(colors.player2Light).toBe(FALLBACK.player2Light);
        expect(colorForSeat('player1', null)).toBe(FALLBACK.player1);
        expect(seatIcon('player2', null)).toBe('🔴');
      } finally {
        globalThis.document = saved;
      }
    });
  });
});
