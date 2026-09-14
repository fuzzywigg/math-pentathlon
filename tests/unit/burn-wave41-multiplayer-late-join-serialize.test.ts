/**
 * Overnight TOKENMAXX — multiplayer-sync leftovers: late-join.
 * Maps "late join" onto Kings save/load mid-session deserialize (P2 to move)
 * plus shell Start after waiting in lobby (join stamp).
 * Existing modules: kings serialization + game-shell. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  createInitialGameState,
  selectKing,
  moveKing,
  placeQuadraphage,
  getKingPosition,
} from '../../src/games/kings-quadraphages/game-state';
import {
  serializeGameState,
  deserializeGameState,
  gameStateToJSON,
  gameStateFromJSON,
  validateSerializedState,
  getSaveInfo,
  type SerializedGameState,
} from '../../src/games/kings-quadraphages/serialization';
import { INITIAL_QUADRAPHAGE_COUNT } from '../../src/games/kings-quadraphages/pieces';
import { BOARD_SIZE } from '../../src/games/kings-quadraphages/board';

import {
  mountGameShell,
  type GameShellElements,
} from '../../src/ui/components/game-shell';

function playHalfTurnP1() {
  let state = createInitialGameState();
  state = selectKing(state);
  state = moveKing(state, { row: 2, col: 5 });
  state = placeQuadraphage(state, { row: 3, col: 5 });
  return state;
}

function playFullRound() {
  let state = playHalfTurnP1();
  state = selectKing(state);
  state = moveKing(state, { row: 8, col: 5 });
  state = placeQuadraphage(state, { row: 7, col: 5 });
  return state;
}

describe('Wave 41 multiplayer-sync — late-join via Kings serialize', () => {
  it('late-join as P2: deserialize after P1 half-turn preserves seat + board', () => {
    const mid = playHalfTurnP1();
    expect(mid.currentPlayer).toBe('player2');
    expect(mid.player1Supply).toBe(INITIAL_QUADRAPHAGE_COUNT - 1);

    const blob = serializeGameState(mid, {
      gameName: 'late-join-p2',
      player1Name: 'Host',
      player2Name: 'Joiner',
    });
    expect(validateSerializedState(blob)).toBe(true);

    const joined = deserializeGameState(blob);
    expect(joined.currentPlayer).toBe('player2');
    expect(joined.turnPhase).toBe('moveKing');
    expect(joined.player1Supply).toBe(INITIAL_QUADRAPHAGE_COUNT - 1);
    expect(joined.player2Supply).toBe(INITIAL_QUADRAPHAGE_COUNT);
    expect(getKingPosition(joined, 'player1')).toEqual(
      getKingPosition(mid, 'player1')
    );
    expect(joined.board[2][4]).toEqual({
      type: 'quadraphage',
      owner: 'player1',
    });
    expect(blob.metadata?.player2Name).toBe('Joiner');
  });

  it('late-join mid placeQuadraphage (host mid-turn) roundtrips via JSON', () => {
    let state = createInitialGameState();
    state = selectKing(state);
    state = moveKing(state, { row: 2, col: 5 });
    expect(state.turnPhase).toBe('placeQuadraphage');

    const joined = gameStateFromJSON(gameStateToJSON(state));
    expect(joined.turnPhase).toBe('placeQuadraphage');
    expect(joined.currentPlayer).toBe('player1');
    expect(joined.selectedKingPosition).toBeNull();
    expect(getKingPosition(joined, 'player1')).toEqual({ row: 2, col: 5 });
  });

  it('late-join after full round: P1 to move with both supplies decremented', () => {
    const mid = playFullRound();
    expect(mid.currentPlayer).toBe('player1');
    const joined = deserializeGameState(serializeGameState(mid));
    expect(joined.currentPlayer).toBe('player1');
    expect(joined.player1Supply).toBe(INITIAL_QUADRAPHAGE_COUNT - 1);
    expect(joined.player2Supply).toBe(INITIAL_QUADRAPHAGE_COUNT - 1);
    expect(joined.board).toHaveLength(BOARD_SIZE);
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        expect(joined.board[r][c]).toEqual(mid.board[r][c]);
      }
    }
  });

  it('getSaveInfo for late-join lobby summary shows joiner seat label', () => {
    const mid = playHalfTurnP1();
    const info = getSaveInfo(serializeGameState(mid));
    expect(info.isGameOver).toBe(false);
    expect(info.currentPlayer).toBe('Player 2');
    expect(info.turnCount).toBe(mid.moveHistory.length);
    expect(info.winner).toBeNull();
  });

  it('late-join into gameOver snapshot reports over + winner', () => {
    const over = {
      ...createInitialGameState(),
      turnPhase: 'gameOver' as const,
      winner: 'player2' as const,
      moveHistory: [
        {
          player: 'player1' as const,
          action: 'moveKing' as const,
          from: { row: 1, col: 5 },
          to: { row: 2, col: 5 },
        },
      ],
    };
    const info = getSaveInfo(serializeGameState(over));
    expect(info.isGameOver).toBe(true);
    expect(info.winner).toBe('player2');
    expect(info.turnCount).toBe(1);
  });

  it('double serialize of late-join blob stays validate-true', () => {
    const mid = playHalfTurnP1();
    const once = serializeGameState(mid);
    const twice = serializeGameState(deserializeGameState(once));
    expect(validateSerializedState(twice)).toBe(true);
    expect(twice.currentPlayer).toBe(once.currentPlayer);
    expect(twice.player1Supply).toBe(once.player1Supply);
    expect(twice.moveHistory).toEqual(once.moveHistory);
  });
});

describe('Wave 41 multiplayer-sync — late-join via shell Start stamp', () => {
  let container: HTMLElement;
  let shell: GameShellElements | null = null;

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'app';
    document.body.appendChild(container);
  });

  afterEach(() => {
    shell?.cleanup();
    shell = null;
    container.remove();
  });

  it('joiner Start after empty lobby stamps vs-AI chrome + closes modal', () => {
    const onStart = vi.fn();
    shell = mountGameShell(container, {
      title: 'Late Join Shell',
      helpTitle: 'Help',
      helpContentHtml: '<p>r</p>',
      modeRadioName: 'overnight-late-shell',
      showDifficulty: true,
      defaultDifficulty: 'medium',
      onNavigateHome: () => undefined,
      onStartGame: onStart,
    });

    // Wait in lobby
    (shell.newGameBtn as HTMLButtonElement).click();
    expect(container.dataset.opponent).toBeUndefined();

    (
      container.querySelector(
        '.mode-option[data-mode="human-vs-ai"]'
      ) as HTMLElement
    ).click();
    (
      container.querySelector('.difficulty-btn.hard') as HTMLButtonElement
    ).click();
    (container.querySelector('#start-game-btn') as HTMLButtonElement).click();

    expect(onStart).toHaveBeenCalledWith('human-vs-ai', 'hard');
    expect(container.dataset.opponent).toBe('ai');
    expect(shell.newGameModal?.classList.contains('hidden')).toBe(true);
  });

  it('2P late Start stamps human chrome (no opponent dataset)', () => {
    const onStart = vi.fn();
    shell = mountGameShell(container, {
      title: '2P Join',
      helpTitle: 'Help',
      helpContentHtml: '<p>r</p>',
      modeRadioName: 'overnight-late-2p',
      onNavigateHome: () => undefined,
      onStartGame: onStart,
    });

    (shell.newGameBtn as HTMLButtonElement).click();
    (container.querySelector('#start-game-btn') as HTMLButtonElement).click();
    expect(onStart).toHaveBeenCalledWith('human-vs-human', undefined);
    expect(container.dataset.opponent).toBeUndefined();
  });
});

describe('Wave 41 multiplayer-sync — late-join selectedKing mid-move', () => {
  it('joiner sees host selection before king move completes', () => {
    let state = createInitialGameState();
    state = selectKing(state);
    expect(state.selectedKingPosition).not.toBeNull();

    const blob: SerializedGameState = serializeGameState(state);
    const joined = deserializeGameState(blob);
    expect(joined.selectedKingPosition).toEqual(state.selectedKingPosition);
    expect(joined.turnPhase).toBe('moveKing');
    expect(joined.currentPlayer).toBe('player1');
  });
});
