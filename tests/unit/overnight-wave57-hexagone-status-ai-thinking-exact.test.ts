/**
 * Wave 57 leftover after #263 — Hex-a-Gone AI thinking status exact. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import { renderStatus } from '../../src/games/hex-a-gone/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 57 hexagone — AI thinking', () => {
  it('isAIThinking shows emoji copy + status-ai-thinking class', () => {
    const el = document.createElement('div');
    renderStatus(createInitialState(), el, 'human-vs-ai', true);
    const turn = el.querySelector('.status-turn');
    expect(turn?.textContent).toBe('🤖 AI is thinking...');
    expect(turn?.classList.contains('status-ai-thinking')).toBe(true);
  });
});
