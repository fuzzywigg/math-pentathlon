/**
 * Wave 40 — shell difficulty toggle / showDifficulty false / escapeAttr / cleanup leftovers.
 * Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  mountGameShell,
  type GameShellElements,
} from '../../src/ui/components/game-shell';

describe('Wave 40 shell — difficulty toggle', () => {
  let container: HTMLElement;
  let shell: GameShellElements | null = null;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    shell?.cleanup();
    shell = null;
    container.remove();
  });

  it('mode flip shows/hides difficulty; start passes selected level', () => {
    const onStart = vi.fn();
    shell = mountGameShell(container, {
      title: 'Diff',
      helpTitle: 'H',
      helpContentHtml: '<p>r</p>',
      modeRadioName: 'w40-diff',
      showDifficulty: true,
      defaultDifficulty: 'easy',
      onNavigateHome: () => undefined,
      onStartGame: onStart,
    });
    (shell.newGameBtn as HTMLElement).click();
    const section = container.querySelector(
      '#difficulty-section'
    ) as HTMLElement;
    expect(section.style.display).toBe('none');

    (
      container.querySelector(
        '.mode-option[data-mode="human-vs-ai"]'
      ) as HTMLElement
    ).click();
    expect(section.style.display).toBe('block');

    (container.querySelector('.difficulty-btn.hard') as HTMLElement).click();
    (container.querySelector('#start-game-btn') as HTMLElement).click();
    expect(onStart).toHaveBeenCalledWith('human-vs-ai', 'hard');
  });

  it('showDifficulty false omits section and passes undefined difficulty', () => {
    const onStart = vi.fn();
    shell = mountGameShell(container, {
      title: 'No Diff',
      helpTitle: 'H',
      helpContentHtml: '<p>r</p>',
      modeRadioName: 'w40-nodiff',
      showDifficulty: false,
      onNavigateHome: () => undefined,
      onStartGame: onStart,
    });
    expect(container.querySelector('#difficulty-section')).toBeNull();
    (shell.newGameBtn as HTMLElement).click();
    (
      container.querySelector(
        '.mode-option[data-mode="human-vs-ai"]'
      ) as HTMLElement
    ).click();
    (container.querySelector('#start-game-btn') as HTMLElement).click();
    expect(onStart).toHaveBeenCalledWith('human-vs-ai', undefined);
  });

  it('escapeAttr quotes title and mode radio name special chars', () => {
    shell = mountGameShell(container, {
      title: 'Quote "Game" & <Fun>',
      helpTitle: 'Help "Me"',
      helpContentHtml: '<p>ok</p>',
      modeRadioName: 'w40-"radio"',
      vsHumanDescription: 'A "friend"',
      onNavigateHome: () => undefined,
      onStartGame: () => undefined,
    });
    expect(container.querySelector('h1')?.textContent).toBe(
      'Quote "Game" & <Fun>'
    );
    const input = container.querySelector(
      'input[type="radio"]'
    ) as HTMLInputElement;
    expect(input.name).toBe('w40-"radio"');
    expect(container.innerHTML).toContain('&quot;');
    expect(container.innerHTML).toContain('&amp;');
  });

  it('cleanup removes Escape listener so further Esc is inert', () => {
    shell = mountGameShell(container, {
      title: 'Clean',
      helpTitle: 'H',
      helpContentHtml: '<p>r</p>',
      modeRadioName: 'w40-clean',
      onNavigateHome: () => undefined,
      onStartGame: () => undefined,
    });
    (shell.helpBtn as HTMLElement).click();
    expect(shell.helpModal!.classList.contains('hidden')).toBe(false);
    shell.cleanup();
    // Re-open via class remove (listener gone) then Esc should not close
    shell.helpModal!.classList.remove('hidden');
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
    );
    expect(shell.helpModal!.classList.contains('hidden')).toBe(false);
    shell = null; // already cleaned
  });

  it('human mode after AI flip hides difficulty again', () => {
    shell = mountGameShell(container, {
      title: 'Flip',
      helpTitle: 'H',
      helpContentHtml: '<p>r</p>',
      modeRadioName: 'w40-flip',
      showDifficulty: true,
      onNavigateHome: () => undefined,
      onStartGame: () => undefined,
    });
    (shell.newGameBtn as HTMLElement).click();
    const section = container.querySelector(
      '#difficulty-section'
    ) as HTMLElement;
    (
      container.querySelector(
        '.mode-option[data-mode="human-vs-ai"]'
      ) as HTMLElement
    ).click();
    expect(section.style.display).toBe('block');
    (
      container.querySelector(
        '.mode-option[data-mode="human-vs-human"]'
      ) as HTMLElement
    ).click();
    expect(section.style.display).toBe('none');
  });
});
