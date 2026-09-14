/**
 * Wave 40 — player-colors chrome + stats format leftovers after #176.
 * Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';

import {
  applyGameModeChrome,
  clearGameModeChrome,
  colorForSeat,
  seatIcon,
} from '../../src/ui/player-colors';
import {
  formatPlayTime,
  formatWinRate,
  formatLastPlayed,
} from '../../src/ui/stats-dashboard';

describe('Wave 40 UI — chrome / stats format', () => {
  let root: HTMLElement;

  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
    root = document.getElementById('app')!;
  });

  it('AI seat flips color/icon; clear removes chrome', () => {
    applyGameModeChrome(root, 'human-vs-ai', 'player1');
    expect(root.dataset.opponent).toBe('ai');
    expect(root.dataset.aiSeat).toBe('player1');
    expect(seatIcon('player1', root)).toBe('🟣');
    expect(colorForSeat('player1', root)).toBeTruthy();
    clearGameModeChrome(root);
    expect(root.dataset.opponent).toBeUndefined();
    expect(seatIcon('player1', root)).toBe('🔵');
  });

  it('formatPlayTime / winRate / lastPlayed edges', () => {
    expect(formatPlayTime(0)).toBe('0 min');
    expect(formatPlayTime(30 * 60_000)).toBe('30 min');
    expect(formatPlayTime(120 * 60_000)).toBe('2h');
    expect(formatPlayTime(90 * 60_000)).toBe('1h 30m');
    expect(formatWinRate(NaN)).toBe('0%');
    expect(formatWinRate(0.5)).toBe('50%');
    expect(formatLastPlayed(0)).toBe('—');
    expect(formatLastPlayed(Date.UTC(2026, 0, 2))).not.toBe('—');
  });
});
