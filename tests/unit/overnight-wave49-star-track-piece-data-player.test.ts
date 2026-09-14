/**
 * Wave 49 — Star Track piece data-player leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/star-track/types';
import { renderBoard } from '../../src/games/star-track/board-ui';

afterEach(() => { document.body.innerHTML = ''; });

describe('Wave 49 star-track — piece data-player', () => {
  it('stamps data-player on both seat pieces', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    renderBoard(createInitialState(), container);
    expect(container.querySelector('.star-track-piece-p1')?.getAttribute('data-player')).toBe('player1');
    expect(container.querySelector('.star-track-piece-p2')?.getAttribute('data-player')).toBe('player2');
  });
});
