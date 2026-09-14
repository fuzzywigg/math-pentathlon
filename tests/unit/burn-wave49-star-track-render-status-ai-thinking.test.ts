/**
 * Wave 49 leftover after #221/#226/#227 — Star Track AI thinking chrome. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/star-track/types';
import { renderStatus } from '../../src/games/star-track/board-ui';

describe('Wave 49 star-track — AI thinking', () => {
  it('shows thinking message when flagged', () => {
    const container = document.createElement('div');
    renderStatus(createInitialState(), container, 'human-vs-ai', true);
    expect(container.querySelector('.status-ai-thinking')?.textContent).toMatch(/AI is thinking/);
  });
});
