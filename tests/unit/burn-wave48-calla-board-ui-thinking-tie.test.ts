/**
 * Wave 48 — Calla board-ui AI thinking + tie winner chrome. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { renderStatus } from '../../src/games/calla/board-ui';

describe('Wave 48 calla — board-ui thinking/tie', () => {
  it('shows thinking chrome and tie winner text', () => {
    const thinking = document.createElement('div');
    renderStatus(createInitialState(), thinking, 'human-vs-ai', true);
    expect(thinking.textContent).toMatch(/thinking/i);

    const tie = document.createElement('div');
    renderStatus(
      { ...createInitialState(), phase: 'gameOver', winner: 'tie' },
      tie,
      'human-vs-human'
    );
    expect(tie.textContent).toMatch(/tie/i);
  });
});
