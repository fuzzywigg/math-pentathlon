/**
 * Wave 52 — Star Track space start/end markers leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState, TRACK_LENGTH } from '../../src/games/star-track/types';
import { renderBoard } from '../../src/games/star-track/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 52 star-track — space markers', () => {
  it('marks start/end spaces and mid labels every 3', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    renderBoard(createInitialState(), container);
    expect(
      container.querySelectorAll('.star-track-start[data-space="0"]').length
    ).toBe(2);
    expect(
      container.querySelectorAll(
        `.star-track-end[data-space="${TRACK_LENGTH}"]`
      ).length
    ).toBe(2);
    expect(
      container.querySelectorAll('.star-track-space-label').length
    ).toBeGreaterThan(0);
  });
});
