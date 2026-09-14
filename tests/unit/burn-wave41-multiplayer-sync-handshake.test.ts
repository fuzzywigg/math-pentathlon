/**
 * Overnight TOKENMAXX — multiplayer-sync leftovers: handshake across shell,
 * seat chrome, Kings late-join serialize, and isAITurn disconnect stubs.
 * Existing modules only. Tests-only. Avoids game-engine leftover collision.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  mountGameShell,
  type GameShellElements,
} from '../../src/ui/components/game-shell';
import {
  applyGameModeChrome,
  clearGameModeChrome,
  seatIcon,
} from '../../src/ui/player-colors';

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
} from '../../src/games/kings-quadraphages/serialization';
import { isAITurn as kingsIsAITurn } from '../../src/games/kings-quadraphages/ai';

describe('Wave 41 multiplayer-sync — shell × chrome × serialize handshake', () => {
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

  it('empty lobby → Start AI → late-join serialize → host cleanup', () => {
    const onStart = vi.fn();
    shell = mountGameShell(container, {
      title: 'Handshake Room',
      helpTitle: 'Help',
      helpContentHtml: '<p>r</p>',
      modeRadioName: 'overnight-hs-a',
      showDifficulty: true,
      onNavigateHome: () => undefined,
      onStartGame: onStart,
    });

    // Empty lobby
    (shell.newGameBtn as HTMLButtonElement).click();
    expect(container.dataset.opponent).toBeUndefined();
    expect(onStart).not.toHaveBeenCalled();

    // Join / Start
    (
      container.querySelector(
        '.mode-option[data-mode="human-vs-ai"]'
      ) as HTMLElement
    ).click();
    (container.querySelector('#start-game-btn') as HTMLButtonElement).click();
    expect(onStart).toHaveBeenCalledWith('human-vs-ai', 'medium');
    expect(container.dataset.opponent).toBe('ai');
    expect(seatIcon('player2', container)).toBe('🟣');

    // Mid-session late-join blob while chrome still live
    let state = createInitialGameState();
    state = selectKing(state);
    state = moveKing(state, { row: 2, col: 5 });
    state = placeQuadraphage(state, { row: 3, col: 5 });
    const blob = serializeGameState(state);
    expect(validateSerializedState(blob)).toBe(true);
    const joined = deserializeGameState(blob);
    expect(joined.currentPlayer).toBe('player2');
    // AI is P2 and it is P2's turn → AI would act
    expect(kingsIsAITurn(joined, 'player2', 'human-vs-ai')).toBe(true);
    // Host disconnect stub: null seat
    expect(kingsIsAITurn(joined, null, 'human-vs-ai')).toBe(false);

    // Host leave
    shell.cleanup();
    shell = null;
    expect(container.dataset.opponent).toBeUndefined();
    expect(seatIcon('player2', container)).toBe('🔴');
  });

  it('desync chrome then recover: clear → reapply → 2P Start stamps human', () => {
    shell = mountGameShell(container, {
      title: 'Recover Room',
      helpTitle: 'Help',
      helpContentHtml: '<p>r</p>',
      modeRadioName: 'overnight-hs-b',
      onNavigateHome: () => undefined,
      onStartGame: () => undefined,
    });

    applyGameModeChrome(container, 'human-vs-ai', 'player1');
    expect(seatIcon('player1', container)).toBe('🟣');
    clearGameModeChrome(container);
    expect(seatIcon('player1', container)).toBe('🔵');

    (shell.newGameBtn as HTMLButtonElement).click();
    (container.querySelector('#start-game-btn') as HTMLButtonElement).click();
    expect(container.dataset.opponent).toBeUndefined();
    expect(seatIcon('player1', container)).toBe('🔵');
    expect(seatIcon('player2', container)).toBe('🔴');
  });

  it('2P late-join serialize never arms isAITurn under human chrome', () => {
    shell = mountGameShell(container, {
      title: '2P Room',
      helpTitle: 'Help',
      helpContentHtml: '<p>r</p>',
      modeRadioName: 'overnight-hs-c',
      onNavigateHome: () => undefined,
      onStartGame: () => undefined,
    });

    (shell.newGameBtn as HTMLButtonElement).click();
    (container.querySelector('#start-game-btn') as HTMLButtonElement).click();
    expect(container.dataset.opponent).toBeUndefined();

    let state = createInitialGameState();
    state = selectKing(state);
    state = moveKing(state, { row: 2, col: 5 });
    state = placeQuadraphage(state, { row: 3, col: 5 });
    const joined = deserializeGameState(serializeGameState(state));
    expect(kingsIsAITurn(joined, 'player2', 'human-vs-human')).toBe(false);
    expect(kingsIsAITurn(joined, 'player1', 'human-vs-human')).toBe(false);
  });
});
