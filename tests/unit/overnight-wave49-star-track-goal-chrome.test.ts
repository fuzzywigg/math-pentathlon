/**
 * Wave 49 — Star Track renderBoard goal chrome leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/star-track/types';
import { renderBoard } from '../../src/games/star-track/board-ui';

afterEach(() => { document.body.innerHTML = ''; });

describe('Wave 49 star-track — goal chrome', () => {
  it('mounts star-track-goal circle and label', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    renderBoard(createInitialState(), container);
    expect(container.querySelector('.star-track-goal')).toBeTruthy();
    expect(container.querySelector('.star-track-goal-label')?.textContent).toBe('★');
  });
});
