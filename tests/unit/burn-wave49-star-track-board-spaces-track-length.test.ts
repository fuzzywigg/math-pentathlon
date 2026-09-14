/**
 * Wave 49 — Star-track spaces 0..TRACK_LENGTH per path. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, TRACK_LENGTH } from '../../src/games/star-track/types';
import { renderBoard } from '../../src/games/star-track/board-ui';

describe('Wave 49 star-track — space markers', () => {
  it('p1 path has TRACK_LENGTH+1 spaces', () => {
    const box = document.createElement('div');
    renderBoard(createInitialState(), box);
    const spaces = box.querySelectorAll('.star-track-path-p1 [data-space]');
    expect(spaces.length).toBe(TRACK_LENGTH + 1);
    expect(spaces[0]?.getAttribute('data-space')).toBe('0');
    expect(spaces[spaces.length - 1]?.getAttribute('data-space')).toBe(String(TRACK_LENGTH));
  });
});
