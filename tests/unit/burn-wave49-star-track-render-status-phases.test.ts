/**
 * Wave 49 leftover after #221/#226/#227 — Star Track renderStatus opening. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/star-track/types';
import { renderStatus } from '../../src/games/star-track/board-ui';

describe('Wave 49 star-track — renderStatus', () => {
  it('shows progress bars at 0 for both seats', () => {
    const container = document.createElement('div');
    renderStatus(createInitialState(), container);
    expect(container.querySelector('.star-track-status')).toBeTruthy();
    expect(container.querySelectorAll('.progress-bar')).toHaveLength(2);
    expect(container.textContent).toMatch(/0\//);
  });
});
