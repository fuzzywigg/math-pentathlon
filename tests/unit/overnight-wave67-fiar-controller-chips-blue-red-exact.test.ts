/**
 * Wave 67 leftover after tip/#316 — FIAR chips Blue/Red labels exact.
 * Soft chips-info mount; lock Blue/Red remaining labels leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { initGame } from '../../src/games/fiar/game-controller';
import { CONFIG } from '../../src/games/fiar/types';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('fiar-styles')?.remove();
});

describe('Wave 67 fiar — controller chips Blue Red exact', () => {
  it('opening chips-info shows Blue/Red 0/N labels', () => {
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    const info = status.querySelector('.fiar-chips-info')?.textContent || '';
    expect(info).toContain(`Blue: 0/${CONFIG.CHIPS_PER_PLAYER}`);
    expect(info).toContain(`Red: 0/${CONFIG.CHIPS_PER_PLAYER}`);
  });
});
