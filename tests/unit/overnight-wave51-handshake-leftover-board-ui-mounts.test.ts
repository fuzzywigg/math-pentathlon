/**
 * Overnight HEAVY leftovers after #234 — Handshake mounts hex/par/kwatro/stars/sum/remainder/fiar.
 * Distinct niche not tip-burned by #234 prime/frac/pent. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState as hexInit } from '../../src/games/hex/types';
import { renderBoard as renderHex, renderStatus } from '../../src/games/hex/board-ui';
import { createInitialState as parInit } from '../../src/games/par-55/rules';
import { renderBoard as renderPar, renderHand as renderParHand } from '../../src/games/par-55/board-ui';
import { createInitialState as kwaInit } from '../../src/games/kwatro-sinko/rules';
import { renderBoard as renderKwa } from '../../src/games/kwatro-sinko/board-ui';
import { createInitialState as starsInit } from '../../src/games/stars-bars/rules';
import { renderBoard as renderStars } from '../../src/games/stars-bars/board-ui';
import { createInitialState as sumInit } from '../../src/games/sum-dominoes/rules';
import { renderBoard as renderSum } from '../../src/games/sum-dominoes/board-ui';
import { createInitialState as remInit } from '../../src/games/remainder-islands/types';
import { renderBoard as renderRem } from '../../src/games/remainder-islands/board-ui';
import { createInitialState as fiarInit } from '../../src/games/fiar/types';
import { renderBoard as renderFiar } from '../../src/games/fiar/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 51 handshake — leftover mounts', () => {
  it('mounts opening chrome across unsaturated board-ui niches', () => {
    const hexBox = document.createElement('div');
    document.body.appendChild(hexBox);
    renderHex(hexInit(3), hexBox, () => undefined);
    expect(hexBox.querySelector('.hex-board')).toBeTruthy();
    renderStatus(hexInit(3), hexBox);
    expect(hexBox.querySelector('.hex-status')).toBeTruthy();

    const par = parInit();
    expect(renderPar(par, () => undefined).querySelectorAll('[data-base-id]').length).toBe(
      par.bases.size
    );
    expect(renderParHand(par, 'player1', () => undefined).querySelectorAll('.par55-hand-block').length).toBe(
      par.hands.player1.length
    );

    expect(renderKwa(kwaInit(), () => undefined, () => undefined).querySelectorAll('[data-node-id]').length).toBeGreaterThan(0);
    expect(renderStars(starsInit(), () => undefined).querySelectorAll('.stars-cell').length).toBeGreaterThan(0);
    expect(renderSum(sumInit(), () => undefined).querySelector('.sd-domino')).toBeTruthy();
    expect(renderRem(remInit(), () => undefined, () => undefined).querySelectorAll('.island').length).toBeGreaterThan(0);
    expect(renderFiar(fiarInit(), () => undefined).querySelectorAll('[data-node-id]').length).toBe(25);
  });
});
