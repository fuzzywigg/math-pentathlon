/**
 * Wave 59 Contig/SD residual — Contig status aria-live polite. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { initGame } from '../../src/games/contig-60/game-controller';
import { mountPair } from '../helpers/mount-pair';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 59 contig — status aria-live', () => {
  it('marks status container polite on init', () => {
    const { board, status } = mountPair();
    initGame(board, status);
    expect(status.getAttribute('aria-live')).toBe('polite');
  });
});
