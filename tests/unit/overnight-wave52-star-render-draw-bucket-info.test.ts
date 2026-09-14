/**
 * Wave 52 — Star Track draw/bucket leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/star-track/types';
import { renderBoard } from '../../src/games/star-track/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 52 star-track — draw bucket', () => {
  it('shows Draw Chains btn and bucket chain count', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const state = createInitialState();
    renderBoard(state, container, () => undefined);
    expect(container.querySelector('.star-track-draw-btn')?.textContent).toMatch(
      /Draw Chains/
    );
    expect(container.querySelector('.star-track-bucket-info')?.textContent).toBe(
      `${state.chainBucket.length} chains in bucket`
    );
  });
});
