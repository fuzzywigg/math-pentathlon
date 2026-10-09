/**
 * q-mp-277 — characterize game-shell soft-fail / chrome residuals.
 * Structural asserts only (classList, aria-*, dataset, focus, callbacks).
 * No player-facing copy pins. Tests only — no src edits.
 *
 * Targets overlay residuals on tip: void sites (mode/difficulty forEach,
 * help open/close wrappers) and eqeqeq soft-null Escape guards, plus cold
 * soft-fail branches (missing mount / missing chrome / empty focusables).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  getFocusableWithin,
  mountGameShell,
  type GameShellElements,
} from '../../src/ui/components/game-shell';

describe('q-mp-277 game-shell soft-fail / chrome paths', () => {
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
    vi.restoreAllMocks();
  });

  function mount(
    overrides: Partial<Parameters<typeof mountGameShell>[1]> = {}
  ): GameShellElements {
    shell = mountGameShell(container, {
      title: 'Shell SoftFail',
      helpTitle: 'Help',
      helpContentHtml: '<p>rules</p>',
      modeRadioName: 'q277-mode',
      showDifficulty: true,
      defaultDifficulty: 'medium',
      onNavigateHome: () => undefined,
      onStartGame: () => undefined,
      ...overrides,
    });
    return shell;
  }

  it('soft-fails missing board mount: board null, cleanup still clears chrome', () => {
    const onStart = vi.fn();
    shell = mountGameShell(container, {
      title: 'No Board',
      helpTitle: 'Help',
      helpContentHtml: '<p>r</p>',
      modeRadioName: 'q277-noboard',
      // Custom area with no #board — suppressBoardContextMenu uses no-op unbind.
      gameAreaHtml: '<div class="empty-area" role="region"></div>',
      onNavigateHome: () => undefined,
      onStartGame: onStart,
    });

    expect(shell.board).toBeNull();
    expect(container.querySelector('#board')).toBeNull();

    shell.newGameBtn?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    (
      container.querySelector(
        '.mode-option[data-mode="human-vs-ai"]'
      ) as HTMLElement
    ).click();
    (container.querySelector('#start-game-btn') as HTMLElement).click();
    expect(onStart).toHaveBeenCalledWith('human-vs-ai', undefined);
    expect(container.dataset.opponent).toBe('ai');

    // No-op unbind path (board was null) must not throw on cleanup.
    expect(() => shell!.cleanup()).not.toThrow();
    expect(container.dataset.opponent).toBeUndefined();
    expect(container.classList.contains('game-vs-ai')).toBe(false);
    shell = null;
  });

  it('soft-fails missing help chrome: Escape still closes new-game only', () => {
    const realGet = document.getElementById.bind(document);
    vi.spyOn(document, 'getElementById').mockImplementation((id: string) => {
      if (id === 'help-btn' || id === 'help-modal') {
        return null;
      }
      return realGet(id);
    });

    shell = mount();
    expect(shell.helpBtn).toBeNull();
    expect(shell.helpModal).toBeNull();
    expect(shell.newGameModal).toBeInstanceOf(HTMLElement);

    shell.newGameBtn?.focus();
    shell.newGameBtn?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(shell.newGameModal!.classList.contains('hidden')).toBe(false);

    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
    );
    // eqeqeq soft-null: helpEl != null is false; new-game path still closes.
    expect(shell.newGameModal!.classList.contains('hidden')).toBe(true);
    expect(document.activeElement).toBe(shell.newGameBtn);
  });

  it('soft-fails missing new-game chrome: Escape still closes help only', () => {
    const realGet = document.getElementById.bind(document);
    vi.spyOn(document, 'getElementById').mockImplementation((id: string) => {
      if (id === 'new-game-btn' || id === 'new-game-modal') {
        return null;
      }
      return realGet(id);
    });

    shell = mount();
    expect(shell.newGameBtn).toBeNull();
    expect(shell.newGameModal).toBeNull();
    expect(shell.helpModal).toBeInstanceOf(HTMLElement);

    shell.helpBtn?.focus();
    shell.helpBtn?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(shell.helpModal!.classList.contains('hidden')).toBe(false);
    expect(shell.helpModal!.getAttribute('aria-hidden')).toBe('false');

    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
    );
    expect(shell.helpModal!.classList.contains('hidden')).toBe(true);
    expect(shell.helpModal!.getAttribute('aria-hidden')).toBe('true');
    expect(document.activeElement).toBe(shell.helpBtn);
  });

  it('soft-fails when both modals absent: Escape is a no-op', () => {
    const realGet = document.getElementById.bind(document);
    vi.spyOn(document, 'getElementById').mockImplementation((id: string) => {
      if (
        id === 'help-btn' ||
        id === 'help-modal' ||
        id === 'new-game-btn' ||
        id === 'new-game-modal'
      ) {
        return null;
      }
      return realGet(id);
    });

    shell = mount();
    expect(shell.helpModal).toBeNull();
    expect(shell.newGameModal).toBeNull();

    expect(() => {
      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
      );
    }).not.toThrow();
  });

  it('soft-fails missing back button: home callback never wired', () => {
    const onHome = vi.fn();
    const realGet = document.getElementById.bind(document);
    vi.spyOn(document, 'getElementById').mockImplementation((id: string) => {
      if (id === 'back-btn') {
        return null;
      }
      return realGet(id);
    });

    shell = mount({ onNavigateHome: onHome });
    expect(shell.backBtn).toBeNull();
    // Markup may still contain a back control id in HTML, but wiring skipped.
    expect(onHome).not.toHaveBeenCalled();
  });

  it('mode-option chrome: selected class moves; difficulty section toggles', () => {
    shell = mount({ defaultMode: 'human-vs-human' });
    shell.newGameBtn?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    const human = container.querySelector(
      '.mode-option[data-mode="human-vs-human"]'
    ) as HTMLElement;
    const ai = container.querySelector(
      '.mode-option[data-mode="human-vs-ai"]'
    ) as HTMLElement;
    const section = container.querySelector(
      '#difficulty-section'
    ) as HTMLElement;

    expect(human.classList.contains('selected')).toBe(true);
    expect(ai.classList.contains('selected')).toBe(false);
    expect(section.style.display).toBe('none');

    // void forEach remove/add selected (overlay :502)
    ai.click();
    expect(ai.classList.contains('selected')).toBe(true);
    expect(human.classList.contains('selected')).toBe(false);
    expect((ai.querySelector('input') as HTMLInputElement).checked).toBe(true);
    expect(section.style.display).toBe('block');

    human.click();
    expect(human.classList.contains('selected')).toBe(true);
    expect(ai.classList.contains('selected')).toBe(false);
    expect(section.style.display).toBe('none');
  });

  it('difficulty chrome: selected + aria-pressed move across buttons', () => {
    shell = mount({
      showDifficulty: true,
      defaultDifficulty: 'easy',
      defaultMode: 'human-vs-ai',
    });
    shell.newGameBtn?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    const easy = container.querySelector('.difficulty-btn.easy') as HTMLElement;
    const hard = container.querySelector('.difficulty-btn.hard') as HTMLElement;

    expect(easy.classList.contains('selected')).toBe(true);
    expect(easy.getAttribute('aria-pressed')).toBe('true');
    expect(hard.getAttribute('aria-pressed')).toBe('false');

    // void forEach remove/add selected (overlay :516)
    hard.click();
    expect(hard.classList.contains('selected')).toBe(true);
    expect(easy.classList.contains('selected')).toBe(false);
    expect(hard.getAttribute('aria-pressed')).toBe('true');
    expect(easy.getAttribute('aria-pressed')).toBe('false');
  });

  it('help chrome wrappers: open/close toggle hidden + aria-hidden', () => {
    shell = mount();
    const help = shell.helpModal as HTMLElement;
    expect(help.classList.contains('hidden')).toBe(true);
    expect(help.getAttribute('aria-hidden')).toBe('true');

    // void openHelpModal / closeHelpModal wrappers (overlay :592,:593)
    shell.helpBtn?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(help.classList.contains('hidden')).toBe(false);
    expect(help.getAttribute('aria-hidden')).toBe('false');
    expect(help.getAttribute('role')).toBe('dialog');
    expect(help.getAttribute('aria-modal')).toBe('true');

    help
      .querySelector('.modal-close')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(help.classList.contains('hidden')).toBe(true);
    expect(help.getAttribute('aria-hidden')).toBe('true');
  });

  it('Escape with only new-game open restores focus to new-game trigger', () => {
    shell = mount();
    shell.newGameBtn?.focus();
    shell.newGameBtn?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(shell.newGameModal!.classList.contains('hidden')).toBe(false);
    expect(shell.helpModal!.classList.contains('hidden')).toBe(true);

    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
    );
    expect(shell.newGameModal!.classList.contains('hidden')).toBe(true);
    expect(document.activeElement).toBe(shell.newGameBtn);
  });

  it('Escape with neither modal open leaves chrome untouched', () => {
    shell = mount();
    expect(shell.newGameModal!.classList.contains('hidden')).toBe(true);
    expect(shell.helpModal!.classList.contains('hidden')).toBe(true);

    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
    );
    expect(shell.newGameModal!.classList.contains('hidden')).toBe(true);
    expect(shell.helpModal!.classList.contains('hidden')).toBe(true);
  });

  it('open modal soft-falls to modal focus when start btn is display:none', () => {
    shell = mount();
    const modal = shell.newGameModal as HTMLElement;
    const start = modal.querySelector('#start-game-btn') as HTMLElement;
    start.style.display = 'none';

    shell.newGameBtn?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(modal.classList.contains('hidden')).toBe(false);
    // isDisplayedWithin rejects start; focus lands on another control (not start).
    expect(document.activeElement).not.toBe(start);
    expect(modal.contains(document.activeElement)).toBe(true);
  });

  it('open modal soft-falls to modal itself when all controls are hidden', () => {
    shell = mount();
    const modal = shell.newGameModal as HTMLElement;
    const content = modal.querySelector('.modal-content') as HTMLElement;
    content.style.display = 'none';

    shell.newGameBtn?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(modal.classList.contains('hidden')).toBe(false);
    expect(modal.getAttribute('tabindex')).toBe('-1');
    expect(document.activeElement).toBe(modal);
  });

  it('Tab trap soft-fails when open dialog has zero focusables', () => {
    shell = mount();
    const modal = shell.newGameModal as HTMLElement;
    shell.newGameBtn?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(modal.classList.contains('hidden')).toBe(false);

    // Strip every focusable after open — trapModalTabKey empty-list branch.
    modal
      .querySelectorAll('button, input, select, textarea, a[href], [tabindex]')
      .forEach((el) => el.remove());
    expect(getFocusableWithin(modal)).toHaveLength(0);

    const tab = new KeyboardEvent('keydown', {
      key: 'Tab',
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(tab);
    // Soft-fail preventDefault; jsdom may not move focus onto a bare dialog.
    expect(tab.defaultPrevented).toBe(true);
    expect(modal.classList.contains('hidden')).toBe(false);
  });

  it('custom mount without region gets soft aria chrome on the board', () => {
    shell = mountGameShell(container, {
      title: 'Region Soft',
      helpTitle: 'Help',
      helpContentHtml: '<p>r</p>',
      modeRadioName: 'q277-region',
      mountId: 'custom-mount',
      gameAreaHtml: '<div id="custom-mount" class="bare-mount"></div>',
      onNavigateHome: () => undefined,
      onStartGame: () => undefined,
    });

    expect(shell.board?.id).toBe('custom-mount');
    expect(shell.board?.getAttribute('role')).toBe('region');
    expect(shell.board?.getAttribute('aria-labelledby')).toBe('game-title');
  });

  it('custom mount that already has role keeps it when soft-labelling', () => {
    shell = mountGameShell(container, {
      title: 'Region Keep',
      helpTitle: 'Help',
      helpContentHtml: '<p>r</p>',
      modeRadioName: 'q277-region-keep',
      mountId: 'custom-mount',
      gameAreaHtml:
        '<div id="custom-mount" role="group" class="bare-mount"></div>',
      onNavigateHome: () => undefined,
      onStartGame: () => undefined,
    });

    expect(shell.board?.getAttribute('role')).toBe('group');
    expect(shell.board?.getAttribute('aria-labelledby')).toBe('game-title');
  });
});
