/**
 * Keyboard a11y — shell modals: dialog semantics, focus move-in,
 * Escape/close restores trigger, Tab stays inside the dialog.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import {
  mountGameShell,
  getFocusableWithin,
  trapTabKey,
  type GameShellElements,
} from '../../src/ui/components/game-shell';

async function flushMicrotasks(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
}

describe('Keyboard a11y — shell modals', () => {
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

  function mount(): GameShellElements {
    shell = mountGameShell(container, {
      title: 'Keyboard Probe',
      helpTitle: 'How to Play Probe',
      helpContentHtml: '<p>Rules body</p>',
      modeRadioName: 'kb-a11y-mode',
      showDifficulty: true,
      onNavigateHome: () => undefined,
      onStartGame: () => undefined,
    });
    return shell;
  }

  it('New Game / Help modals expose dialog + aria-modal + labelled title', () => {
    mount();
    const newGame = container.querySelector('#new-game-modal') as HTMLElement;
    const help = container.querySelector('#help-modal') as HTMLElement;

    expect(newGame.getAttribute('role')).toBe('dialog');
    expect(newGame.getAttribute('aria-modal')).toBe('true');
    expect(newGame.getAttribute('aria-labelledby')).toBe('new-game-modal-title');
    expect(container.querySelector('#new-game-modal-title')?.textContent).toBe(
      'New Game'
    );

    expect(help.getAttribute('role')).toBe('dialog');
    expect(help.getAttribute('aria-modal')).toBe('true');
    expect(help.getAttribute('aria-labelledby')).toBe('help-modal-title');
  });

  it('opening New Game moves focus into the dialog', async () => {
    const s = mount();
    const btn = s.newGameBtn as HTMLButtonElement;
    btn.focus();
    btn.click();
    await flushMicrotasks();

    const modal = s.newGameModal!;
    expect(modal.classList.contains('hidden')).toBe(false);
    expect(modal.contains(document.activeElement)).toBe(true);
  });

  it('Escape closes New Game and returns focus to the trigger', async () => {
    const s = mount();
    const btn = s.newGameBtn as HTMLButtonElement;
    btn.focus();
    btn.click();
    await flushMicrotasks();
    expect(s.newGameModal!.classList.contains('hidden')).toBe(false);

    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
    );
    await flushMicrotasks();

    expect(s.newGameModal!.classList.contains('hidden')).toBe(true);
    expect(document.activeElement).toBe(btn);
  });

  it('Help close button returns focus to How to Play', async () => {
    const s = mount();
    const btn = s.helpBtn as HTMLButtonElement;
    btn.focus();
    btn.click();
    await flushMicrotasks();
    expect(s.helpModal!.classList.contains('hidden')).toBe(false);

    const close = s.helpModal!.querySelector('.modal-close') as HTMLButtonElement;
    close.click();
    await flushMicrotasks();

    expect(s.helpModal!.classList.contains('hidden')).toBe(true);
    expect(document.activeElement).toBe(btn);
  });

  it('Tab trap cycles within an open New Game dialog', () => {
    const s = mount();
    (s.newGameBtn as HTMLElement).click();
    const modal = s.newGameModal!;
    const focusables = getFocusableWithin(modal);
    expect(focusables.length).toBeGreaterThan(1);

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    last.focus();
    expect(document.activeElement).toBe(last);

    const tab = new KeyboardEvent('keydown', {
      key: 'Tab',
      bubbles: true,
      cancelable: true,
    });
    trapTabKey(modal, tab);
    expect(tab.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(first);

    const shiftTab = new KeyboardEvent('keydown', {
      key: 'Tab',
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    });
    first.focus();
    trapTabKey(modal, shiftTab);
    expect(shiftTab.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(last);
  });
});
