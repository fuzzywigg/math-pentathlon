/**
 * Wave 52 — Star Track rays count leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/star-track/types';
import { renderBoard } from '../../src/games/star-track/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 52 star-track — rays', () => {
  it('draws exactly 5 star-track-ray lines', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    renderBoard(createInitialState(), container);
    expect(container.querySelectorAll('.star-track-ray').length).toBe(5);
  });
});
