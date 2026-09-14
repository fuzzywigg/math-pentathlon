/**
 * Wave 52 — Star Track progress-fill width leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState, TRACK_LENGTH } from '../../src/games/star-track/types';
import { getProgress } from '../../src/games/star-track/rules';
import { renderStatus } from '../../src/games/star-track/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 52 star-track — progress-fill width', () => {
  it('sets progress-fill style width from getProgress', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const state = {
      ...createInitialState(),
      player1Position: Math.floor(TRACK_LENGTH / 2),
    };
    renderStatus(state, el);
    const fill = el.querySelector('.progress-p1 .progress-fill') as HTMLElement;
    expect(fill.getAttribute('style')).toContain(
      `width: ${getProgress(state, 'player1')}%`
    );
  });
});
