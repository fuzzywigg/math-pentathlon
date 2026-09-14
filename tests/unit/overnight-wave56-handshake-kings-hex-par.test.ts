/**
 * Wave 56 leftover after #256 — kings × hex × hexagone × stars × par × kwatro handshake.
 * Distinct from wave55 tutorial-id uniqueness: residual chrome + Clear Selection path.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialGameState as kingsInit } from '../../src/games/kings-quadraphages/game-state';
import { createInitialState as hexInit } from '../../src/games/hex/types';
import { createInitialState as hexagoneInit } from '../../src/games/hex-a-gone/types';
import { renderBoard as renderKings } from '../../src/games/kings-quadraphages/board-ui';
import { renderBoard as renderHex } from '../../src/games/hex/board-ui';
import { renderBoard as renderHexagone } from '../../src/games/hex-a-gone/board-ui';
import { newGameVsHuman as starsHuman } from '../../src/games/stars-bars/game-controller';
import { newGameVsHuman as parHuman } from '../../src/games/par-55/game-controller';
import { newGameVsHuman as kwaHuman } from '../../src/games/kwatro-sinko/game-controller';
import { selectCard } from '../../src/games/stars-bars/rules';
import { selectBlock } from '../../src/games/par-55/rules';
import { selectChip } from '../../src/games/kwatro-sinko/rules';

afterEach(() => {
  document.body.innerHTML = '';
  for (const id of ['par55-styles', 'stars-styles', 'kwa-styles']) {
    document.getElementById(id)?.remove();
  }
});

describe('Wave 56 handshake — leftover engines', () => {
  it('six engines mount residual chrome; clear-selection buttons when selected', () => {
    const kingsEl = document.createElement('div');
    renderKings(kingsInit(), kingsEl);
    expect(kingsEl.querySelector('.cell-king')).toBeTruthy();

    const hexEl = document.createElement('div');
    renderHex(hexInit(5), hexEl, () => undefined);
    expect(hexEl.querySelector('.hex-board')).toBeTruthy();

    const goneEl = document.createElement('div');
    renderHexagone(hexagoneInit(), goneEl);
    expect(goneEl.querySelector('.hex-a-gone-bank-title')?.textContent).toBe(
      'Pattern Block Bank'
    );

    const starsEl = document.createElement('div');
    document.body.appendChild(starsEl);
    const stars = starsHuman(starsEl);
    stars.state = selectCard(stars.state, stars.state.playerHands.player1[0]!.id);
    stars.update();
    expect(starsEl.querySelector('.stars-btn-secondary')?.textContent).toMatch(
      /Clear Selection/
    );

    const parEl = document.createElement('div');
    document.body.appendChild(parEl);
    const par = parHuman(parEl);
    par.state = selectBlock(par.state, par.state.hands.player1[0]!.id);
    par.update();
    expect(parEl.querySelector('.par55-btn-secondary')?.textContent).toMatch(
      /Clear Selection/
    );

    const kwaEl = document.createElement('div');
    document.body.appendChild(kwaEl);
    const kwa = kwaHuman(kwaEl);
    kwa.state = selectChip(kwa.state, 'p1-0');
    kwa.update();
    expect(kwaEl.querySelector('.kwa-btn-secondary')?.textContent).toMatch(
      /Clear Selection/
    );
    expect(kwaEl.querySelector('.kwa-target-info')).toBeTruthy();
  });
});
