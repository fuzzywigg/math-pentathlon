import { describe, it, expect, afterEach, vi } from 'vitest';

import { createInitialState as createFrac } from '../../src/games/frac-fact/types';
import {
  renderGameOver as renderFracOver,
  getPlayerName as fracName,
} from '../../src/games/frac-fact/board-ui';

import { createInitialState as createPinball } from '../../src/games/fraction-pinball/types';
import {
  renderGameOver as renderPinballOver,
  getPlayerName as pinballName,
} from '../../src/games/fraction-pinball/board-ui';

import { createInitialState as createFab } from '../../src/games/fab-a-diffy/rules';
import {
  renderFractionBarPool,
  renderOperationSelector,
  getPlayerName as fabName,
} from '../../src/games/fab-a-diffy/board-ui';

import { createInitialState as createHexAGone } from '../../src/games/hex-a-gone/types';
import { renderStatus as renderHagStatus } from '../../src/games/hex-a-gone/board-ui';
import { getPhaseMessage as hagPhaseMsg } from '../../src/games/hex-a-gone/rules';

import { createInitialState as createStar } from '../../src/games/star-track/types';
import { renderStatus as renderStarStatus } from '../../src/games/star-track/board-ui';
import { getPhaseMessage as starPhaseMsg } from '../../src/games/star-track/rules';

import { createInitialState as createCalla } from '../../src/games/calla/types';
import { renderStatus as renderCallaStatus } from '../../src/games/calla/board-ui';
import { getPhaseMessage as callaPhaseMsg } from '../../src/games/calla/rules';

import { createInitialState as createQueens } from '../../src/games/queens-guards/types';
import { getPlayerName as queensName } from '../../src/games/queens-guards/board-ui';

import { createInitialState as createFiar } from '../../src/games/fiar/types';
import {
  getPlayerName as fiarName,
  getPlayerColor as fiarColor,
} from '../../src/games/fiar/board-ui';

import { createInitialState as createStars } from '../../src/games/stars-bars/rules';
import {
  getPlayerName as starsName,
  renderMoveHistory as renderStarsHistory,
} from '../../src/games/stars-bars/board-ui';

import { createInitialState as createKwa } from '../../src/games/kwatro-sinko/rules';
import {
  renderChipInfo,
  getPlayerName as kwaName,
} from '../../src/games/kwatro-sinko/board-ui';

import { createInitialState as createSum } from '../../src/games/sum-dominoes/rules';
import {
  getPlayerName as sumName,
  renderDice as renderSumDice,
} from '../../src/games/sum-dominoes/board-ui';

import { createInitialState as createContig } from '../../src/games/contig-60/types';
import {
  getPlayerName as contigName,
  renderDice as renderContigDice,
} from '../../src/games/contig-60/board-ui';

import { createInitialState as createPar } from '../../src/games/par-55/rules';
import { renderHand as renderParHand } from '../../src/games/par-55/board-ui';

import { createInitialState as createPrime } from '../../src/games/prime-gold/rules';
import {
  renderScores as renderPrimeScores,
  renderMoveHistory as renderPrimeHistory,
} from '../../src/games/prime-gold/board-ui';

import { createInitialState as createRamrod } from '../../src/games/ramrod/rules';
import {
  renderScores as renderRamrodScores,
  renderRodLegend,
} from '../../src/games/ramrod/board-ui';

import {
  createInitialState as createJuggle,
  doRollDice as juggleRoll,
} from '../../src/games/juggle/rules';
import { getShapesForDie } from '../../src/games/juggle/types';
import { renderDice as renderJuggleDice } from '../../src/games/juggle/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Burn wave 10 — Frac / Pinball winner gameOver banners', () => {
  it('Frac Fact Blue Wins banner for player1', () => {
    const state = {
      ...createFrac('easy'),
      phase: 'gameOver' as const,
      winner: 'player1' as const,
    };
    const el = renderFracOver(state);
    document.body.appendChild(el);
    expect(el.classList.contains('frac-game-over')).toBe(true);
    expect(el.textContent).toMatch(/Blue Wins/i);
    expect(fracName('player1')).toBe('Blue');
    expect(fracName('player2')).toBe('Red');
  });

  it('Pinball Red Wins banner for player2', () => {
    const state = {
      ...createPinball(),
      phase: 'gameOver' as const,
      winner: 'player2' as const,
    };
    const el = renderPinballOver(state);
    document.body.appendChild(el);
    expect(el.classList.contains('pinball-game-over')).toBe(true);
    expect(el.textContent).toMatch(/Red Wins|wins/i);
    expect(pinballName('player2').length).toBeGreaterThan(0);
  });
});

describe('Burn wave 10 — Fab pool + operation selector', () => {
  it('renderFractionBarPool mounts bars; operation selector fires callback', () => {
    const state = createFab();
    const clicked: string[] = [];
    const pool = renderFractionBarPool(state, (id) => clicked.push(id));
    document.body.appendChild(pool);
    expect(pool.classList.contains('fab-bar-pool')).toBe(true);
    const bar = pool.querySelector(
      '.fab-bar-wrapper:not(.fab-bar-disabled)'
    ) as HTMLElement | null;
    expect(bar).toBeTruthy();
    bar!.click();
    expect(clicked.length).toBe(1);
    expect(fabName('player1').length).toBeGreaterThan(0);

    const ops: string[] = [];
    const advanced = {
      ...state,
      phase: 'selectingOperation' as const,
      selectedBar1: [...state.fractionBars.keys()][0]!,
      selectedBar2: [...state.fractionBars.keys()][1]!,
    };
    const opEl = renderOperationSelector(advanced, (op) => ops.push(op));
    document.body.appendChild(opEl);
    const btn = opEl.querySelector('button, .fab-op-btn') as HTMLElement | null;
    if (btn) {
      btn.click();
      expect(ops.length).toBe(1);
    } else {
      expect(opEl.textContent?.length).toBeGreaterThan(0);
    }
  });
});

