/**
 * Wave 55 leftover after #250 — Kings exact HvH turn + AI thinking copy. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';
import { renderStatus } from '../../src/games/kings-quadraphages/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 55 kings — exact status turn', () => {
  it('opening HvH and robot thinking strings', () => {
    const el = document.createElement('div');
    renderStatus(createInitialGameState(), el, 'human-vs-human');
    expect(el.querySelector('.status-turn')?.textContent).toBe(
      'Player 1: Click your King to select it'
    );
    renderStatus(createInitialGameState(), el, 'human-vs-ai', 'easy', true);
    expect(el.querySelector('.status-turn')?.textContent).toBe('🤖 AI is thinking...');
  });
});
