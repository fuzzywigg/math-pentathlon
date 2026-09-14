/**
 * Wave 49 — Kings status-mode Hard exact leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';
import { renderStatus } from '../../src/games/kings-quadraphages/board-ui';

afterEach(() => { document.body.innerHTML = ''; });

describe('Wave 49 kings — status mode hard', () => {
  it('renders exact vs AI (Hard) mode chrome', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    renderStatus(createInitialGameState(), el, 'human-vs-ai', 'hard', false);
    expect(el.querySelector('.status-mode')?.textContent).toBe('vs AI (Hard)');
  });
});
