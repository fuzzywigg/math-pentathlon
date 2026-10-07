/**
 * Wave 52 — Kings AI thinking status leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';
import { renderStatus } from '../../src/games/kings-quadraphages/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 52 kings — AI thinking', () => {
  it('shows Computer is thinking with status-ai-thinking class', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    renderStatus(createInitialGameState(), el, 'human-vs-ai', 'medium', true);
    const turn = el.querySelector('.status-turn.status-ai-thinking');
    expect(turn?.textContent).toMatch(/Computer is thinking/);
  });
});
