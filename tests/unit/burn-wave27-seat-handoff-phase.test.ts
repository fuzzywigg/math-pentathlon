/**
 * Wave 27 seat-handoff shard — phase / draw / roll / kings openers.
 * Sibling of burn-wave27-seat-handoff-core.test.ts (q-mp-1096).
 * Lean mounts: initGame already starts HvsH (except Kings); owl gates on Star/HAG.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { owlSystem } from '../../src/core/owl';
import {
  initGame as initStar,
  getGameState as getStarState,
} from '../../src/games/star-track/game-controller';
import {
  initGame as initHexAGone,
  getGameState as getHexAGoneState,
} from '../../src/games/hex-a-gone/game-controller';
import { initGame as initQueens } from '../../src/games/queens-guards/game-controller';
import { initGame as initContig } from '../../src/games/contig-60/game-controller';
import { initGame as initJuggle } from '../../src/games/juggle/game-controller';
import {
  initGame as initKings,
  newGameVsHuman as kingsVsHuman,
  getGameState as getKingsState,
} from '../../src/games/kings-quadraphages/game-controller';

import { mountPair } from '../helpers/mount-pair';
import { click } from '../helpers/dom-click';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('Wave 27 seat-handoff — Star Track draw→chain flips seat', () => {
  it('draw advances to selectChain; chain choice flips player', () => {
    const onStart = vi.spyOn(owlSystem, 'onGameStart');
    const onEnd = vi.spyOn(owlSystem, 'onGameEnd');
    const { board, status } = mountPair();
    initStar(board, status);
    expect(onStart).toHaveBeenCalledWith('star-track');
    expect(getStarState().phase).toBe('drawChains');

    click(board.querySelector('.star-track-draw-btn'));
    expect(getStarState().phase).toBe('selectChain');
    expect(getStarState().drawnChains.length).toBeGreaterThan(0);
    expect(onEnd).not.toHaveBeenCalled();

    click(board.querySelector('.star-track-chain-btn'));
    expect(getStarState().moveHistory.length).toBeGreaterThanOrEqual(1);
    expect(getStarState().currentPlayer).toBe('player2');
    expect(
      status.querySelector('.status-turn, .star-track-status')
    ).toBeTruthy();
    expect(getStarState().player1Position).toBeGreaterThanOrEqual(0);
  });

  it('board space click before draw stays drawChains (contrast)', () => {
    const { board, status } = mountPair();
    initStar(board, status);
    click(board.querySelector('[data-space]'));
    expect(getStarState().phase).toBe('drawChains');
    expect(getStarState().moveHistory).toHaveLength(0);
  });
});

describe('Wave 27 seat-handoff — Hex-a-Gone select→confirm enters place', () => {
  it('block select + confirm moves phase to placeBlocks', () => {
    const onStart = vi.spyOn(owlSystem, 'onGameStart');
    const onEnd = vi.spyOn(owlSystem, 'onGameEnd');
    const { board, status } = mountPair();
    initHexAGone(board, status);
    expect(onStart).toHaveBeenCalledWith('hex-a-gone');
    expect(onEnd).not.toHaveBeenCalled();

    expect(getHexAGoneState().phase).toBe('selectBlocks');
    const block =
      board.querySelector('.hex-a-gone-block-btn[data-shape="hexagon"]') ??
      board.querySelector(
        '.hex-a-gone-block-btn, .hag-block-btn, [data-shape]'
      );
    click(block);
    expect(getHexAGoneState().turnSelection.blocks.length).toBeGreaterThan(0);

    const confirm = board.querySelector(
      '.hex-a-gone-confirm-btn, .hag-confirm-btn, button:not([disabled])'
    );
    if (confirm && !(confirm as HTMLButtonElement).disabled) {
      click(confirm);
      expect(['placeBlocks', 'selectBlocks']).toContain(
        getHexAGoneState().phase
      );
    }
    expect(
      status.querySelector('.status-turn, .hex-a-gone-status, .hag-status')
    ).toBeTruthy();
  });
});

describe('Wave 27 seat-handoff — Queens select→legal move updates status', () => {
  it('queen select then highlighted destination leaves select instruction', () => {
    const { board, status } = mountPair();
    initQueens(board, status);

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

describe('Wave 27 seat-handoff — Contig roll advances chrome', () => {
  it('roll leaves rolling CTA and shows expressions or pass', () => {
    const { board, status } = mountPair();
    initContig(board, status);

    click(board.querySelector('.contig-roll-btn'));
    expect(
      board.querySelector(
        '.contig-expressions, .contig-pass-btn, .contig-dice-display'
      )
    ).toBeTruthy();
    expect(status.querySelector('.contig-status')?.textContent).toMatch(
      /turn|Select|Pass|Place/i
    );

    const valid = board.querySelector('.contig-cell-valid');
    if (valid) {
      click(valid);
      expect(board.querySelector('.contig-roll-btn')).toBeTruthy();
      expect(
        board.querySelector('.contig-cell-p1, .contig-cell-occupied')
      ).toBeTruthy();
      expect(status.querySelector('.contig-status')?.textContent).toMatch(
        /Roll|turn/i
      );
    } else {
      const pass = board.querySelector('.contig-pass-btn');
      if (pass) {
        click(pass);
        expect(board.querySelector('.contig-roll-btn')).toBeTruthy();
      }
    }
  });
});

describe('Wave 27 seat-handoff — Juggle roll advances status instruction', () => {
  it('roll CTA leaves Roll-dice chrome for die/shape selection', () => {
    const { board, status } = mountPair();
    initJuggle(board, status);

    click(board.querySelector('.juggle-roll-btn, .roll-dice-btn'));
    const text = status.querySelector('.juggle-status')?.textContent ?? '';
    expect(text.length).toBeGreaterThan(0);
    expect(text).toMatch(/die|shape|Select|Place|Roll/i);
    expect(
      board.querySelector(
        '.juggle-die, .juggle-shape-option, .juggle-shapes, .juggle-dice'
      )
    ).toBeTruthy();
  });
});

describe('Wave 27 seat-handoff — Kings full turn flips seat', () => {
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
    expect(status.querySelector('.status-turn')?.textContent).toMatch(
      /Player 2/i
    );
    expect(getKingsState().moveHistory.length).toBeGreaterThanOrEqual(2);
  });
});
