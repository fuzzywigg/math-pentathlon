/**
 * Overnight TOKENMAXX — multiplayer-sync leftovers: desync recovery.
 * Maps "desync recovery" onto validateSerializedState rejects + re-sync via
 * fresh serialize, and player-colors clear/reapply when chrome drifts.
 * Existing modules only. Tests-only. Avoids game-engine leftover collision.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import {
  createInitialGameState,
  selectKing,
  moveKing,
  placeQuadraphage,
} from '../../src/games/kings-quadraphages/game-state';
import {
  serializeGameState,
  deserializeGameState,
  validateSerializedState,
  gameStateFromJSON,
  gameStateToJSON,
  type SerializedGameState,
} from '../../src/games/kings-quadraphages/serialization';

import {
  applyGameModeChrome,
  clearGameModeChrome,
  getPlayerSeatColors,
  seatIcon,
  colorForSeat,
} from '../../src/ui/player-colors';

function midSession(): ReturnType<typeof createInitialGameState> {
  let state = createInitialGameState();
  state = selectKing(state);
  state = moveKing(state, { row: 2, col: 5 });
  state = placeQuadraphage(state, { row: 3, col: 5 });
  return state;
}

describe('Wave 41 multiplayer-sync — desync recovery (serialize validate)', () => {
  it('rejects version / player / phase drift then recovers from good blob', () => {
    const good = serializeGameState(midSession());
    expect(validateSerializedState(good)).toBe(true);

    const badVersion = { ...good, version: 999 };
    expect(validateSerializedState(badVersion)).toBe(true); // version type ok
    expect(() => deserializeGameState(badVersion)).toThrow(
      /Unsupported save version/
    );

    const badPlayer = { ...good, currentPlayer: 'spectator' };
    expect(validateSerializedState(badPlayer)).toBe(false);

    const badPhase = { ...good, turnPhase: 'waitingLobby' };
    expect(validateSerializedState(badPhase)).toBe(false);

    // Recovery path: discard bad, re-admit good
    const recovered = deserializeGameState(good);
    expect(recovered.currentPlayer).toBe('player2');
    expect(recovered.turnPhase).toBe('moveKing');
  });

  it('rejects jagged / short boards then recovers via JSON roundtrip', () => {
    const good = serializeGameState(midSession());

    const shortBoard = { ...good, board: [[null]] };
    expect(validateSerializedState(shortBoard)).toBe(false);
    expect(() =>
      deserializeGameState(shortBoard as SerializedGameState)
    ).toThrow(/Invalid board size/);

    const jagged = {
      ...good,
      board: good.board.map((row, i) => (i === 0 ? row.slice(0, 3) : row)),
    };
    expect(validateSerializedState(jagged)).toBe(false);

    const recovered = gameStateFromJSON(gameStateToJSON(midSession()));
    expect(recovered.board).toHaveLength(9);
    expect(recovered.board.every((r) => r.length === 9)).toBe(true);
  });

  it('rejects null / array / primitive desync junk', () => {
    expect(validateSerializedState(null)).toBe(false);
    expect(validateSerializedState(undefined)).toBe(false);
    expect(validateSerializedState([])).toBe(false);
    expect(validateSerializedState('blob')).toBe(false);
    expect(validateSerializedState(42)).toBe(false);
    expect(validateSerializedState({ version: 1 })).toBe(false);
  });

  it('after failed bad deserialize, good serialize still loads (session resync)', () => {
    const live = midSession();
    const good = serializeGameState(live);
    const poisoned = { ...good, board: [] as SerializedGameState['board'] };

    expect(validateSerializedState(poisoned)).toBe(false);
    expect(() => deserializeGameState(poisoned)).toThrow(/Invalid board size/);

    // Host re-broadcasts canonical state
    const resynced = deserializeGameState(serializeGameState(live));
    expect(resynced.moveHistory).toEqual(live.moveHistory);
    expect(resynced.player1Supply).toBe(live.player1Supply);
    expect(resynced.currentPlayer).toBe(live.currentPlayer);
  });

  it('metadata-only drift still validates when board/seat/phase intact', () => {
    const blob = serializeGameState(midSession(), {
      gameName: 'resync',
      notes: 'first',
    });
    const drifted = {
      ...blob,
      metadata: { gameName: 'resync', notes: 'updated-note' },
    };
    expect(validateSerializedState(drifted)).toBe(true);
    const joined = deserializeGameState(drifted);
    expect(joined.currentPlayer).toBe('player2');
  });
});

describe('Wave 41 multiplayer-sync — desync recovery (seat chrome)', () => {
  let app: HTMLElement;

  beforeEach(() => {
    app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
  });

  afterEach(() => {
    clearGameModeChrome(app);
    app.remove();
  });

  it('stale AI chrome cleared then reapplied recovers seat colors', () => {
    applyGameModeChrome(app, 'human-vs-ai', 'player2');
    expect(colorForSeat('player2', app)).toBe('#8b5cf6');

    // Simulate desync: leftover AI class while intending 2P
    clearGameModeChrome(app);
    expect(app.dataset.opponent).toBeUndefined();
    expect(colorForSeat('player2', app)).toBe('#ef4444');

    // Re-sync to intended vs-AI host seat flip (Kings P1 AI)
    applyGameModeChrome(app, 'human-vs-ai', 'player1');
    expect(app.dataset.aiSeat).toBe('player1');
    expect(colorForSeat('player1', app)).toBe('#8b5cf6');
    expect(colorForSeat('player2', app)).toBe('#ef4444');
    expect(seatIcon('player1', app)).toBe('🟣');
    expect(seatIcon('player2', app)).toBe('🔴');
  });

  it('flip AI seat without clear leaves previous seat; clear+apply recovers', () => {
    applyGameModeChrome(app, 'human-vs-ai', 'player2');
    expect(seatIcon('player2', app)).toBe('🟣');

    // Direct overwrite (apply always sets aiSeat)
    applyGameModeChrome(app, 'human-vs-ai', 'player1');
    expect(seatIcon('player1', app)).toBe('🟣');
    expect(seatIcon('player2', app)).toBe('🔴');

    applyGameModeChrome(app, 'human-vs-human');
    expect(app.dataset.opponent).toBeUndefined();
    const colors = getPlayerSeatColors(app);
    expect(colors.player1).toBe('#3b82f6');
    expect(colors.player2).toBe('#ef4444');
  });

  it('orphan game-vs-ai class without dataset recovers via clearGameModeChrome', () => {
    app.classList.add('game-vs-ai');
    app.dataset.opponent = 'ai';
    app.dataset.aiSeat = 'player2';
    clearGameModeChrome(app);
    expect(app.classList.contains('game-vs-ai')).toBe(false);
    expect(app.dataset.opponent).toBeUndefined();
    expect(app.dataset.aiSeat).toBeUndefined();
    expect(seatIcon('player2', app)).toBe('🔴');
  });

  it('local root desync vs #app: explicit root wins for color recovery', () => {
    applyGameModeChrome(app, 'human-vs-ai', 'player2');
    const local = document.createElement('div');
    applyGameModeChrome(local, 'human-vs-human');
    expect(seatIcon('player2', local)).toBe('🔴');
    expect(seatIcon('player2', app)).toBe('🟣');
    clearGameModeChrome(local);
    clearGameModeChrome(app);
    expect(seatIcon('player2', app)).toBe('🔴');
  });
});
