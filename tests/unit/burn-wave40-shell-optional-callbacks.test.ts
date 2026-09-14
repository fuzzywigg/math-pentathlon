/**
 * Wave 40 — mountGameShell minimal options / HvsH hides AI / cleanup idempotent.
 * Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import {
  mountGameShell,
  type GameShellElements,
} from '../../src/ui/components/game-shell';

describe('Wave 40 game-shell — optional callbacks / HvsH / cleanup', () => {
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

  it('mountGameShell with minimal options (omit tutorial callbacks)', () => {
    shell = mountGameShell(container, {
      title: 'Wave40 Minimal',
      helpTitle: 'Help',
      helpContentHtml: '<p>rules</p>',
      modeRadioName: 'w40-min',
      onNavigateHome: () => undefined,
      onStartGame: () => undefined,
    });

    expect(container.querySelector('h1')?.textContent).toBe('Wave40 Minimal');
    expect(container.querySelector('#tutorial-btn')).toBeNull();
    expect(shell.tutorialBtn).toBeNull();
    expect(shell.board?.id).toBe('board');
  });

  it('human-vs-human hides difficulty AI controls', () => {
    shell = mountGameShell(container, {
      title: 'HvsH',
      helpTitle: 'Help',
      helpContentHtml: '<p>r</p>',
      modeRadioName: 'w40-hvsh',
      showDifficulty: true,
      defaultMode: 'human-vs-human',
      onNavigateHome: () => undefined,
      onStartGame: () => undefined,
    });

    (shell.newGameBtn as HTMLButtonElement).click();
    const difficulty = container.querySelector(
      '#difficulty-section'
    ) as HTMLElement;
    expect(difficulty).toBeTruthy();
    expect(difficulty.style.display).toBe('none');

    (
      container.querySelector(
        '.mode-option[data-mode="human-vs-ai"]'
      ) as HTMLElement
    ).click();
    expect(difficulty.style.display).toBe('block');

    (
      container.querySelector(
        '.mode-option[data-mode="human-vs-human"]'
      ) as HTMLElement
    ).click();
    expect(difficulty.style.display).toBe('none');
  });

  it('cleanup is idempotent', () => {
    shell = mountGameShell(container, {
      title: 'Cleanup',
      helpTitle: 'Help',
      helpContentHtml: '<p>r</p>',
      modeRadioName: 'w40-clean',
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

    shell.cleanup();
    expect(container.dataset.opponent).toBeUndefined();
    expect(() => shell!.cleanup()).not.toThrow();
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
    );
  });
});
