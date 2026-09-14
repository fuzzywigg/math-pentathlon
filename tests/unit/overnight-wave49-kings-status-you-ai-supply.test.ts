/**
 * Wave 49 — Kings HvA supply You/AI exact leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';
import { renderStatus } from '../../src/games/kings-quadraphages/board-ui';

afterEach(() => { document.body.innerHTML = ''; });

describe('Wave 49 kings — You/AI supply', () => {
  it('labels supplies You and AI in human-vs-ai mode', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    renderStatus(createInitialGameState(), el, 'human-vs-ai', 'medium', false);
    expect(el.querySelector('.supply-p1')?.textContent).toMatch(/You: 30/);
    expect(el.querySelector('.supply-p2')?.textContent).toMatch(/AI: 30/);
  });
});
