/**
 * Wave 41 handshake — FIAR place cycle × player-colors seat chrome.
 * Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';

import { placeChip, canPlaceChip } from '../../src/games/fiar/rules';
import { createInitialState } from '../../src/games/fiar/types';
import {
  applyGameModeChrome,
  clearGameModeChrome,
  colorForSeat,
  seatIcon,
} from '../../src/ui/player-colors';

describe('Wave 41 handshake — fiar × player-colors chrome', () => {
  let root: HTMLElement;

  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
    root = document.getElementById('app')!;
  });

  it('placement seat flip pairs with chrome seat colors', () => {
    let state = createInitialState();
    expect(state.currentPlayer).toBe('player1');
    expect(seatIcon('player1')).toBe('🔵');
    expect(seatIcon('player2')).toBe('🔴');

    applyGameModeChrome(root, 'human-vs-ai', 'player2');
    expect(root.dataset.opponent).toBe('ai');
    expect(colorForSeat('player2', root)).toBeTruthy();

    const id = [...state.board.nodes.keys()][0];
    expect(canPlaceChip(state, id)).toBe(true);
    state = placeChip(state, id);
    expect(state.currentPlayer).toBe('player2');

    clearGameModeChrome(root);
    expect(root.dataset.opponent).toBeUndefined();
    expect(seatIcon('player1', root)).toBe('🔵');
  });
});
