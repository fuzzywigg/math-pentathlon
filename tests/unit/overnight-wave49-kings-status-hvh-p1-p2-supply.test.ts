/**
 * Wave 49 — Kings HvH P1/P2 supply leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';
import { renderStatus } from '../../src/games/kings-quadraphages/board-ui';

afterEach(() => { document.body.innerHTML = ''; });

describe('Wave 49 kings — HvH supplies', () => {
  it('labels supplies P1/P2 in human-vs-human mode', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    renderStatus(createInitialGameState(), el, 'human-vs-human');
    expect(el.querySelector('.supply-p1')?.textContent).toMatch(/P1: 30/);
    expect(el.querySelector('.supply-p2')?.textContent).toMatch(/P2: 30/);
    expect(el.querySelector('.status-mode')).toBeNull();
  });
});
