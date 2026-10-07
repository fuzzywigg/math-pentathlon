/**
 * Playtest polish: FIAR move-phase clarity + ≥44px tablet hit targets.
 */
import { describe, it, expect, afterEach } from 'vitest';
import {
  initGame,
  getCurrentState,
} from '../../src/games/fiar/game-controller';
import { CONFIG } from '../../src/games/fiar/types';
import {
  injectFiarStyles,
  renderBoard,
} from '../../src/games/fiar/board-ui';
import { createInitialState } from '../../src/games/fiar/types';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('fiar-styles')?.remove();
});

function forgeMovement(): void {
  const s = getCurrentState();
  for (const [id, n] of s.board.nodes) {
    s.board.nodes.set(id, { ...n, chip: null });
  }
  s.board.nodes.set('c2r1', { ...s.board.nodes.get('c2r1')!, chip: 'player1' });
  s.board.nodes.set('c6r1', { ...s.board.nodes.get('c6r1')!, chip: 'player1' });
  s.board.nodes.set('c2r3', { ...s.board.nodes.get('c2r3')!, chip: 'player1' });
  s.board.nodes.set('c6r3', { ...s.board.nodes.get('c6r3')!, chip: 'player1' });
  s.board.nodes.set('c2r5', { ...s.board.nodes.get('c2r5')!, chip: 'player2' });
  s.board.nodes.set('c6r5', { ...s.board.nodes.get('c6r5')!, chip: 'player2' });
  s.board.nodes.set('c4r1', { ...s.board.nodes.get('c4r1')!, chip: 'player2' });
  s.board.nodes.set('c4r5', { ...s.board.nodes.get('c4r5')!, chip: 'player2' });
  s.phase = 'movement';
  s.chipsPlaced = {
    player1: CONFIG.CHIPS_PER_PLAYER,
    player2: CONFIG.CHIPS_PER_PLAYER,
  };
  s.currentPlayer = 'player1';
  s.selectedNode = null;
  s.winner = null;
}

describe('FIAR move-phase clarity + touch targets', () => {
  it('shows a Move phase banner and move-phase status copy', () => {
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    forgeMovement();
    // Trigger controller render by selecting a chip
    board
      .querySelector('[data-node-id="c2r1"]')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true }));

    const banner = status.querySelector(
      '.fiar-phase-banner[data-phase="movement"]'
    );
    expect(banner?.textContent?.trim()).toBe('Move phase');
    expect(status.querySelector('.fiar-status')?.textContent).toMatch(
      /Move phase/
    );
    expect(status.querySelector('.fiar-status')?.textContent).toMatch(
      /Click a green node/
    );
  });

  it('ships NODE_HIT_RADIUS ≥ 22 (44px diameter) and transparent hit discs', () => {
    expect(CONFIG.NODE_HIT_RADIUS * 2).toBeGreaterThanOrEqual(44);
    const svg = renderBoard(createInitialState(), () => undefined);
    const hits = svg.querySelectorAll('[data-hit-target="1"]');
    expect(hits.length).toBeGreaterThan(0);
    expect(hits[0]!.getAttribute('r')).toBe(String(CONFIG.NODE_HIT_RADIUS));
    expect(hits[0]!.getAttribute('fill')).toBe('transparent');
  });

  it('injector includes coarse-pointer board enlarge and phase banner styles', () => {
    injectFiarStyles();
    const css = document.getElementById('fiar-styles')?.textContent ?? '';
    expect(css).toMatch(/@media \(pointer:\s*coarse\)/);
    expect(css).toMatch(/min-height:\s*520px/);
    expect(css).toMatch(/\.fiar-phase-banner/);
    expect(css).toMatch(/data-phase="movement"/);
  });
});
