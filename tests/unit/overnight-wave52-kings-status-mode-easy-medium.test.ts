/**
 * Wave 52 — Kings Easy/Medium mode label leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';
import { renderStatus } from '../../src/games/kings-quadraphages/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 52 kings — Easy/Medium mode', () => {
  it('shows vs Computer (Easy) and vs Computer (Medium)', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    renderStatus(createInitialGameState(), el, 'human-vs-ai', 'easy', false);
    expect(el.querySelector('.status-mode')?.textContent).toBe('vs Computer (Easy)');
    renderStatus(createInitialGameState(), el, 'human-vs-ai', 'medium', false);
    expect(el.querySelector('.status-mode')?.textContent).toBe(
      'vs Computer (Medium)'
    );
  });
});
