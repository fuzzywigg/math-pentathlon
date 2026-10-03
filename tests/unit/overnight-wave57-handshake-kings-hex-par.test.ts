/**
 * Wave 57 leftover after #263 — kings × hex × hexagone × par × kwatro handshake. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';
import { hexTutorial } from '../../src/games/hex/tutorial';
import { hexAGoneTutorial } from '../../src/games/hex-a-gone/tutorial';
import { par55Tutorial } from '../../src/games/par-55/tutorial';
import { kwatroSinkoTutorial } from '../../src/games/kwatro-sinko/tutorial';
import { newGameVsHuman as newPar } from '../../src/games/par-55/game-controller';
import { newGameVsHuman as newKwa } from '../../src/games/kwatro-sinko/game-controller';
import { createInitialGameState as kingsInit } from '../../src/games/kings-quadraphages/game-state';
import { createInitialState as hexInit } from '../../src/games/hex/types';
import { createInitialState as hexagoneInit, INITIAL_BANK } from '../../src/games/hex-a-gone/types';
import { renderBoard as renderKings } from '../../src/games/kings-quadraphages/board-ui';
import { renderStatus as hexStatus } from '../../src/games/hex/board-ui';
import { renderBoard as renderHexagone, renderStatus as hexagoneStatus } from '../../src/games/hex-a-gone/board-ui';

describe('Wave 57 handshake — leftover engines', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('par55-styles')?.remove();
    document.getElementById('kwa-styles')?.remove();
  });

  it('tutorial ids unique; residual wave57 chrome mounts', () => {
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
    expect(
      kingsEl.querySelector('.cell[data-row="9"][data-col="5"]')?.getAttribute('aria-label')
    ).toBe('E9, Player 2 King');

    const hexStat = document.createElement('div');
    hexStatus({ ...hexInit(5), winner: 'player2' }, hexStat, 'human-vs-human');
    expect(hexStat.querySelector('.status-winner')?.textContent).toBe('🔴 Red Wins!');

    const goneEl = document.createElement('div');
    renderHexagone(hexagoneInit(), goneEl);
    expect(
      goneEl.querySelector('[data-shape="trapezoid"] .block-icon')?.textContent
    ).toBe('⏢');
    expect(
      goneEl.querySelector('[data-shape="trapezoid"] .block-count')?.textContent
    ).toBe(`${INITIAL_BANK.trapezoid} left`);

    const goneStat = document.createElement('div');
    hexagoneStatus(hexagoneInit(), goneStat, 'human-vs-ai', true);
    expect(goneStat.querySelector('.status-turn')?.textContent).toBe(
      '🤖 AI is thinking...'
    );

    const parRoot = document.createElement('div');
    document.body.appendChild(parRoot);
    newPar(parRoot);
    expect(parRoot.querySelector('.par55-status')?.textContent).toMatch(
      /Select a block/
    );

    const kwaRoot = document.createElement('div');
    document.body.appendChild(kwaRoot);
    newKwa(kwaRoot);
    expect(kwaRoot.querySelector('.kwa-target-info')?.textContent).toMatch(
      /a \+ b - c = 4 or 5/
    );
  });
});
