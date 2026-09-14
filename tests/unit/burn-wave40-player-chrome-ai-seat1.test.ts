/**
 * Wave 40 — player-colors AI seat player1 chrome leftovers.
 * Tests-only after #178.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import {
  applyGameModeChrome,
  getPlayerSeatColors,
  seatIcon,
  clearGameModeChrome,
} from '../../src/ui/player-colors';

describe('Wave 40 player-colors — AI seat1', () => {
  let root: HTMLElement;

  beforeEach(() => {
    root = document.createElement('div');
    root.id = 'app';
    document.body.appendChild(root);
  });

  afterEach(() => {
    clearGameModeChrome(root);
    root.remove();
  });

  it('aiSeat player1 paints P1 purple and seatIcon 🟣', () => {
    applyGameModeChrome(root, 'human-vs-ai', 'player1');
    expect(root.dataset.opponent).toBe('ai');
    expect(root.dataset.aiSeat).toBe('player1');

    const colors = getPlayerSeatColors(root);
    expect(colors.player1).toBe('#8b5cf6');
    expect(colors.player2).toBe('#ef4444');
    expect(seatIcon('player1', root)).toBe('🟣');
    expect(seatIcon('player2', root)).toBe('🔴');
  });

  it('human-vs-human clears AI chrome', () => {
    applyGameModeChrome(root, 'human-vs-ai', 'player1');
    applyGameModeChrome(root, 'human-vs-human');
    expect(root.dataset.opponent).toBeUndefined();
    expect(seatIcon('player1', root)).toBe('🔵');
  });
});