describe('Burn wave 10 — Status shells (Hex-a-Gone / Star / Calla)', () => {
  it('Hex-a-Gone renderStatus uses phase message and winner banner', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const fresh = createHexAGone();
    renderHagStatus(fresh, container);
    expect(container.textContent).toContain(hagPhaseMsg(fresh).slice(0, 8));

    renderHagStatus(
      { ...fresh, winner: 'player1', phase: 'gameOver' },
      container
    );
    expect(container.textContent).toMatch(/Wins/i);
  });

  it('Star Track renderStatus draw phase + winner', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const fresh = createStar();
    renderStarStatus(fresh, container);
    expect(container.textContent).toMatch(
      new RegExp(starPhaseMsg(fresh).slice(0, 4), 'i')
    );
    renderStarStatus(
      { ...fresh, winner: 'player2', phase: 'gameOver' },
      container
    );
    expect(container.textContent).toMatch(/Wins/i);
  });

  it('Calla renderStatus select + tie banner', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const fresh = createCalla();
    renderCallaStatus(fresh, container);
    expect(container.textContent?.length).toBeGreaterThan(0);
    expect(callaPhaseMsg(fresh).length).toBeGreaterThan(0);
    renderCallaStatus(
      { ...fresh, winner: 'tie', phase: 'gameOver' },
      container
    );
    expect(container.textContent).toMatch(/Tie/i);
  });
});

describe('Burn wave 10 — Name helpers + Kwatro chip info + Stars history', () => {
  it('Queens / FIAR / Stars names are distinct', () => {
    expect(queensName('player1')).not.toBe(queensName('player2'));
    expect(fiarName('player1')).not.toBe(fiarName('player2'));
    expect(fiarColor('player1')).not.toBe(fiarColor('player2'));
    expect(starsName('player1')).not.toBe(starsName('player2'));
    expect(createQueens().currentPlayer).toBeTruthy();
    expect(createFiar().phase).toBe('placement');
  });

  it('Kwatro chip info + Stars empty history mount', () => {
    const kwa = createKwa();
    const info = renderChipInfo(kwa);
    document.body.appendChild(info);
    expect(info.classList.contains('kwa-chip-info')).toBe(true);
    expect(kwaName('player1').length).toBeGreaterThan(0);

    const stars = createStars();
    const history = renderStarsHistory(stars);
    document.body.appendChild(history);
    expect(history.classList.contains('stars-move-history')).toBe(true);
  });
});

describe('Burn wave 10 — Contig / Sum dice chrome + Par hand', () => {
  it('Contig and Sum renderDice show roll CTA in rolling', () => {
    let rolled = 0;
    const contigDice = renderContigDice(
      null,
      () => {
        rolled++;
      },
      true
    );
    document.body.appendChild(contigDice);
    const contigBtn = contigDice.querySelector(
      '.contig-roll-btn'
    ) as HTMLButtonElement | null;
    expect(contigBtn).toBeTruthy();
    contigBtn!.click();
    expect(rolled).toBe(1);
    expect(contigName('player1').length).toBeGreaterThan(0);
    expect(createContig().phase).toBe('rolling');

    const sumDice = renderSumDice(
      null,
      () => {
        rolled++;
      },
      true
    );
    document.body.appendChild(sumDice);
    const sumBtn = sumDice.querySelector(
      '.sd-roll-btn'
    ) as HTMLButtonElement | null;
    expect(sumBtn).toBeTruthy();
    sumBtn!.click();
    expect(rolled).toBe(2);
    expect(sumName('player2').length).toBeGreaterThan(0);
    expect(createSum().phase).toBe('rolling');
  });

  it('Par renderHand mounts block chrome', () => {
    const state = createPar();
    const hand = renderParHand(state, 'player1', () => {});
    document.body.appendChild(hand);
    expect(hand.classList.contains('par55-hand')).toBe(true);
    expect(hand.children.length).toBeGreaterThan(0);
  });
});

describe('Burn wave 10 — Prime scores/history + Ramrod legend + Juggle dice', () => {
  it('Prime scores and history shells', () => {
    const state = createPrime();
    const scores = renderPrimeScores(state);
    const history = renderPrimeHistory(state);
    document.body.appendChild(scores);
    document.body.appendChild(history);
    expect(scores.classList.contains('pg-scores')).toBe(true);
    expect(history.classList.contains('pg-move-history')).toBe(true);
  });

  it('Ramrod scores + rod legend', () => {
    const scores = renderRamrodScores(createRamrod());
    const legend = renderRodLegend();
    document.body.appendChild(scores);
    document.body.appendChild(legend);
    expect(scores.classList.contains('ramrod-scores')).toBe(true);
    expect(legend.textContent?.length).toBeGreaterThan(0);
  });

  it('Juggle dice after roll + shape controls when placing', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.2);
    let state = createJuggle();
    const diceBefore = renderJuggleDice(
      null,
      () => {},
      () => {},
      true,
      state.phase
    );
    document.body.appendChild(diceBefore);
    expect(diceBefore.querySelector('.juggle-roll-btn')).toBeTruthy();

    state = juggleRoll(state);
    const diceAfter = renderJuggleDice(
      state.currentDice,
      () => {},
      () => {},
      false,
      state.phase
    );
    document.body.appendChild(diceAfter);
    expect(diceAfter.querySelector('.juggle-dice-display')).toBeTruthy();
    expect(getShapesForDie(state.currentDice![0]!).length).toBeGreaterThan(0);
  });
});
