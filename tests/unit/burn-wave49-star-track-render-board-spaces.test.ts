/**
 * Wave 49 leftover after #221/#226/#227 — Star Track renderBoard spaces/goal. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/star-track/types';
import { renderBoard } from '../../src/games/star-track/board-ui';

describe('Wave 49 star-track — renderBoard', () => {
  it('renders svg with goal and track paths', () => {
    const container = document.createElement('div');
    renderBoard(createInitialState(), container);
    expect(container.querySelector('.star-track-wrapper')).toBeTruthy();
    expect(container.querySelector('.star-track-goal')).toBeTruthy();
    expect(
      container.querySelector('.star-track-paths') ||
        container.querySelector('.star-track-pieces')
    ).toBeTruthy();
  });
});
