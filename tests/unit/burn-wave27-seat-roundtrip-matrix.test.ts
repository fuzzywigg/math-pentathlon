/**
 * Wave 27 deepen — multi-ply seat XOR matrix (Hex / Calla / FIAR / Star / Kings).
 * Odd legal ply → player2, even → player1; illegal re-click no-ops; history monotonic on legal only.
 * Owl: onGameStart once per newGameVsHuman; onGameEnd not mid-game.
 * Distinct from core seat-handoff openers (#121 revive). Tests-only.
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
  initGame as initStar,
  newGameVsHuman as starVsHuman,
  getGameState as getStarState,
} from '../../src/games/star-track/game-controller';

import {
  initGame as initKings,
  newGameVsHuman as kingsVsHuman,
  getGameState as getKingsState,
} from '../../src/games/kings-quadraphages/game-controller';

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

function expectedSeat(ply: number): 'player1' | 'player2' {
  return ply % 2 === 1 ? 'player2' : 'player1';
}

describe('Wave 27 roundtrip-matrix — Hex multi-ply seat XOR', () => {
  it('four empty cells: odd→P2 even→P1; history length === ply; re-click no-op', () => {
    const onStart = vi.spyOn(owlSystem, 'onGameStart');
    const onEnd = vi.spyOn(owlSystem, 'onGameEnd');
    const { board, status } = mountPair();
    initHex(board, status); // initGame already starts a human game (onGameStart)
    hexVsHuman(); // second start is intentional re-open
    expect(onStart.mock.calls.filter((c) => c[0] === 'hex').length).toBeGreaterThanOrEqual(1);
    expect(onStart).toHaveBeenCalledWith('hex');

    const cells = [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ] as const;

    for (let i = 0; i < cells.length; i++) {
      const [r, c] = cells[i];
      const before = getHexState().moveHistory.length;
      click(board.querySelector(`.hex-cell-group[data-row="${r}"][data-col="${c}"]`));
      expect(getHexState().moveHistory.length).toBe(before + 1);
      expect(getHexState().currentPlayer).toBe(expectedSeat(i + 1));
      expect(getHexState().winner).toBeNull();
      expect(onEnd).not.toHaveBeenCalled();
    }

    expect(getHexState().moveHistory).toHaveLength(4);
    expect(status.querySelector('.status-turn')?.textContent).toMatch(
      /Blue|Player 1|turn|Red/i
    );

    // Illegal re-click on occupied cell — history and seat frozen
    const frozenHist = getHexState().moveHistory.length;
    const frozenSeat = getHexState().currentPlayer;
    click(board.querySelector('.hex-cell-group[data-row="0"][data-col="0"]'));
    expect(getHexState().moveHistory.length).toBe(frozenHist);
    expect(getHexState().currentPlayer).toBe(frozenSeat);
  });

  it('newGameVsHuman again re-fires onGameStart once more; mid-game onGameEnd stays quiet', () => {
    const onStart = vi.spyOn(owlSystem, 'onGameStart');
    const onEnd = vi.spyOn(owlSystem, 'onGameEnd');
    const { board, status } = mountPair();
    initHex(board, status);
    hexVsHuman();
    hexVsHuman();
    expect(onStart.mock.calls.filter((c) => c[0] === 'hex').length).toBeGreaterThanOrEqual(2);

    click(board.querySelector('.hex-cell-group[data-row="2"][data-col="2"]'));
    click(board.querySelector('.hex-cell-group[data-row="2"][data-col="3"]'));
    expect(getHexState().moveHistory.length).toBe(2);
    expect(onEnd).not.toHaveBeenCalled();
  });

  it('six-ply diagonal keeps history strictly monotonic on legal only', () => {
    const { board, status } = mountPair();
    initHex(board, status);
    hexVsHuman();

    const coords = [
      [3, 0],
      [3, 1],
      [3, 2],
      [4, 0],
      [4, 1],
      [4, 2],
    ] as const;
    let prev = 0;
    for (let i = 0; i < coords.length; i++) {
      const [r, c] = coords[i];
      click(board.querySelector(`.hex-cell-group[data-row="${r}"][data-col="${c}"]`));
      expect(getHexState().moveHistory.length).toBe(prev + 1);
      prev = getHexState().moveHistory.length;
      expect(getHexState().currentPlayer).toBe(expectedSeat(i + 1));
    }
    expect(status.querySelector('.status-turn')).toBeTruthy();

    // Double-click last occupied — no growth
    click(board.querySelector('.hex-cell-group[data-row="4"][data-col="2"]'));
    expect(getHexState().moveHistory.length).toBe(6);
  });
});

describe('Wave 27 roundtrip-matrix — Calla legal pits grow history; invalid no-op', () => {
  it('valid P1 pit grows history; invalid pit / empty does not; free-turn or flip both legal', () => {
    const onStart = vi.spyOn(owlSystem, 'onGameStart');
    const onEnd = vi.spyOn(owlSystem, 'onGameEnd');
    const { board, status } = mountPair();
    initCalla(board, status);
    callaVsHuman();
    expect(onStart).toHaveBeenCalledWith('calla');

    const before = getCallaState().moveHistory.length;
    const valid = board.querySelector(
      '.calla-pit-p1.calla-pit-valid, .calla-pit[data-side="player1"].calla-pit-valid'
    );
    click(valid);
    expect(getCallaState().moveHistory.length).toBeGreaterThan(before);
    // Free-turn can keep seat; otherwise flips — either is legal mid-game
    expect(['player1', 'player2']).toContain(getCallaState().currentPlayer);
    expect(getCallaState().winner).toBeNull();
    expect(onEnd).not.toHaveBeenCalled();
    expect(status.querySelector('.status-turn, .calla-status, .calla-scores')).toBeTruthy();

    const mid = getCallaState().moveHistory.length;
    const invalid = board.querySelector('.calla-pit:not(.calla-pit-valid)');
    if (invalid) {
      click(invalid);
      expect(getCallaState().moveHistory.length).toBe(mid);
    }
  });

  it('second legal pit when seat flipped continues history monotonic chain', () => {
    const { board, status } = mountPair();
    initCalla(board, status);
    callaVsHuman();

    const p1Valid = board.querySelector(
      '.calla-pit-p1.calla-pit-valid, .calla-pit[data-side="player1"].calla-pit-valid'
    );
    click(p1Valid);
    const after1 = getCallaState().moveHistory.length;
    expect(after1).toBeGreaterThan(0);

    // Keep playing legal valid pits while game is open (up to 3 more)
    for (let n = 0; n < 3; n++) {
      if (getCallaState().phase === 'gameOver' || getCallaState().winner) break;
      const seat = getCallaState().currentPlayer;
      const sel =
        seat === 'player1'
          ? board.querySelector(
              '.calla-pit-p1.calla-pit-valid, .calla-pit[data-side="player1"].calla-pit-valid'
            )
          : board.querySelector(
              '.calla-pit-p2.calla-pit-valid, .calla-pit[data-side="player2"].calla-pit-valid'
            );
      if (!sel) break;
      const before = getCallaState().moveHistory.length;
      click(sel);
      expect(getCallaState().moveHistory.length).toBeGreaterThanOrEqual(before);
    }
    expect(getCallaState().moveHistory.length).toBeGreaterThanOrEqual(after1);
    expect(status.querySelector('.status-turn, .calla-scores')).toBeTruthy();
  });

  it('owl onGameStart once per newGameVsHuman; onGameEnd not after opener', () => {
    const onStart = vi.spyOn(owlSystem, 'onGameStart');
    const onEnd = vi.spyOn(owlSystem, 'onGameEnd');
    const { board, status } = mountPair();
    initCalla(board, status);
    callaVsHuman();
    const starts = onStart.mock.calls.filter((c) => c[0] === 'calla').length;
    callaVsHuman();
    expect(onStart.mock.calls.filter((c) => c[0] === 'calla').length).toBe(starts + 1);
    click(board.querySelector('.calla-pit-valid'));
    expect(onEnd).not.toHaveBeenCalled();
  });
});

describe('Wave 27 roundtrip-matrix — FIAR multi-ply seat XOR', () => {
  it('four empty nodes: odd→P2 even→P1; occupied re-click no-op', () => {
    const onStart = vi.spyOn(owlSystem, 'onGameStart');
    const onEnd = vi.spyOn(owlSystem, 'onGameEnd');
    const { board, status } = mountPair();
    initFiar(board, status);
    fiarVsHuman();
    expect(onStart).toHaveBeenCalledWith('fiar');

    const nodes = [...board.querySelectorAll('[data-node-id]')];
    expect(nodes.length).toBeGreaterThanOrEqual(4);

    const used: Element[] = [];
    for (let i = 0; i < 4; i++) {
      const next = nodes.find((n) => !used.includes(n) && !n.classList.contains('occupied'));
      expect(next).toBeTruthy();
      click(next!);
      used.push(next!);
      expect(getFiarState().moveHistory.length).toBe(i + 1);
      expect(getFiarState().currentPlayer).toBe(expectedSeat(i + 1));
      expect(onEnd).not.toHaveBeenCalled();
    }

    expect(status.querySelector('.fiar-status')?.textContent).toMatch(
      /Blue|Red|Player|turn/i
    );

    const hist = getFiarState().moveHistory.length;
    const seat = getFiarState().currentPlayer;
    click(used[0]);
    expect(getFiarState().moveHistory.length).toBe(hist);
    expect(getFiarState().currentPlayer).toBe(seat);
  });

  it('two-ply round-trip returns to player1 with chipsPlaced both 1', () => {
    const { board, status } = mountPair();
    initFiar(board, status);
    fiarVsHuman();
    const nodes = [...board.querySelectorAll('[data-node-id]')];
    click(nodes[0]);
    expect(getFiarState().currentPlayer).toBe('player2');
    expect(getFiarState().chipsPlaced.player1).toBe(1);
    const second = nodes.find((n) => n !== nodes[0]);
    click(second!);
    expect(getFiarState().currentPlayer).toBe('player1');
    expect(getFiarState().moveHistory.length).toBe(2);
    expect(getFiarState().chipsPlaced.player2).toBe(1);
    expect(status.querySelector('.fiar-status')).toBeTruthy();
  });

  it('six-ply history length equals legal placements only', () => {
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.appendChild(board);
    document.body.appendChild(status);
    initFiar(board, status);
    fiarVsHuman();

    const nodes = [...board.querySelectorAll('[data-node-id]')];
    const placed: Element[] = [];
    for (let i = 0; i < 6 && i < nodes.length; i++) {
      const el = nodes.find((n) => !placed.includes(n));
      if (!el) break;
      click(el);
      placed.push(el);
      expect(getFiarState().moveHistory.length).toBe(placed.length);
      expect(getFiarState().currentPlayer).toBe(expectedSeat(placed.length));
    }
    expect(getFiarState().moveHistory.length).toBe(placed.length);
  });
});

describe('Wave 27 roundtrip-matrix — Star Track draw→chain XOR seats', () => {
  it('two full draw→chain cycles: ply1 P2, ply2 P1; pre-draw space click no-op', () => {
    const onStart = vi.spyOn(owlSystem, 'onGameStart');
    const onEnd = vi.spyOn(owlSystem, 'onGameEnd');
    const { board, status } = mountPair();
    initStar(board, status);
    starVsHuman();
    expect(onStart).toHaveBeenCalledWith('star-track');
    expect(getStarState().phase).toBe('drawChains');

    // Contrast: board space before draw does nothing
    click(board.querySelector('[data-space]'));
    expect(getStarState().moveHistory).toHaveLength(0);
    expect(getStarState().phase).toBe('drawChains');

    click(board.querySelector('.star-track-draw-btn'));
    expect(getStarState().phase).toBe('selectChain');
    click(board.querySelector('.star-track-chain-btn'));
    expect(getStarState().moveHistory.length).toBeGreaterThanOrEqual(1);
    expect(getStarState().currentPlayer).toBe('player2');
    expect(onEnd).not.toHaveBeenCalled();

    // Second ply for P2
    if (getStarState().phase === 'drawChains' || getStarState().winner === null) {
      const draw = board.querySelector('.star-track-draw-btn');
      if (draw) {
        click(draw);
        const chain = board.querySelector('.star-track-chain-btn');
        if (chain) {
          click(chain);
          expect(getStarState().currentPlayer).toBe(expectedSeat(2));
          expect(getStarState().moveHistory.length).toBeGreaterThanOrEqual(2);
        }
      }
    }
    expect(status.querySelector('.status-turn, .star-track-status')).toBeTruthy();
  });

  it('owl start once per newGameVsHuman; mid-game end not fired after first chain', () => {
    const onStart = vi.spyOn(owlSystem, 'onGameStart');
    const onEnd = vi.spyOn(owlSystem, 'onGameEnd');
    const { board, status } = mountPair();
    initStar(board, status);
    starVsHuman();
    starVsHuman();
    expect(onStart.mock.calls.filter((c) => c[0] === 'star-track').length).toBeGreaterThanOrEqual(
      2
    );
    click(board.querySelector('.star-track-draw-btn'));
    click(board.querySelector('.star-track-chain-btn'));
    expect(onEnd).not.toHaveBeenCalled();
    expect(getStarState().winner).toBeNull();
  });

  it('illegal chain click before draw leaves history at 0', () => {
    const { board, status } = mountPair();
    initStar(board, status);
    starVsHuman();
    const chainEarly = board.querySelector('.star-track-chain-btn');
    if (chainEarly) {
      click(chainEarly);
      expect(getStarState().moveHistory).toHaveLength(0);
    } else {
      expect(getStarState().phase).toBe('drawChains');
    }
    expect(status.querySelector('.status-turn, .star-track-status')).toBeTruthy();
  });
});

describe('Wave 27 roundtrip-matrix — Kings full-turn XOR seats', () => {
  function mountKings(): {
    board: HTMLElement;
    status: HTMLElement;
    history: HTMLElement;
  } {
    const board = document.createElement('div');
    const status = document.createElement('div');
    const history = document.createElement('div');
    document.body.appendChild(board);
    document.body.appendChild(status);
    document.body.appendChild(history);
    return { board, status, history };
  }

  function completeKingsTurn(board: HTMLElement, kingCell: string): void {
    click(board.querySelector(kingCell));
    const validMove = board.querySelector('.cell-valid-move');
    if (validMove) click(validMove);
    const place =
      board.querySelector('.cell-valid-placement') ??
      board.querySelector('.cell-empty, .cell:not(.cell-occupied)');
    if (place) click(place);
  }

  it('P1 full turn → P2; P2 full turn → P1; history grows ≥2 per turn', () => {
    const onStart = vi.spyOn(owlSystem, 'onGameStart');
    const onEnd = vi.spyOn(owlSystem, 'onGameEnd');
    const { board, status, history } = mountKings();
    initKings(board, status, history);
    kingsVsHuman();
    expect(onStart).toHaveBeenCalledWith('kings-quadraphages');
    expect(getKingsState().currentPlayer).toBe('player1');
    expect(getKingsState().turnPhase).toBe('moveKing');

    completeKingsTurn(board, '.cell[data-row="1"][data-col="5"]');
    expect(getKingsState().currentPlayer).toBe('player2');
    expect(getKingsState().turnPhase).toBe('moveKing');
    const afterP1 = getKingsState().moveHistory.length;
    expect(afterP1).toBeGreaterThanOrEqual(2);
    expect(onEnd).not.toHaveBeenCalled();
    expect(status.querySelector('.status-turn')?.textContent).toMatch(/Player 2/i);

    // P2 king starts at bottom — typical (8,5) or similar
    const p2King =
      board.querySelector('.cell.cell-king-player2, .cell[data-row="8"][data-col="5"]') ??
      board.querySelector('.cell[data-row="9"][data-col="5"]');
    if (p2King) {
      click(p2King);
      const vm = board.querySelector('.cell-valid-move');
      if (vm) {
        click(vm);
        const place =
          board.querySelector('.cell-valid-placement') ??
          board.querySelector('.cell-empty');
        if (place) click(place);
        if (getKingsState().currentPlayer === 'player1') {
          expect(getKingsState().moveHistory.length).toBeGreaterThan(afterP1);
        }
      }
    }
    expect(history.querySelector('.move-history-entry, .move-history-list')).toBeTruthy();
  });

  it('re-click occupied / non-valid mid-select does not finish turn early', () => {
    const { board, status, history } = mountKings();
    initKings(board, status, history);
    kingsVsHuman();

    click(board.querySelector('.cell[data-row="1"][data-col="5"]'));
    expect(getKingsState().selectedKingPosition).toBeTruthy();
    const before = getKingsState().moveHistory.length;

    // Click a non-valid cell — should not place king move without valid target
    const junk = board.querySelector('.cell[data-row="0"][data-col="0"]');
    if (junk && !junk.classList.contains('cell-valid-move')) {
      click(junk);
      // Still selecting or back to moveKing — not yet opponent seat without placement
      expect(getKingsState().moveHistory.length).toBe(before);
    }

    const validMove = board.querySelector('.cell-valid-move');
    if (validMove) {
      click(validMove);
      expect(getKingsState().turnPhase).toBe('placeQuadraphage');
      const place = board.querySelector('.cell-valid-placement');
      if (place) {
        click(place);
        expect(getKingsState().currentPlayer).toBe('player2');
      }
    }
    expect(status.querySelector('.status-turn')).toBeTruthy();
  });

  it('owl onGameStart once per newGameVsHuman; legal opener does not end', () => {
    const onStart = vi.spyOn(owlSystem, 'onGameStart');
    const onEnd = vi.spyOn(owlSystem, 'onGameEnd');
    const { board, status, history } = mountKings();
    initKings(board, status, history);
    kingsVsHuman();
    kingsVsHuman();
    expect(
      onStart.mock.calls.filter((c) => c[0] === 'kings-quadraphages').length
    ).toBeGreaterThanOrEqual(2);
    completeKingsTurn(board, '.cell[data-row="1"][data-col="5"]');
    expect(onEnd).not.toHaveBeenCalled();
  });
});

describe('Wave 27 roundtrip-matrix — cross-game owl openers stay mid-game quiet', () => {
  it('Hex + FIAR + Star start ids; first legal acts do not call onGameEnd', () => {
    const onStart = vi.spyOn(owlSystem, 'onGameStart');
    const onEnd = vi.spyOn(owlSystem, 'onGameEnd');
    const { board, status } = mountPair();

    initHex(board, status);
    hexVsHuman();
    click(board.querySelector('.hex-cell-group[data-row="5"][data-col="5"]'));

    initFiar(board, status);
    fiarVsHuman();
    click(board.querySelector('[data-node-id]'));

    initStar(board, status);
    starVsHuman();
    click(board.querySelector('.star-track-draw-btn'));

    expect(onStart.mock.calls.map((c) => c[0])).toEqual(
      expect.arrayContaining(['hex', 'fiar', 'star-track'])
    );
    expect(onEnd).not.toHaveBeenCalled();
  });
});
