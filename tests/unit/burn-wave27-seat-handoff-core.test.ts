/**
 * Wave 27 — legal controller seat-handoffs (DOM click → phase/seat/status).
 * Revives never-merged #119/#121/#132 after #138 success-playthroughs + #139 contig + #140 a11y.
 * Distinct from persist/serialize (#120), inventory (#131), success (#138), contiguous (#139).
 * Tests-only. Existing games only — no product inventing.
 *
 * q-mp-1096: leaner mounts / shared setup + thinner import surface.
 * This shard: Hex / Calla / FIAR. Sibling shards:
 *   burn-wave27-seat-handoff-phase.test.ts (Star / HAG / Queens / Contig / Juggle / Kings)
 *   burn-wave27-seat-handoff-place.test.ts
 * initGame already starts HvsH — no redundant vsHuman.
 * Owl start/end gates folded into Hex/Calla openers (same asserts).
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
  getGameState as getCallaState,
} from '../../src/games/calla/game-controller';
import {
  initGame as initFiar,
  newGameVsHuman as fiarVsHuman,
  getCurrentState as getFiarState,
} from '../../src/games/fiar/game-controller';

import { mountPair } from '../helpers/mount-pair';
import { click } from '../helpers/dom-click';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('Wave 27 seat-handoff — Hex legal click flips seat + status', () => {
  it('empty cell grows history, flips seat; re-click no-op; second cell returns P1', () => {
    const onEnd = vi.spyOn(owlSystem, 'onGameEnd');
    const onStart = vi.spyOn(owlSystem, 'onGameStart');
    const { board, status } = mountPair();
    initHex(board, status);
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

    // Shared mount reset — second empty-cell seat return (same asserts)
    hexVsHuman();
    click(board.querySelector('.hex-cell-group[data-row="0"][data-col="0"]'));
    expect(getHexState().currentPlayer).toBe('player2');
    click(board.querySelector('.hex-cell-group[data-row="0"][data-col="1"]'));
    expect(getHexState().currentPlayer).toBe('player1');
    expect(getHexState().moveHistory.length).toBe(2);
    expect(status.querySelector('.status-turn')?.textContent).toMatch(
      /Blue|Player 1|turn/i
    );
  });
});

describe('Wave 27 seat-handoff — Calla valid pit advances history/status', () => {
  it('valid P1 pit click records a move and refreshes status chrome', () => {
    const onStart = vi.spyOn(owlSystem, 'onGameStart');
    const onEnd = vi.spyOn(owlSystem, 'onGameEnd');
    const { board, status } = mountPair();
    initCalla(board, status);
    expect(onStart).toHaveBeenCalledWith('calla');

    const before = getCallaState().moveHistory.length;
    const pit = board.querySelector(
      '.calla-pit-p1.calla-pit-valid, .calla-pit[data-side="player1"].calla-pit-valid'
    );
    click(pit);

    expect(getCallaState().moveHistory.length).toBeGreaterThan(before);
    expect(
      status.querySelector('.status-turn, .calla-status, .calla-scores')
    ).toBeTruthy();
    expect(getCallaState().winner).toBeNull();
    expect(getCallaState().phase).not.toBe('gameOver');
    expect(onEnd).not.toHaveBeenCalled();
  });

  it('empty invalid pit does not grow history (contrast to legal)', () => {
    const { board, status } = mountPair();
    initCalla(board, status);
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

describe('Wave 27 seat-handoff — FIAR place flips seat; re-click no-op', () => {
  it('first node place flips to player2; second empty node returns P1', () => {
    const { board, status } = mountPair();
    initFiar(board, status);

    const node = board.querySelector('[data-node-id]');
    click(node);
    expect(getFiarState().moveHistory.length).toBe(1);
    expect(getFiarState().chipsPlaced.player1).toBe(1);
    expect(getFiarState().currentPlayer).toBe('player2');
    expect(status.querySelector('.fiar-status')?.textContent).toMatch(
      /Red|Player 2|turn/i
    );

    click(node);
    expect(getFiarState().moveHistory.length).toBe(1);
    expect(getFiarState().currentPlayer).toBe('player2');

    // Shared mount reset — second empty node returns seat
    fiarVsHuman();
    const nodes = [...board.querySelectorAll('[data-node-id]')];
    expect(nodes.length).toBeGreaterThanOrEqual(2);
    click(nodes[0]);
    expect(getFiarState().currentPlayer).toBe('player2');
    const next = nodes.find(
      (n) => n !== nodes[0] && !n.classList.contains('occupied')
    );
    click(next ?? nodes[1]);
    expect(getFiarState().moveHistory.length).toBe(2);
    expect(getFiarState().currentPlayer).toBe('player1');
  });
});
