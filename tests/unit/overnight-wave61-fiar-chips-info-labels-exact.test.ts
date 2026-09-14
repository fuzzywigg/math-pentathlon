/**
 * Overnight TOKENMAXX HEAVY leftovers after #285 — FIAR chips-info labels exact.
 * Deepen Blue/Red chip count text leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { initGame } from '../../src/games/fiar/game-controller';
import { CONFIG } from '../../src/games/fiar/types';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('fiar-styles')?.remove();
});

describe('Wave 61 fiar — chips-info labels exact', () => {
  it('opening chip counts are exact Blue/Red 0/N', () => {
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    const counts = [...status.querySelectorAll('.fiar-chip-count')].map((n) =>
      n.textContent?.replace(/\s+/g, ' ').trim()
    );
    expect(counts).toEqual([
      `Blue: 0/${CONFIG.CHIPS_PER_PLAYER}`,
      `Red: 0/${CONFIG.CHIPS_PER_PLAYER}`,
    ]);
  });
});
