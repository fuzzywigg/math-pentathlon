/**
 * Wave 49 — Kings status AI thinking. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';
import { renderStatus } from '../../src/games/kings-quadraphages/board-ui';

describe('Wave 49 kings — thinking', () => {
  it('adds thinking class/text', () => {
    const box = document.createElement('div');
    renderStatus(createInitialGameState(), box, 'human-vs-ai', 'hard', true);
    expect(box.querySelector('.status-ai-thinking')).toBeTruthy();
    expect(box.textContent).toMatch(/thinking/i);
  });
});
