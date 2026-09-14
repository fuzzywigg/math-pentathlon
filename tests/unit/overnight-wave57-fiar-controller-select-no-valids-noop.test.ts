/**
 * Wave 57 leftover after #257 — FIAR select chip with zero valid moves. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import {
  initGame,
  getCurrentState,
} from '../../src/games/fiar/game-controller';
import { CONFIG } from '../../src/games/fiar/types';
import { getValidMoves } from '../../src/games/fiar/rules';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('fiar-styles')?.remove();
});

function forgeBlockedCenter(): void {
  const s = getCurrentState();
  for (const [id, n] of s.board.nodes) {
    s.board.nodes.set(id, { ...n, chip: null });
  }
  // P1 at center; ring of blockers on all 8 neighbors → no valid moves
  s.board.nodes.set('2-2', { ...s.board.nodes.get('2-2')!, chip: 'player1' });
  for (const id of ['1-1', '1-2', '1-3', '2-1', '2-3', '3-1', '3-2', '3-3']) {
    s.board.nodes.set(id, {
      ...s.board.nodes.get(id)!,
      chip:
        id === '1-1' || id === '1-3' || id === '3-1' ? 'player1' : 'player2',
    });
  }
  s.phase = 'movement';
  s.chipsPlaced = {
    player1: CONFIG.CHIPS_PER_PLAYER,
    player2: CONFIG.CHIPS_PER_PLAYER,
  };
  s.currentPlayer = 'player1';
  s.selectedNode = null;
  s.winner = null;
}

describe('Wave 57 fiar — select no valids noop', () => {
  it('own chip with zero valid moves stays unselected', () => {
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    forgeBlockedCenter();

    expect(getValidMoves(getCurrentState(), '2-2')).toHaveLength(0);

    // Force a movement-phase render via a mobile own chip, then deselect
    board
      .querySelector('[data-node-id="1-1"]')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(getCurrentState().selectedNode).toBe('1-1');
    board
      .querySelector('[data-node-id="1-1"]')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(getCurrentState().selectedNode).toBeNull();
    expect(status.querySelector('.fiar-status')?.textContent).toMatch(
      /Select a chip to move/
    );

    board
      .querySelector('[data-node-id="2-2"]')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(getCurrentState().selectedNode).toBeNull();
    expect(status.querySelector('.fiar-status')?.textContent).toMatch(
      /Select a chip to move/
    );
  });
});
