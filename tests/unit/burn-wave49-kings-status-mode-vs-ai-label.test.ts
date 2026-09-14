/**
 * Wave 49 — Kings status mode vs AI label. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';
import { renderStatus } from '../../src/games/kings-quadraphages/board-ui';

describe('Wave 49 kings — status mode', () => {
  it('shows vs AI Medium', () => {
    const box = document.createElement('div');
    renderStatus(createInitialGameState(), box, 'human-vs-ai', 'medium');
    expect(box.querySelector('.status-mode')?.textContent).toBe('vs AI (Medium)');
  });
});
