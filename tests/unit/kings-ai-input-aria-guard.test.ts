/**
 * Kings — AI-seat input lock + aria honesty (board UI layer).
 * Mirrors Hex #383 / Kwatro #378: no actionable targets or state changes
 * while the computer thinks.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  createInitialGameState,
  selectKing,
  moveKing,
  placeQuadraphage,
} from '../../src/games/kings-quadraphages/game-state';
import { renderBoard } from '../../src/games/kings-quadraphages/board-ui';
import {
  applyGameModeChrome,
  clearGameModeChrome,
} from '../../src/ui/player-colors';

function humanCompletesOpeningTurn() {
  let state = createInitialGameState();
  state = selectKing(state);
  state = moveKing(state, { row: 2, col: 5 });
  state = placeQuadraphage(state, { row: 1, col: 1 });
  expect(state.currentPlayer).toBe('player2');
  return state;
}

describe('Kings a11y during AI seat', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('omits valid move / placement aria while it is the AI seat', () => {
    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    applyGameModeChrome(app, 'human-vs-ai', 'player2');

    let state = humanCompletesOpeningTurn();
    state = selectKing(state);
    expect(state.selectedKingPosition).toEqual({ row: 9, col: 5 });

    const el = document.createElement('div');
    renderBoard(state, el, () => undefined);

    expect(el.querySelector('[aria-label*="valid move"]')).toBeNull();
    expect(el.querySelector('[aria-label*="valid placement"]')).toBeNull();
    expect(el.querySelectorAll('.cell-valid-move')).toHaveLength(0);
    expect(el.querySelectorAll('.cell-valid-placement')).toHaveLength(0);

    clearGameModeChrome(app);
  });

  it('still announces valid move on the human turn vs AI', () => {
    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    applyGameModeChrome(app, 'human-vs-ai', 'player2');

    const state = selectKing(createInitialGameState());
    const el = document.createElement('div');
    renderBoard(state, el, () => undefined);

    expect(
      el
        .querySelector('.cell[data-row="2"][data-col="5"]')
        ?.getAttribute('aria-label')
    ).toMatch(/valid move/);
    expect(el.querySelectorAll('.cell-valid-move').length).toBeGreaterThan(0);

    clearGameModeChrome(app);
  });

  it('omits valid placement aria in place phase on the AI seat', () => {
    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    applyGameModeChrome(app, 'human-vs-ai', 'player2');

    let state = humanCompletesOpeningTurn();
    state = selectKing(state);
    state = moveKing(state, { row: 8, col: 5 });
    expect(state.turnPhase).toBe('placeQuadraphage');
    expect(state.currentPlayer).toBe('player2');

    const el = document.createElement('div');
    renderBoard(state, el, () => undefined);

    expect(el.querySelector('[aria-label*="valid placement"]')).toBeNull();
    expect(el.querySelectorAll('.cell-valid-placement')).toHaveLength(0);

    clearGameModeChrome(app);
  });
});

describe('Kings AI-turn input guard', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = '';
  });

  it('ignores human cell clicks during the AI think pause', async () => {
    const {
      initGame,
      newGameVsAI,
      destroyGame,
      getGameState,
    } = await import('../../src/games/kings-quadraphages/game-controller');

    const app = document.createElement('div');
    app.id = 'app';
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(app, board, status);

    initGame(board, status);
    newGameVsAI('easy', true);

    // Human opening turn: select E1 king → E2 → place on A1
    board
      .querySelector('.cell[data-row="1"][data-col="5"]')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    board
      .querySelector('.cell[data-row="2"][data-col="5"]')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    board
      .querySelector('.cell[data-row="1"][data-col="1"]')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    const afterHuman = getGameState();
    expect(afterHuman.currentPlayer).toBe('player2');
    expect(afterHuman.moveHistory).toHaveLength(2);
    expect(status.textContent).toMatch(/AI is thinking/);

    const historyLen = afterHuman.moveHistory.length;
    const snapshot = structuredClone(afterHuman);

    // During the 500ms think pause, board clicks must not mutate state.
    board
      .querySelector('.cell[data-row="9"][data-col="5"]')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    board
      .querySelector('.cell[data-row="8"][data-col="5"]')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    board
      .querySelector('.cell[data-row="9"][data-col="1"]')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    const midThink = getGameState();
    expect(midThink.currentPlayer).toBe('player2');
    expect(midThink.moveHistory).toHaveLength(historyLen);
    expect(midThink.selectedKingPosition).toEqual(snapshot.selectedKingPosition);
    expect(midThink.turnPhase).toBe(snapshot.turnPhase);
    expect(status.textContent).toMatch(/AI is thinking/);

    await vi.advanceTimersByTimeAsync(500);
    await vi.advanceTimersByTimeAsync(300);

    const afterAi = getGameState();
    expect(afterAi.currentPlayer).toBe('player1');
    expect(afterAi.moveHistory.length).toBeGreaterThan(historyLen);
    expect(afterAi.moveHistory[historyLen]?.player).toBe('player2');

    destroyGame();
  });
});
