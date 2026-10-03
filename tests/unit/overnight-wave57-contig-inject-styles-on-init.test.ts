/**
 * Wave 57 leftover after #267 — Contig inject styles via initGame. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { initGame } from '../../src/games/contig-60/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 57 contig — inject on init', () => {
  it('mounts #contig-styles when initGame runs', () => {
    expect(document.getElementById('contig-styles')).toBeNull();
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    expect(document.getElementById('contig-styles')).toBeTruthy();
  });
});
