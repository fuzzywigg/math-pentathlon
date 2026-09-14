/**
 * Overnight TOKENMAXX — multiplayer-sync leftovers: empty lobby.
 * Maps "lobby" onto existing game-shell New Game modal (mode picker, no Start).
 * Existing module only: src/ui/components/game-shell.ts (+ player-colors stamp).
 * Tests-only. No product inventing. Avoids game-engine leftover collision.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  mountGameShell,
  type GameShellElements,
} from '../../src/ui/components/game-shell';

describe('Wave 41 multiplayer-sync — empty lobby (shell modal)', () => {
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

  it('mount leaves lobby closed and human chrome until Start', () => {
    const onStart = vi.fn();
    shell = mountGameShell(container, {
      title: 'Lobby Probe',
      helpTitle: 'Help',
      helpContentHtml: '<p>rules</p>',
      modeRadioName: 'overnight-lobby-a',
      showDifficulty: true,
      onNavigateHome: () => undefined,
      onStartGame: onStart,
    });

    expect(shell.newGameModal?.classList.contains('hidden')).toBe(true);
    expect(container.dataset.opponent).toBeUndefined();
    expect(container.classList.contains('game-vs-ai')).toBe(false);
    expect(onStart).not.toHaveBeenCalled();
  });

  it('open lobby without Start keeps human chrome + default 2P radio', () => {
    const onStart = vi.fn();
    shell = mountGameShell(container, {
      title: 'Empty Lobby',
      helpTitle: 'Help',
      helpContentHtml: '<p>r</p>',
      modeRadioName: 'overnight-lobby-b',
      showDifficulty: true,
      defaultMode: 'human-vs-human',
      onNavigateHome: () => undefined,
      onStartGame: onStart,
    });

    (shell.newGameBtn as HTMLButtonElement).click();
    expect(shell.newGameModal?.classList.contains('hidden')).toBe(false);

    const human = container.querySelector(
      '.mode-option[data-mode="human-vs-human"]'
    ) as HTMLElement;
    const ai = container.querySelector(
      '.mode-option[data-mode="human-vs-ai"]'
    ) as HTMLElement;
    expect(human.classList.contains('selected')).toBe(true);
    expect(ai.classList.contains('selected')).toBe(false);

    const difficulty = container.querySelector(
      '#difficulty-section'
    ) as HTMLElement;
    expect(difficulty.style.display).toBe('none');

    // Still empty lobby: chrome not stamped AI, Start not fired
    expect(container.dataset.opponent).toBeUndefined();
    expect(onStart).not.toHaveBeenCalled();
  });

  it('AI-first defaultMode still waits in empty lobby until Start', () => {
    const onStart = vi.fn();
    shell = mountGameShell(container, {
      title: 'AI Default Lobby',
      helpTitle: 'Help',
      helpContentHtml: '<p>r</p>',
      modeRadioName: 'overnight-lobby-c',
      defaultMode: 'human-vs-ai',
      showDifficulty: true,
      defaultDifficulty: 'hard',
      onNavigateHome: () => undefined,
      onStartGame: onStart,
    });

    (shell.newGameBtn as HTMLButtonElement).click();
    const ai = container.querySelector(
      '.mode-option[data-mode="human-vs-ai"]'
    ) as HTMLElement;
    expect(ai.classList.contains('selected')).toBe(true);

    const difficulty = container.querySelector(
      '#difficulty-section'
    ) as HTMLElement;
    expect(difficulty.style.display).toBe('block');

    // defaultMode only selects radio — games init as human until Start
    expect(container.dataset.opponent).toBeUndefined();
    expect(onStart).not.toHaveBeenCalled();
  });

  it('dismiss empty lobby via close / backdrop / Escape without starting', () => {
    const onStart = vi.fn();
    shell = mountGameShell(container, {
      title: 'Dismiss Lobby',
      helpTitle: 'Help',
      helpContentHtml: '<p>r</p>',
      modeRadioName: 'overnight-lobby-d',
      onNavigateHome: () => undefined,
      onStartGame: onStart,
    });

    const modal = shell.newGameModal!;

    (shell.newGameBtn as HTMLButtonElement).click();
    modal.querySelector('.modal-close')!.dispatchEvent(
      new MouseEvent('click', { bubbles: true })
    );
    expect(modal.classList.contains('hidden')).toBe(true);

    (shell.newGameBtn as HTMLButtonElement).click();
    const backdrop = new MouseEvent('click', { bubbles: true });
    Object.defineProperty(backdrop, 'target', { value: modal });
    modal.dispatchEvent(backdrop);
    expect(modal.classList.contains('hidden')).toBe(true);

    (shell.newGameBtn as HTMLButtonElement).click();
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
    );
    expect(modal.classList.contains('hidden')).toBe(true);

    expect(onStart).not.toHaveBeenCalled();
    expect(container.dataset.opponent).toBeUndefined();
  });

  it('mode toggle inside empty lobby does not stamp chrome until Start', () => {
    const onStart = vi.fn();
    shell = mountGameShell(container, {
      title: 'Toggle Lobby',
      helpTitle: 'Help',
      helpContentHtml: '<p>r</p>',
      modeRadioName: 'overnight-lobby-e',
      showDifficulty: true,
      onNavigateHome: () => undefined,
      onStartGame: onStart,
    });

    (shell.newGameBtn as HTMLButtonElement).click();
    (
      container.querySelector(
        '.mode-option[data-mode="human-vs-ai"]'
      ) as HTMLElement
    ).click();
    expect(
      (container.querySelector('#difficulty-section') as HTMLElement).style
        .display
    ).toBe('block');
    expect(container.dataset.opponent).toBeUndefined();

    (
      container.querySelector(
        '.mode-option[data-mode="human-vs-human"]'
      ) as HTMLElement
    ).click();
    expect(
      (container.querySelector('#difficulty-section') as HTMLElement).style
        .display
    ).toBe('none');
    expect(container.dataset.opponent).toBeUndefined();
    expect(onStart).not.toHaveBeenCalled();
  });

  it('leaving empty lobby via Back does not fire Start', () => {
    const onHome = vi.fn();
    const onStart = vi.fn();
    shell = mountGameShell(container, {
      title: 'Back Lobby',
      helpTitle: 'Help',
      helpContentHtml: '<p>r</p>',
      modeRadioName: 'overnight-lobby-f',
      onNavigateHome: onHome,
      onStartGame: onStart,
    });

    (shell.newGameBtn as HTMLButtonElement).click();
    expect(shell.newGameModal?.classList.contains('hidden')).toBe(false);
    (shell.backBtn as HTMLButtonElement).click();
    expect(onHome).toHaveBeenCalledTimes(1);
    expect(onStart).not.toHaveBeenCalled();
  });
});
