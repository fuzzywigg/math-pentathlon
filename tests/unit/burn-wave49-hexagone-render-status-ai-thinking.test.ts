/**
 * Wave 49 leftover after #221/#226/#227 — Hex-a-Gone AI thinking. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import { renderStatus } from '../../src/games/hex-a-gone/board-ui';

describe('Wave 49 hexagone — AI thinking', () => {
  it('shows thinking chrome', () => {
    const container = document.createElement('div');
    renderStatus(createInitialState(), container, 'human-vs-ai', true);
    expect(container.querySelector('.status-ai-thinking')?.textContent).toMatch(/AI is thinking/);
  });
});
