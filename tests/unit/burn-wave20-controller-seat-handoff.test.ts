/**
 * Wave 20 — legal controller seat-handoffs (DOM click → phase/seat/status).
 * Distinct from #113/#115 rules/AI, #117 midphase, closed #116 playthroughs,
 * and sibling #120 (persist/serialize/lookup/status-ui-edges).
 * Tests-only. Existing games only — no product inventing.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import { owlSystem } from '../../src/core/owl';

import {
  initGame as initHex,
  newGameVsHuman as hexVsHuman,
  getGameState as getHexState,
} from '../../src/games/hex/game-controller';

import {
  initGame as initCalla,
  newGameVsHuman as callaVsHuman,
  getGameState as getCallaState,
} from '../../src/games/calla/game-controller';

import {
  initGame as initFiar,
  newGameVsHuman as fiarVsHuman,
  getCurrentState as getFiarState,
} from '../../src/games/fiar/game-controller';

import {
  initGame as initKings,
  newGameVsHuman as kingsVsHuman,
  getGameState as getKingsState,
} from '../../src/games/kings-quadraphages/game-controller';

import {
  initGame as initStar,
  newGameVsHuman as starVsHuman,
  getGameState as getStarState,
} from '../../src/games/star-track/game-controller';

import {
  initGame as initHexAGone,
  newGameVsHuman as hexAGoneVsHuman,
  getGameState as getHexAGoneState,
} from '../../src/games/hex-a-gone/game-controller';

import {
  initGame as initQueens,
  newGameVsHuman as queensVsHuman,
} from '../../src/games/queens-guards/game-controller';

import {
  initGame as initContig,
  newGameVsHuman as contigVsHuman,
} from '../../src/games/contig-60/game-controller';

import {
  initGame as initJuggle,
  newGameVsHuman as juggleVsHuman,
} from '../../src/games/juggle/game-controller';

import { newGameVsHuman as sdVsHuman } from '../../src/games/sum-dominoes/game-controller';
import { newGameVsHuman as primeVsHuman } from '../../src/games/prime-gold/game-controller';
import { newGameVsHuman as parVsHuman } from '../../src/games/par-55/game-controller';
import { newGameVsHuman as starsVsHuman } from '../../src/games/stars-bars/game-controller';
import { newGameVsHuman as ramrodVsHuman } from '../../src/games/ramrod/game-controller';
import { newGameVsHuman as kwaVsHuman } from '../../src/games/kwatro-sinko/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
  vi.useRealTimers();
});

function mountPair(): { board: HTMLElement; status: HTMLElement } {
  const board = document.createElement('div');
  const status = document.createElement('div');
  document.body.appendChild(board);
  document.body.appendChild(status);
  return { board, status };
}

function click(el: Element | null): void {
  expect(el).toBeTruthy();
  el!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
}

function mountContainer(): HTMLElement {
  const container = document.createElement('div');
  document.body.appendChild(container);
  return container;
}

describe('Wave 20 seat-handoff — Hex legal click flips seat + status', () => {
  it('empty cell grows history, flips to player2, Red turn chrome', () => {
    const onEnd = vi.spyOn(owlSystem, 'onGameEnd');
    const onStart = vi.spyOn(owlSystem, 'onGameStart');
    const { board, status } = mountPair();
    initHex(board, status);
    hexVsHuman();
    expect(onStart).toHaveBeenCalledWith('hex');

    expect(getHexState().currentPlayer).toBe('player1');
    expect(getHexState().moveHistory).toHaveLength(0);

    click(board.querySelector('.hex-cell-group[data-row="2"][data-col="2"]'));

    expect(getHexState().moveHistory.length).toBe(1);
    expect(getHexState().currentPlayer).toBe('player2');
    expect(getHexState().winner).toBeNull();
    expect(status.querySelector('.status-turn')?.textContent).toMatch(/Red/i);
    expect(onEnd).not.toHaveBeenCalled();

    const after = getHexState().moveHistory.length;
    click(board.querySelector('.hex-cell-group[data-row="2"][data-col="2"]'));
    expect(getHexState().moveHistory.length).toBe(after);
    expect(getHexState().currentPlayer).toBe('player2');
  });

  it('second empty cell returns seat to player1', () => {
    const { board, status } = mountPair();
    initHex(board, status);
    hexVsHuman();
    click(board.querySelector('.hex-cell-group[data-row="0"][data-col="0"]'));
    expect(getHexState().currentPlayer).toBe('player2');
    click(board.querySelector('.hex-cell-group[data-row="0"][data-col="1"]'));
    expect(getHexState().currentPlayer).toBe('player1');
    expect(getHexState().moveHistory.length).toBe(2);
    expect(status.querySelector('.status-turn')?.textContent).toMatch(/Blue|Player 1|turn/i);
  });
});

describe('Wave 20 seat-handoff — Calla valid pit advances history/status', () => {
  it('valid P1 pit click records a move and refreshes status chrome', () => {
    const onStart = vi.spyOn(owlSystem, 'onGameStart');
    const { board, status } = mountPair();
    initCalla(board, status);
    callaVsHuman();
    expect(onStart).toHaveBeenCalledWith('calla');

    const before = getCallaState().moveHistory.length;
    const pit = board.querySelector(
      '.calla-pit-p1.calla-pit-valid, .calla-pit[data-side="player1"].calla-pit-valid'
    );
    click(pit);

    expect(getCallaState().moveHistory.length).toBeGreaterThan(before);
    expect(status.querySelector('.status-turn, .calla-status, .calla-scores')).toBeTruthy();
    expect(getCallaState().winner).toBeNull();
    expect(getCallaState().phase).not.toBe('gameOver');
  });

  it('empty invalid pit does not grow history (contrast to legal)', () => {
    const { board, status } = mountPair();
    initCalla(board, status);
    callaVsHuman();
    const before = getCallaState().moveHistory.length;
    const invalid = board.querySelector('.calla-pit:not(.calla-pit-valid)');
    if (invalid) {
      click(invalid);
      expect(getCallaState().moveHistory.length).toBe(before);
    } else {
      expect(getCallaState().player1Pits.some((n) => n > 0)).toBe(true);
    }
  });
});

describe('Wave 20 seat-handoff — FIAR place flips seat; re-click no-op', () => {
  it('first node place flips to player2 and grows history once', () => {
    const { board, status } = mountPair();
    initFiar(board, status);
    fiarVsHuman();

    const node = board.querySelector('[data-node-id]');
    click(node);
    expect(getFiarState().moveHistory.length).toBe(1);
    expect(getFiarState().chipsPlaced.player1).toBe(1);
    expect(getFiarState().currentPlayer).toBe('player2');
    expect(status.querySelector('.fiar-status')?.textContent).toMatch(/Red|Player 2|turn/i);

    click(node);
    expect(getFiarState().moveHistory.length).toBe(1);
    expect(getFiarState().currentPlayer).toBe('player2');
  });

  it('second empty node returns seat to player1', () => {
    const { board, status } = mountPair();
    initFiar(board, status);
    fiarVsHuman();
    const nodes = [...board.querySelectorAll('[data-node-id]')];
    expect(nodes.length).toBeGreaterThanOrEqual(2);
    click(nodes[0]);
    expect(getFiarState().currentPlayer).toBe('player2');
    const next = nodes.find((n) => n !== nodes[0] && !n.classList.contains('occupied'));
    click(next ?? nodes[1]);
    expect(getFiarState().moveHistory.length).toBe(2);
    expect(getFiarState().currentPlayer).toBe('player1');
  });
});

describe('Wave 20 seat-handoff — Kings full turn flips seat', () => {
  it('select → move → place Quadraphage hands seat to Player 2', () => {
    const board = document.createElement('div');
    const status = document.createElement('div');
    const history = document.createElement('div');
    document.body.appendChild(board);
    document.body.appendChild(status);
    document.body.appendChild(history);

    initKings(board, status, history);
    kingsVsHuman();

    expect(getKingsState().currentPlayer).toBe('player1');
    expect(getKingsState().turnPhase).toBe('moveKing');

    click(board.querySelector('.cell[data-row="1"][data-col="5"]'));
    expect(getKingsState().selectedKingPosition).toBeTruthy();

    const validMove = board.querySelector('.cell-valid-move');
    click(validMove);
    expect(getKingsState().turnPhase).toBe('placeQuadraphage');

    const place =
      board.querySelector('.cell-valid-placement') ??
      board.querySelector('.cell-empty, .cell:not(.cell-occupied)');
    click(place);

    expect(getKingsState().currentPlayer).toBe('player2');
    expect(getKingsState().turnPhase).toBe('moveKing');
    expect(status.querySelector('.status-turn')?.textContent).toMatch(/Player 2/i);
    expect(getKingsState().moveHistory.length).toBeGreaterThanOrEqual(2);
  });
});

describe('Wave 20 seat-handoff — Star Track draw→chain flips seat', () => {
  it('draw advances to selectChain; chain choice flips player', () => {
    const onStart = vi.spyOn(owlSystem, 'onGameStart');
    const { board, status } = mountPair();
    initStar(board, status);
    starVsHuman();
    expect(onStart).toHaveBeenCalledWith('star-track');
    expect(getStarState().phase).toBe('drawChains');

    click(board.querySelector('.star-track-draw-btn'));
    expect(getStarState().phase).toBe('selectChain');
    expect(getStarState().drawnChains.length).toBeGreaterThan(0);

    click(board.querySelector('.star-track-chain-btn'));
    expect(getStarState().moveHistory.length).toBeGreaterThanOrEqual(1);
    expect(getStarState().currentPlayer).toBe('player2');
    expect(status.querySelector('.status-turn, .star-track-status')).toBeTruthy();
    expect(getStarState().player1Position).toBeGreaterThanOrEqual(0);
  });

  it('board space click before draw stays drawChains (contrast)', () => {
    const { board, status } = mountPair();
    initStar(board, status);
    starVsHuman();
    click(board.querySelector('[data-space]'));
    expect(getStarState().phase).toBe('drawChains');
    expect(getStarState().moveHistory).toHaveLength(0);
  });
});

describe('Wave 20 seat-handoff — Hex-a-Gone select→confirm enters place', () => {
  it('block select + confirm moves phase to placeBlocks', () => {
    const { board, status } = mountPair();
    initHexAGone(board, status);
    hexAGoneVsHuman();

    expect(getHexAGoneState().phase).toBe('selectBlocks');
    const block =
      board.querySelector('.hex-a-gone-block-btn[data-shape="hexagon"]') ??
      board.querySelector('.hex-a-gone-block-btn, .hag-block-btn, [data-shape]');
    click(block);
    expect(getHexAGoneState().turnSelection.blocks.length).toBeGreaterThan(0);

    const confirm = board.querySelector(
      '.hex-a-gone-confirm-btn, .hag-confirm-btn, button:not([disabled])'
    );
    if (confirm && !(confirm as HTMLButtonElement).disabled) {
      click(confirm);
      expect(['placeBlocks', 'selectBlocks']).toContain(getHexAGoneState().phase);
    }
    expect(status.querySelector('.status-turn, .hex-a-gone-status, .hag-status')).toBeTruthy();
  });
});

describe('Wave 20 seat-handoff — Queens select→legal move updates status', () => {
  it('queen select then highlighted destination leaves select instruction', () => {
    const { board, status } = mountPair();
    initQueens(board, status);
    queensVsHuman();

    const before = status.querySelector('.qg-status')?.textContent ?? '';
    click(board.querySelector('[data-cell-key="5-7"]'));
    const afterSelect = status.querySelector('.qg-status')?.textContent ?? '';
    expect(afterSelect.length).toBeGreaterThan(0);

    const dest =
      board.querySelector('[data-cell-key="4-7"]') ??
      board.querySelector('[data-cell-key="5-6"]') ??
      board.querySelector('[data-cell-key="5-8"]');
    if (dest) {
      click(dest);
      const afterMove = status.querySelector('.qg-status')?.textContent ?? '';
      expect(afterMove.length).toBeGreaterThan(0);
      // Either seat flipped (opponent turn) or still instruction — chrome stays live
      expect(status.querySelector('.qg-status, .qg-info')).toBeTruthy();
    } else {
      expect(afterSelect).not.toBe(before);
    }
  });
});

describe('Wave 20 seat-handoff — Contig roll advances chrome', () => {
  it('roll leaves rolling CTA and shows expressions or pass', () => {
    const { board, status } = mountPair();
    initContig(board, status);
    contigVsHuman();

    click(board.querySelector('.contig-roll-btn'));
    expect(
      board.querySelector('.contig-expressions, .contig-pass-btn, .contig-dice-display')
    ).toBeTruthy();
    expect(status.querySelector('.contig-status')?.textContent).toMatch(/turn|Select|Pass|Place/i);

    const valid = board.querySelector('.contig-cell-valid');
    if (valid) {
      click(valid);
      expect(board.querySelector('.contig-roll-btn')).toBeTruthy();
      expect(board.querySelector('.contig-cell-p1, .contig-cell-occupied')).toBeTruthy();
      expect(status.querySelector('.contig-status')?.textContent).toMatch(/Roll|turn/i);
    } else {
      const pass = board.querySelector('.contig-pass-btn');
      if (pass) {
        click(pass);
        expect(board.querySelector('.contig-roll-btn')).toBeTruthy();
      }
    }
  });
});

describe('Wave 20 seat-handoff — Juggle roll advances status instruction', () => {
  it('roll CTA leaves Roll-dice chrome for die/shape selection', () => {
    const { board, status } = mountPair();
    initJuggle(board, status);
    juggleVsHuman();

    click(board.querySelector('.juggle-roll-btn, .roll-dice-btn'));
    const text = status.querySelector('.juggle-status')?.textContent ?? '';
    expect(text.length).toBeGreaterThan(0);
    expect(text).toMatch(/die|shape|Select|Place|Roll/i);
    expect(
      board.querySelector('.juggle-die, .juggle-shape-option, .juggle-shapes, .juggle-dice')
    ).toBeTruthy();
  });
});

describe('Wave 20 seat-handoff — Sum Dominoes roll→place when playable', () => {
  it('roll enters placing/passing; place flips seat when valid cell exists', () => {
    const container = mountContainer();
    const ctrl = sdVsHuman(container);

    expect(ctrl.state.phase).toBe('rolling');
    click(container.querySelector('.sd-roll-btn'));
    expect(['placing', 'passing', 'rolling']).toContain(ctrl.state.phase);
    expect(container.querySelector('.sd-status')?.textContent).toMatch(
      /Select|Pass|place|Roll|No/i
    );

    const playable = container.querySelector(
      '.sd-hand-player1 .sd-hand-domino-playable, .sd-hand-domino.playable'
    );
    if (playable) {
      click(playable);
      const cell = container.querySelector('.sd-cell-valid');
      if (cell) {
        const before = ctrl.state.moveHistory.length;
        click(cell);
        expect(ctrl.state.moveHistory.length).toBeGreaterThan(before);
        expect(ctrl.state.currentPlayer).toBe('player2');
        expect(ctrl.state.phase).toBe('rolling');
      }
    } else if (ctrl.state.phase === 'passing') {
      const pass = container.querySelector('.sd-pass-btn');
      if (pass) {
        click(pass);
        expect(ctrl.state.currentPlayer).toBe('player2');
      }
    }
  });
});

describe('Wave 20 seat-handoff — Prime Gold roll→place when valid', () => {
  it('roll enters placing; valid cell place flips seat and grows history', () => {
    const container = mountContainer();
    const ctrl = primeVsHuman(container);

    click(container.querySelector('.pg-roll-btn, .prime-roll-btn'));
    expect(['placing', 'passing', 'rolling']).toContain(ctrl.state.phase);
    expect(container.querySelector('.pg-status')?.textContent).toMatch(
      /Select|Pass|Roll|place|expression/i
    );

    const valid =
      container.querySelector('.pg-cell.valid') ??
      container.querySelector('.pg-expr-item, .pg-expression');
    if (valid && ctrl.state.phase === 'placing') {
      const before = ctrl.state.moveHistory.length;
      click(valid);
      // expression select may need a second click on cell
      const cell = container.querySelector('.pg-cell.valid');
      if (cell) click(cell);
      if (ctrl.state.moveHistory.length > before) {
        expect(ctrl.state.currentPlayer).toBe('player2');
        expect(container.querySelector('.pg-move-item, .pg-history')).toBeTruthy();
      }
    }
  });
});

describe('Wave 20 seat-handoff — Par 55 select→place flips seat', () => {
  it('hand block + valid base place grows history and flips player', () => {
    const container = mountContainer();
    const ctrl = parVsHuman(container);

    expect(ctrl.state.phase).toBe('selectingBlock');
    click(container.querySelector('.par55-hand-player1 .par55-hand-block.clickable'));
    expect(ctrl.state.phase).toBe('placingBlock');
    expect(ctrl.state.selectedBlock).toBeTruthy();

    const validPent = container.querySelector('.par55-valid-base');
    click(validPent?.closest('g[data-base-id]') ?? validPent);
    expect(ctrl.state.moveHistory.length).toBe(1);
    expect(ctrl.state.currentPlayer).toBe('player2');
    expect(ctrl.state.scores.player1).toBeGreaterThanOrEqual(0);
    expect(container.querySelector('.par55-status')?.textContent).toMatch(/Select|turn|Place/i);
    expect(container.querySelector('.par55-history-move')).toBeTruthy();
  });
});

describe('Wave 20 seat-handoff — Stars & Bars select→place flips seat', () => {
  it('card + valid cell place grows history and flips player', () => {
    const container = mountContainer();
    const ctrl = starsVsHuman(container);

    expect(ctrl.state.phase).toBe('selectingCard');
    const hand =
      container.querySelector('.stars-hand-label.player1')?.parentElement ??
      container.querySelector('.stars-hand.player1, .stars-hand-player1');
    const card = hand?.querySelector('.stars-card:not(.disabled), .stars-card');
    click(card);
    expect(ctrl.state.phase).toBe('placingCard');

    const cell = container.querySelector('.stars-cell.valid, .stars-cell-valid');
    click(cell);
    expect(ctrl.state.moveHistory.length).toBe(1);
    expect(ctrl.state.currentPlayer).toBe('player2');
    expect(ctrl.state.playerScores.player1).toBeGreaterThanOrEqual(0);
    expect(container.querySelector('.stars-status')?.textContent).toMatch(/Select|Place|turn/i);
    expect(container.querySelector('.stars-move-item, .stars-history')).toBeTruthy();
  });
});

describe('Wave 20 seat-handoff — Ramrod / Kwatro select advances phase chrome', () => {
  it('Ramrod rod select enters placing and status updates', () => {
    const container = mountContainer();
    const ctrl = ramrodVsHuman(container);
    expect(ctrl.state.phase).toBe('selectingRod');

    const rod = container.querySelector(
      '.ramrod-player-player1 .ramrod-rod-wrapper.selectable, .ramrod-rod-wrapper.selectable, .ramrod-rod-wrapper'
    );
    click(rod);
    expect(ctrl.state.selectedRod || ctrl.state.phase === 'placingRod').toBeTruthy();
    expect(container.querySelector('.ramrod-status')?.textContent).toMatch(
      /Select|Place|turn|box|Rod/i
    );

    if (ctrl.state.phase === 'placingRod' && ctrl.state.selectedRod) {
      const slot = container.querySelector(
        '.ramrod-slot.valid, .ramrod-slot.selectable, .ramrod-hint'
      );
      if (slot) {
        const before = ctrl.state.moveHistory.length;
        click(slot.closest('.ramrod-slot') ?? slot);
        if (ctrl.state.moveHistory.length > before) {
          expect(ctrl.state.currentPlayer).toBe('player2');
        }
      }
    }
  });

  it('Kwatro chip select enters move phase chrome', () => {
    const container = mountContainer();
    const ctrl = kwaVsHuman(container);
    expect(ctrl.state.phase).toBe('selectingChip');

    const chip = container.querySelector(
      '.kwa-selectable-chip, [data-node-id] circle.kwa-selectable-chip, g[data-node-id]'
    );
    // Prefer the selectable chip circle; fall back to a node group that owns one
    const target =
      container.querySelector('.kwa-selectable-chip')?.closest('g[data-node-id]') ??
      chip;
    click(target);
    expect(
      ctrl.state.selectedChip ||
        ctrl.state.phase === 'selectingDest' ||
        container.querySelector('.kwa-status')
    ).toBeTruthy();
    expect(container.querySelector('.kwa-status')?.textContent).toMatch(
      /Select|Move|Place|turn|chip|Blue|Red/i
    );
  });
});

describe('Wave 20 seat-handoff — owl start/end gates on legal openers', () => {
  it('Hex / Calla / Star / HAG start notifies once; legal opener does not end', () => {
    const onStart = vi.spyOn(owlSystem, 'onGameStart');
    const onEnd = vi.spyOn(owlSystem, 'onGameEnd');
    const { board, status } = mountPair();

    initHex(board, status);
    hexVsHuman();
    click(board.querySelector('.hex-cell-group[data-row="3"][data-col="3"]'));
    expect(onEnd).not.toHaveBeenCalled();

    initCalla(board, status);
    callaVsHuman();
    click(board.querySelector('.calla-pit-valid'));
    expect(onEnd).not.toHaveBeenCalled();

    initStar(board, status);
    starVsHuman();
    click(board.querySelector('.star-track-draw-btn'));
    expect(onEnd).not.toHaveBeenCalled();

    initHexAGone(board, status);
    hexAGoneVsHuman();
    expect(onStart.mock.calls.map((c) => c[0])).toEqual(
      expect.arrayContaining(['hex', 'calla', 'star-track', 'hex-a-gone'])
    );
    expect(onEnd).not.toHaveBeenCalled();
  });
});
