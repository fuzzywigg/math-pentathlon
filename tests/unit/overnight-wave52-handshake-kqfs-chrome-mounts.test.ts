/**
 * Wave 52 — Kings/Queens/FIAR/Star residual chrome handshake. Tests-only.
 * Distinct from #235/#236 hex/par/stars-bars niches.
 */
import { describe, it, expect, afterEach } from 'vitest';
import {
  createInitialGameState,
  selectKing,
} from '../../src/games/kings-quadraphages/game-state';
import { renderBoard as renderKings } from '../../src/games/kings-quadraphages/board-ui';
import { createInitialState as createQueens } from '../../src/games/queens-guards/types';
import { selectPiece } from '../../src/games/queens-guards/rules';
import { renderBoard as renderQueens } from '../../src/games/queens-guards/board-ui';
import { createInitialState as createFiar } from '../../src/games/fiar/types';
import { renderBoard as renderFiar } from '../../src/games/fiar/board-ui';
import { createInitialState as createStar } from '../../src/games/star-track/types';
import { renderBoard as renderStar } from '../../src/games/star-track/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 52 handshake — kqfs chrome', () => {
  it('mounts residual kings/queens/fiar/star chrome together', () => {
    const kingsEl = document.createElement('div');
    const starEl = document.createElement('div');
    document.body.appendChild(kingsEl);
    document.body.appendChild(starEl);

    renderKings(selectKing(createInitialGameState()), kingsEl);
    expect(kingsEl.querySelector('.cell-valid-move')).toBeTruthy();

    let queens = createQueens();
    queens = selectPiece(queens, { ring: 5, position: 7 });
    const qSvg = renderQueens(queens, () => undefined);
    expect(
      [...qSvg.querySelectorAll('path')].some(
        (p) => p.getAttribute('fill') === '#4caf50'
      )
    ).toBe(true);

    const fSvg = renderFiar(createFiar(), () => undefined);
    expect(
      fSvg.querySelector('[data-node-id] > circle')?.getAttribute('fill')
    ).toBe('#c9baa0');

    renderStar(createStar(), starEl, () => undefined);
    expect(starEl.querySelector('.star-track-bucket-info')).toBeTruthy();
  });
});
