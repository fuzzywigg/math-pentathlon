/**
 * Wave 49 — Star-track goal circle + star label. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/star-track/types';
import { renderBoard } from '../../src/games/star-track/board-ui';

describe('Wave 49 star-track — goal', () => {
  it('shows goal class and star glyph', () => {
    const box = document.createElement('div');
    renderBoard(createInitialState(), box);
    expect(box.querySelector('.star-track-goal')).toBeTruthy();
    expect(box.querySelector('.star-track-goal-label')?.textContent).toBe('★');
  });
});
