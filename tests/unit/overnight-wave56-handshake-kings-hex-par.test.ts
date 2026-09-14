/**
 * Wave 56 leftover after #256 — kings × hex × hexagone × par × kwatro handshake. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';
import { hexTutorial } from '../../src/games/hex/tutorial';
import { hexAGoneTutorial } from '../../src/games/hex-a-gone/tutorial';
import { par55Tutorial } from '../../src/games/par-55/tutorial';
import { kwatroSinkoTutorial } from '../../src/games/kwatro-sinko/tutorial';
import { createInitialGameState as kingsInit } from '../../src/games/kings-quadraphages/game-state';
import { createInitialState as hexInit } from '../../src/games/hex/types';
import { createInitialState as hexagoneInit } from '../../src/games/hex-a-gone/types';
import { createInitialState as parInit } from '../../src/games/par-55/rules';
import { createInitialState as kwaInit } from '../../src/games/kwatro-sinko/rules';
import { renderBoard as renderKings, renderStatus as kingsStatus } from '../../src/games/kings-quadraphages/board-ui';
import { renderBoard as renderHex, renderStatus as hexStatus } from '../../src/games/hex/board-ui';
import { renderBoard as renderHexagone, renderStatus as hexagoneStatus } from '../../src/games/hex-a-gone/board-ui';
import { renderBoard as renderPar, renderScores } from '../../src/games/par-55/board-ui';
import { renderBoard as renderKwa } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 56 handshake — leftover engines', () => {
  it('tutorial ids unique; residual chrome mounts', () => {
    const ids = [
      kingsQuadraphagesTutorial.id,
      hexTutorial.id,
      hexAGoneTutorial.id,
      par55Tutorial.id,
      kwatroSinkoTutorial.id,
    ];
    expect(new Set(ids).size).toBe(5);
    const kingsEl = document.createElement('div');
    renderKings(kingsInit(), kingsEl);
    const kingsStat = document.createElement('div');
    kingsStatus(kingsInit(), kingsStat);
    const hexEl = document.createElement('div');
    renderHex(hexInit(5), hexEl, () => undefined);
    const hexStat = document.createElement('div');
    hexStatus(hexInit(5), hexStat, 'human-vs-human');
    const goneEl = document.createElement('div');
    renderHexagone(hexagoneInit(), goneEl);
    const goneStat = document.createElement('div');
    hexagoneStatus(hexagoneInit(), goneStat);
    const par = renderPar(parInit(), () => undefined);
    const scores = renderScores(parInit());
    const kwa = renderKwa(kwaInit(), () => undefined, () => undefined);
    expect(kingsEl.querySelector('.board')?.getAttribute('role')).toBe('grid');
    expect(kingsStat.getAttribute('aria-live')).toBe('polite');
    expect(hexStat.querySelector('.status-turn')?.textContent).toMatch(/Blue's turn/);
    expect(goneStat.querySelector('.hex-a-gone-coverage')?.textContent).toMatch(
      /cells filled/
    );
    expect(par.classList.contains('par55-board')).toBe(true);
    expect(scores.querySelector('.par55-target')?.textContent).toBe('Target: 55');
    expect(kwa.querySelector('[data-node-id="n0-0"]')?.getAttribute('aria-label')).toMatch(
      /numbered/
    );
  });
});
