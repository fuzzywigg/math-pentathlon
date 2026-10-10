/**
 * Overnight TOKENMAXX HEAVY leftovers after #285 — FIAR placement status exact.
 * Deepen exact Place a chip remaining copy leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { initGame } from '../../src/games/fiar/game-controller';
import { CONFIG } from '../../src/games/fiar/types';
import { mountPair } from '../helpers/mount-pair';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('fiar-styles')?.remove();
});

describe('Wave 61 fiar — status placement exact', () => {
  it('opening placement status is exact with chips remaining', () => {
    const { board, status } = mountPair();
    initGame(board, status);
    expect(status.querySelector('.fiar-status')?.textContent?.trim()).toBe(
      `Blue's turn: Place a chip (${CONFIG.CHIPS_PER_PLAYER} left)`
    );
  });
});
