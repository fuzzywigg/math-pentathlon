/**
 * Overnight TOKENMAXX — multiplayer-sync leftovers: host disconnect stubs.
 * Maps "host disconnect" onto shell cleanup / clearGameModeChrome and isAITurn
 * early-return stubs when mode is 2P, AI seat null, or game already over.
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

import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';
import { isAITurn as kingsIsAITurn } from '../../src/games/kings-quadraphages/ai';

import { createInitialState as createCalla } from '../../src/games/calla/types';
import { isAITurn as callaIsAITurn } from '../../src/games/calla/ai';

import { createInitialState as createHag } from '../../src/games/hex-a-gone/types';
import { isAITurn as hagIsAITurn } from '../../src/games/hex-a-gone/ai';

import { createInitialState as createStar } from '../../src/games/star-track/types';
import { isAITurn as starIsAITurn } from '../../src/games/star-track/ai';

import { createInitialState as createContig } from '../../src/games/contig-60/types';
import { isAITurn as contigIsAITurn } from '../../src/games/contig-60/ai';

import { createInitialState as createJuggle } from '../../src/games/juggle/rules';
import { isAITurn as juggleIsAITurn } from '../../src/games/juggle/ai';

describe('Wave 41 multiplayer-sync — host disconnect (shell cleanup)', () => {
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

  it('cleanup after vs-AI Start strips opponent chrome (host leave)', () => {
    shell = mountGameShell(container, {
      title: 'Host Leave',
      helpTitle: 'Help',
      helpContentHtml: '<p>r</p>',
      modeRadioName: 'overnight-host-a',
      showDifficulty: true,
      onNavigateHome: () => undefined,
      onStartGame: () => undefined,
    });

    (shell.newGameBtn as HTMLButtonElement).click();
    (
      container.querySelector(
        '.mode-option[data-mode="human-vs-ai"]'
      ) as HTMLElement
    ).click();
    (container.querySelector('#start-game-btn') as HTMLButtonElement).click();
    expect(container.dataset.opponent).toBe('ai');
    expect(container.classList.contains('game-vs-ai')).toBe(true);

    shell.cleanup();
    shell = null;
    expect(container.dataset.opponent).toBeUndefined();
    expect(container.dataset.aiSeat).toBeUndefined();
    expect(container.classList.contains('game-vs-ai')).toBe(false);
  });

  it('Back then cleanup: navigate home stub + chrome cleared', () => {
    const onHome = vi.fn();
    shell = mountGameShell(container, {
      title: 'Host Back',
      helpTitle: 'Help',
      helpContentHtml: '<p>r</p>',
      modeRadioName: 'overnight-host-b',
      onNavigateHome: onHome,
      onStartGame: () => undefined,
    });

    (shell.newGameBtn as HTMLButtonElement).click();
    (
      container.querySelector(
        '.mode-option[data-mode="human-vs-ai"]'
      ) as HTMLElement
    ).click();
    (container.querySelector('#start-game-btn') as HTMLButtonElement).click();
    expect(container.dataset.opponent).toBe('ai');

    (shell.backBtn as HTMLButtonElement).click();
    expect(onHome).toHaveBeenCalledTimes(1);

    shell.cleanup();
    expect(container.dataset.opponent).toBeUndefined();
  });

  it('double cleanup is idempotent after disconnect', () => {
    shell = mountGameShell(container, {
      title: 'Idempotent Leave',
      helpTitle: 'Help',
      helpContentHtml: '<p>r</p>',
      modeRadioName: 'overnight-host-c',
      onNavigateHome: () => undefined,
      onStartGame: () => undefined,
    });

    applyGameModeChrome(container, 'human-vs-ai', 'player1');
    shell.cleanup();
    shell.cleanup();
    expect(container.dataset.opponent).toBeUndefined();
    expect(seatIcon('player1', container)).toBe('🔵');
  });
});

describe('Wave 41 multiplayer-sync — isAITurn host-disconnect stubs', () => {
  it('2P human mode never schedules AI (host-only session stub)', () => {
    const kings = createInitialGameState();
    expect(kingsIsAITurn(kings, 'player2', 'human-vs-human')).toBe(false);
    expect(kingsIsAITurn(kings, 'player1', 'human-vs-human')).toBe(false);

    const calla = createCalla();
    expect(callaIsAITurn(calla, 'player2', 'human-vs-human')).toBe(false);

    const hag = createHag();
    expect(hagIsAITurn(hag, 'player2', 'human-vs-human')).toBe(false);

    const star = createStar();
    expect(starIsAITurn(star, 'player2', 'human-vs-human')).toBe(false);

    const contig = createContig();
    expect(contigIsAITurn(contig, 'player2', 'human-vs-human')).toBe(false);

    const juggle = createJuggle();
    expect(juggleIsAITurn(juggle, 'player2', 'human-vs-human')).toBe(false);
  });

  it('null AI seat stubs AI turn even in vs-AI mode (disconnect seat)', () => {
    const kings = createInitialGameState();
    expect(kingsIsAITurn(kings, null, 'human-vs-ai')).toBe(false);

    const calla = createCalla();
    expect(callaIsAITurn(calla, null, 'human-vs-ai')).toBe(false);

    const hag = createHag();
    expect(hagIsAITurn(hag, null, 'human-vs-ai')).toBe(false);

    const star = createStar();
    expect(starIsAITurn(star, null, 'human-vs-ai')).toBe(false);

    const contig = createContig();
    expect(contigIsAITurn(contig, null, 'human-vs-ai')).toBe(false);

    const juggle = createJuggle();
    expect(juggleIsAITurn(juggle, null, 'human-vs-ai')).toBe(false);
  });

  it('gameOver stubs AI turn for Kings (host session ended)', () => {
    const over = {
      ...createInitialGameState(),
      turnPhase: 'gameOver' as const,
      winner: 'player1' as const,
    };
    expect(kingsIsAITurn(over, 'player2', 'human-vs-ai')).toBe(false);
    expect(kingsIsAITurn(over, 'player1', 'human-vs-ai')).toBe(false);
  });

  it('clearGameModeChrome after AI stamp restores 2P seat icons', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    applyGameModeChrome(root, 'human-vs-ai', 'player2');
    expect(seatIcon('player2', root)).toBe('🟣');
    clearGameModeChrome(root);
    expect(seatIcon('player2', root)).toBe('🔴');
    expect(seatIcon('player1', root)).toBe('🔵');
    root.remove();
  });

  it('wrong-seat AI id is not the current player → stub false', () => {
    const kings = createInitialGameState();
    expect(kings.currentPlayer).toBe('player1');
    // AI is P2 but it is P1's turn → not AI turn
    expect(kingsIsAITurn(kings, 'player2', 'human-vs-ai')).toBe(false);
    // AI is P1 and it is P1's turn → true (control)
    expect(kingsIsAITurn(kings, 'player1', 'human-vs-ai')).toBe(true);
  });
});
