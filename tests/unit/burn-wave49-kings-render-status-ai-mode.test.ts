/**
 * Wave 49 leftover after #221/#226/#227 — Kings renderStatus AI mode chrome. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';
import { renderStatus } from '../../src/games/kings-quadraphages/board-ui';

describe('Wave 49 kings — status AI mode', () => {
  it('shows vs AI difficulty and You/AI supply labels', () => {
    const container = document.createElement('div');
    renderStatus(createInitialGameState(), container, 'human-vs-ai', 'hard');
    expect(container.querySelector('.status-mode')?.textContent).toMatch(/vs AI \(Hard\)/);
    expect(container.textContent).toMatch(/You/);
    expect(container.textContent).toMatch(/AI/);
  });
});
