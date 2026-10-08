/**
 * Keyboard/SR audit — shell modal dialog semantics + Tab focus trap.
 * No rules/scoring changes.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  mountGameShell,
  type GameShellElements,
} from '../../src/ui/components/game-shell';

describe('Keyboard/SR — shell modal focus trap', () => {
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

  it('marks New Game modal as dialog + aria-modal with labelled title', () => {
    shell = mountGameShell(container, {
      title: 'Hex',
      helpTitle: 'How to Play Hex',
      helpContentHtml: '<p>Rules</p>',
      modeRadioName: 'kb-sr-modal',
      onNavigateHome: () => undefined,
      onStartGame: () => undefined,
    });

    const modal = shell.newGameModal!;
    expect(modal.getAttribute('role')).toBe('dialog');
    expect(modal.getAttribute('aria-modal')).toBe('true');
    expect(modal.getAttribute('aria-labelledby')).toBeTruthy();
    const title = modal.querySelector('h2');
    expect(title?.id).toBe(modal.getAttribute('aria-labelledby'));
  });

  it('moves focus into New Game modal and restores opener on Escape', () => {
    shell = mountGameShell(container, {
      title: 'Hex',
      helpTitle: 'How',
      helpContentHtml: '<p>r</p>',
      modeRadioName: 'kb-sr-focus',
      onNavigateHome: () => undefined,
      onStartGame: () => undefined,
    });

    const opener = shell.newGameBtn as HTMLButtonElement;
    opener.focus();
    expect(document.activeElement).toBe(opener);

    opener.click();
    expect(shell.newGameModal!.classList.contains('hidden')).toBe(false);
    expect(shell.newGameModal!.contains(document.activeElement)).toBe(true);

    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
    );
    expect(shell.newGameModal!.classList.contains('hidden')).toBe(true);
    expect(document.activeElement).toBe(opener);
  });

  it('traps Tab at the last focusable inside an open Help modal', () => {
    shell = mountGameShell(container, {
      title: 'Hex',
      helpTitle: 'How to Play',
      helpContentHtml: '<p>Rules</p>',
      modeRadioName: 'kb-sr-trap',
      onNavigateHome: () => undefined,
      onStartGame: () => undefined,
    });

    (shell.helpBtn as HTMLButtonElement).click();
    const modal = shell.helpModal!;
    expect(modal.classList.contains('hidden')).toBe(false);

    const focusables = Array.from(
      modal.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([type="hidden"]):not([disabled])'
      )
    );
    expect(focusables.length).toBeGreaterThan(0);
    const last = focusables[focusables.length - 1];
    last.focus();
    expect(document.activeElement).toBe(last);

    // Outside control that must not receive focus while modal is open.
    const outside = shell.newGameBtn as HTMLButtonElement;

    document.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Tab',
        bubbles: true,
        cancelable: true,
      })
    );
    expect(modal.contains(document.activeElement)).toBe(true);
    expect(document.activeElement).not.toBe(outside);
  });
});
