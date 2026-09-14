/**
 * Wave 55 leftover after #250 — kings × hex × hexagone × stars × par × kwatro handshake. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';
import { hexTutorial } from '../../src/games/hex/tutorial';
import { hexAGoneTutorial } from '../../src/games/hex-a-gone/tutorial';
import { starsBarsTutorial } from '../../src/games/stars-bars/tutorial';
import { par55Tutorial } from '../../src/games/par-55/tutorial';
import { kwatroSinkoTutorial } from '../../src/games/kwatro-sinko/tutorial';
import { createInitialGameState as kingsInit } from '../../src/games/kings-quadraphages/game-state';
import { createInitialState as hexInit } from '../../src/games/hex/types';
import { createInitialState as hexagoneInit } from '../../src/games/hex-a-gone/types';
import { createInitialState as starsInit } from '../../src/games/stars-bars/rules';
import { createInitialState as parInit } from '../../src/games/par-55/rules';
import { createInitialState as kwaInit } from '../../src/games/kwatro-sinko/rules';
import { renderBoard as renderKings } from '../../src/games/kings-quadraphages/board-ui';
import { renderBoard as renderHex } from '../../src/games/hex/board-ui';
import { renderBoard as renderHexagone } from '../../src/games/hex-a-gone/board-ui';
import { renderBoard as renderStars } from '../../src/games/stars-bars/board-ui';
import { renderBoard as renderPar } from '../../src/games/par-55/board-ui';
import { renderBoard as renderKwa } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 55 handshake — leftover engines', () => {
  it('tutorial ids unique; residual chrome mounts', () => {
    const ids = [
      kingsQuadraphagesTutorial.id,
      hexTutorial.id,
      hexAGoneTutorial.id,
      starsBarsTutorial.id,
      par55Tutorial.id,
      kwatroSinkoTutorial.id,
    ];
    expect(new Set(ids).size).toBe(6);
    const kingsEl = document.createElement('div');
    renderKings(kingsInit(), kingsEl);
    const hexEl = document.createElement('div');
    renderHex(hexInit(5), hexEl, () => undefined);
    const goneEl = document.createElement('div');
    renderHexagone(hexagoneInit(), goneEl);
    const stars = renderStars(starsInit(), () => undefined);
    const par = renderPar(parInit(), () => undefined);
    const kwa = renderKwa(kwaInit(), () => undefined, () => undefined);
    expect(kingsEl.querySelector('.cell-king')).toBeTruthy();
    expect(hexEl.querySelector('.hex-board')).toBeTruthy();
    expect(goneEl.querySelector('.hex-a-gone-board')).toBeTruthy();
    expect(stars.querySelector('.stars-board')).toBeTruthy();
    expect(par.classList.contains('par55-board')).toBe(true);
    expect(kwa.classList.contains('kwa-board')).toBe(true);
    expect(kwa.querySelector('[data-node-id]')).toBeTruthy();
  });
});
