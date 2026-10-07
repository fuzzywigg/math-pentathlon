/**
 * Deep playtest UX guards — touch floors, status copy, pass hint, AI chrome.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { newGameVsAI, newGameVsHuman } from '../../src/games/par-55/game-controller';
import {
  createInitialState,
  selectBlock,
  getValidPlacements,
} from '../../src/games/par-55/rules';
import { injectPar55Styles, renderBoard } from '../../src/games/par-55/board-ui';
import { CONFIG } from '../../src/games/par-55/types';

describe('Par 55 deep playtest UX', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('par55-styles')?.remove();
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = '';
    document.getElementById('par55-styles')?.remove();
  });

  it('injects 44px button/hand floors and coarse-pointer rules', () => {
    injectPar55Styles();
    const css = document.getElementById('par55-styles')?.textContent ?? '';
    expect(css).toMatch(/\.par55-btn\s*\{[^}]*min-height:\s*44px/s);
    expect(css).toMatch(/\.par55-hand-block\s*\{[^}]*min-height:\s*44px/s);
    expect(css).toMatch(/@media\s*\(pointer:\s*coarse\)/);
    expect(css).toMatch(/prefers-reduced-motion:\s*reduce/);
    expect(css).toMatch(/#app:has\(\.par55-board\)/);
    expect(css).toMatch(/overflow-x:\s*visible/);
  });

  it('desktop side-hands remain hittable inside widened #app', () => {
    injectPar55Styles();
    const app = document.createElement('div');
    app.id = 'app';
    // Mimic shell clip + narrow column that previously ate left-hand hits.
    app.style.maxWidth = '700px';
    app.style.overflowX = 'clip';
    app.style.margin = '0 auto';
    document.body.appendChild(app);
    const root = document.createElement('div');
    app.appendChild(root);
    newGameVsHuman(root);

    const hand = root.querySelector(
      '.par55-hand-block.clickable'
    ) as HTMLElement;
    expect(hand).toBeTruthy();
    hand.click();
    expect(root.querySelector('.par55-status')?.textContent).toMatch(
      /Tap a green base to place/
    );
    expect(root.querySelectorAll('.par55-valid-base').length).toBeGreaterThan(0);
  });

  it('valid bases include a 44px hit circle', () => {
    let state = createInitialState();
    state = selectBlock(state, state.hands.player1[0]!.id);
    expect(getValidPlacements(state).length).toBeGreaterThan(0);
    const board = renderBoard(state, () => undefined);
    const hit = board.querySelector('.par55-base-hit');
    expect(hit).toBeTruthy();
    expect(hit?.getAttribute('r')).toBe('22');
  });

  it('shows pass hint when the human seat has no legal placements', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsHuman(root);

    // Empty the board adjacency set by filling every base and emptying hand escapes:
    // Force no valid placements via empty hand for current player.
    ctrl.state = {
      ...ctrl.state,
      hands: { ...ctrl.state.hands, player1: [] },
      phase: 'selectingBlock',
      currentPlayer: 'player1',
    };
    ctrl.update();

    expect(root.querySelector('.par55-turn-hint')?.textContent).toMatch(
      /No legal placements/
    );
    const pass = [...root.querySelectorAll('.par55-btn')].find((b) =>
      /Pass Turn/.test(b.textContent ?? '')
    );
    expect(pass).toBeTruthy();
  });

  it('AI seat paints status-ai-thinking and blocks hand clicks', () => {
    vi.useFakeTimers();
    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsAI(root, 'hard');
    ctrl.state = {
      ...ctrl.state,
      currentPlayer: 'player2',
      phase: 'selectingBlock',
    };
    ctrl.update();

    expect(root.querySelector('.par55-status')?.textContent).toMatch(
      /Computer is thinking/
    );
    expect(root.querySelector('.status-ai-thinking')).toBeTruthy();
    expect(root.querySelector('.par55-hand-block.clickable')).toBeNull();
    expect(root.querySelector('.par55-turn-hint')).toBeNull();
  });

  it('target score chrome still reads CONFIG.TARGET_SCORE', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    newGameVsHuman(root);
    expect(root.querySelector('.par55-target')?.textContent).toBe(
      `Target: ${CONFIG.TARGET_SCORE}`
    );
  });
});
