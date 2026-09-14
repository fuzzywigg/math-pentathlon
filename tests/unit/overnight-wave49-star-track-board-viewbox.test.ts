/**
 * Wave 49 — Star Track SVG viewBox leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/star-track/types';
import { renderBoard } from '../../src/games/star-track/board-ui';

afterEach(() => { document.body.innerHTML = ''; });

describe('Wave 49 star-track — board viewBox', () => {
  it('uses 0 0 400 400 viewBox on board svg', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    renderBoard(createInitialState(), container);
    expect(container.querySelector('svg.star-track-board')?.getAttribute('viewBox')).toBe('0 0 400 400');
  });
});
