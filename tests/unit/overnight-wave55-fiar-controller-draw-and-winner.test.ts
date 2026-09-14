/**
 * Wave 55 leftover after #249/#250 — FIAR draw / winner controller banners. Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import {
  initGame,
  getCurrentState,
} from '../../src/games/fiar/game-controller';
import { owlSystem } from '../../src/core/owl';
import { CONFIG } from '../../src/games/fiar/types';

afterEach(() => {
  vi.restoreAllMocks();
  document.body.innerHTML = '';
  document.getElementById('fiar-styles')?.remove();
});

describe('Wave 55 fiar — draw and winner banners', () => {
  it('jammed movement paints Draw copy; winning move paints banner and notifies owl', () => {
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.appendChild(board);
    document.body.appendChild(status);
    initGame(board, status);

    const jammed = getCurrentState();
    for (const [id, n] of jammed.board.nodes) {
      jammed.board.nodes.set(id, { ...n, chip: 'player2' });
    }
    jammed.phase = 'movement';
    jammed.chipsPlaced = {
      player1: CONFIG.CHIPS_PER_PLAYER,
      player2: CONFIG.CHIPS_PER_PLAYER,
    };
    jammed.currentPlayer = 'player1';
    jammed.selectedNode = '2-2';
    jammed.winner = null;

    // Re-click selected opponent node → selectChip identity + render → draw banner
    board.querySelector('[data-node-id="2-2"]')!.dispatchEvent(
      new MouseEvent('click', { bubbles: true })
    );
    expect(status.textContent).toMatch(/Draw! No valid moves available/);

    initGame(board, status);
    const owl = vi.spyOn(owlSystem, 'onGameEnd');
    const live = getCurrentState();
    for (const [id, n] of live.board.nodes) {
      live.board.nodes.set(id, { ...n, chip: null });
    }
    for (const id of ['0-0', '1-0', '2-0', '4-0']) {
      live.board.nodes.set(id, {
        ...live.board.nodes.get(id)!,
        chip: 'player1',
      });
    }
    for (const id of ['0-4', '1-4', '2-4', '3-4']) {
      live.board.nodes.set(id, {
        ...live.board.nodes.get(id)!,
        chip: 'player2',
      });
    }
    live.phase = 'movement';
    live.chipsPlaced = {
      player1: CONFIG.CHIPS_PER_PLAYER,
      player2: CONFIG.CHIPS_PER_PLAYER,
    };
    live.currentPlayer = 'player1';
    live.selectedNode = null;
    live.winner = null;

    board.querySelector('[data-node-id="4-0"]')!.dispatchEvent(
      new MouseEvent('click', { bubbles: true })
    );
    expect(getCurrentState().selectedNode).toBe('4-0');
    board.querySelector('[data-node-id="3-0"]')!.dispatchEvent(
      new MouseEvent('click', { bubbles: true })
    );
    expect(getCurrentState().winner).toBe('player1');
    expect(status.querySelector('.fiar-winner-banner')?.textContent).toMatch(
      /Blue wins!/
    );
    expect(owl).toHaveBeenCalledWith('fiar', {
      winner: 'player1',
      moveCount: expect.any(Number),
    });

    const hist = getCurrentState().moveHistory.length;
    board.querySelector('[data-node-id="2-2"]')!.dispatchEvent(
      new MouseEvent('click', { bubbles: true })
    );
    expect(getCurrentState().moveHistory.length).toBe(hist);
  });
});
