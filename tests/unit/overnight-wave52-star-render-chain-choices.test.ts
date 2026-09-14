/**
 * Wave 52 — Star Track chain choices leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/star-track/types';
import { drawChains } from '../../src/games/star-track/rules';
import { renderBoard } from '../../src/games/star-track/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 52 star-track — chain choices', () => {
  it('shows Choose a chain label and two chain buttons', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const state = drawChains(createInitialState());
    expect(state.phase).toBe('selectChain');
    renderBoard(state, container, undefined, () => undefined);
    expect(container.querySelector('.star-track-choice-label')?.textContent).toBe(
      'Choose a chain:'
    );
    expect(container.querySelectorAll('.star-track-chain-btn').length).toBe(2);
    expect(container.querySelectorAll('.chain-length').length).toBe(2);
  });
});
