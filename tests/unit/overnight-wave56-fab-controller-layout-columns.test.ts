/**
 * Wave 56 leftover after #255/#256 — Fab game-area / left / right columns. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/fab-a-diffy/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 56 fab — layout columns', () => {
  it('mounts game-area, left column with pool, right with answers', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    newGameVsHuman(container);

    expect(container.querySelector('.fab-game-area')).toBeTruthy();
    expect(container.querySelector('.fab-left-column .fab-bar-pool')).toBeTruthy();
    expect(
      container.querySelector('.fab-right-column .fab-answer-board')
    ).toBeTruthy();
    expect(container.querySelector('.fab-main-layout')).toBeTruthy();
  });
});
