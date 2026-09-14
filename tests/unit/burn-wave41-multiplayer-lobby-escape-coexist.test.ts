/**
 * Overnight TOKENMAXX — multiplayer-sync leftovers: empty lobby Escape/help
 * coexistence and Start-from-closed paths. Existing game-shell only.
 * Tests-only. Avoids game-engine leftover collision.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  mountGameShell,
  type GameShellElements,
} from '../../src/ui/components/game-shell';

describe('Wave 41 multiplayer-sync — lobby Escape / help coexistence', () => {
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

  it('help open while empty lobby: Escape closes both, never Starts', () => {
    const onStart = vi.fn();
    shell = mountGameShell(container, {
      title: 'Lobby Help',
      helpTitle: 'How',
      helpContentHtml: '<p>rules</p>',
      modeRadioName: 'overnight-lobby-help',
      onNavigateHome: () => undefined,
      onStartGame: onStart,
    });

    (shell.newGameBtn as HTMLButtonElement).click();
    (shell.helpBtn as HTMLButtonElement).click();
    expect(shell.newGameModal?.classList.contains('hidden')).toBe(false);
    expect(shell.helpModal?.classList.contains('hidden')).toBe(false);

    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
    );
    expect(shell.newGameModal?.classList.contains('hidden')).toBe(true);
    expect(shell.helpModal?.classList.contains('hidden')).toBe(true);
    expect(onStart).not.toHaveBeenCalled();
    expect(container.dataset.opponent).toBeUndefined();
  });

  it('re-open empty lobby after Escape keeps prior radio selection', () => {
    shell = mountGameShell(container, {
      title: 'Lobby Persist',
      helpTitle: 'How',
      helpContentHtml: '<p>r</p>',
      modeRadioName: 'overnight-lobby-persist',
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
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
    );

    (shell.newGameBtn as HTMLButtonElement).click();
    const ai = container.querySelector(
      '.mode-option[data-mode="human-vs-ai"]'
    ) as HTMLElement;
    expect(ai.classList.contains('selected')).toBe(true);
    expect(
      (container.querySelector('#difficulty-section') as HTMLElement).style
        .display
    ).toBe('block');
    expect(container.dataset.opponent).toBeUndefined();
  });

  it('Start from closed modal path: open→start closes lobby', () => {
    const onStart = vi.fn();
    shell = mountGameShell(container, {
      title: 'Lobby Start',
      helpTitle: 'How',
      helpContentHtml: '<p>r</p>',
      modeRadioName: 'overnight-lobby-start',
      onNavigateHome: () => undefined,
      onStartGame: onStart,
    });

    expect(shell.newGameModal?.classList.contains('hidden')).toBe(true);
    (shell.newGameBtn as HTMLButtonElement).click();
    (container.querySelector('#start-game-btn') as HTMLButtonElement).click();
    expect(onStart).toHaveBeenCalledTimes(1);
    expect(shell.newGameModal?.classList.contains('hidden')).toBe(true);
  });

  it('non-Escape keydown while lobby open does not dismiss', () => {
    shell = mountGameShell(container, {
      title: 'Lobby Keys',
      helpTitle: 'How',
      helpContentHtml: '<p>r</p>',
      modeRadioName: 'overnight-lobby-keys',
      onNavigateHome: () => undefined,
      onStartGame: () => undefined,
    });

    (shell.newGameBtn as HTMLButtonElement).click();
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    expect(shell.newGameModal?.classList.contains('hidden')).toBe(false);
  });
});
