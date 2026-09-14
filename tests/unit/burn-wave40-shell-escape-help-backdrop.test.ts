/**
 * Wave 40 — shell Escape closes help + help backdrop leftovers.
 * Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import {
  mountGameShell,
  type GameShellElements,
} from '../../src/ui/components/game-shell';

describe('Wave 40 shell — escape help backdrop', () => {
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

  it('Escape closes open help modal', () => {
    shell = mountGameShell(container, {
      title: 'Esc Help',
      helpTitle: 'Rules',
      helpContentHtml: '<p>help body</p>',
      modeRadioName: 'w40-esc-help',
      onNavigateHome: () => undefined,
      onStartGame: () => undefined,
    });
    const help = shell.helpModal!;
    (shell.helpBtn as HTMLElement).click();
    expect(help.classList.contains('hidden')).toBe(false);
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
    );
    expect(help.classList.contains('hidden')).toBe(true);
  });

  it('help backdrop click closes; inner content click does not', () => {
    shell = mountGameShell(container, {
      title: 'Help Backdrop',
      helpTitle: 'How',
      helpContentHtml: '<p>x</p>',
      modeRadioName: 'w40-help-bg',
      onNavigateHome: () => undefined,
      onStartGame: () => undefined,
    });
    const help = shell.helpModal!;
    (shell.helpBtn as HTMLElement).click();
    expect(help.classList.contains('hidden')).toBe(false);

    const content = help.querySelector('.modal-content') as HTMLElement;
    content.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(help.classList.contains('hidden')).toBe(false);

    help.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(help.classList.contains('hidden')).toBe(true);
  });

  it('Escape closes both help and new-game when both open', () => {
    shell = mountGameShell(container, {
      title: 'Both',
      helpTitle: 'H',
      helpContentHtml: '<p>r</p>',
      modeRadioName: 'w40-both',
      onNavigateHome: () => undefined,
      onStartGame: () => undefined,
    });
    (shell.newGameBtn as HTMLElement).click();
    (shell.helpBtn as HTMLElement).click();
    expect(shell.newGameModal!.classList.contains('hidden')).toBe(false);
    expect(shell.helpModal!.classList.contains('hidden')).toBe(false);
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
    );
    expect(shell.newGameModal!.classList.contains('hidden')).toBe(true);
    expect(shell.helpModal!.classList.contains('hidden')).toBe(true);
  });

  it('non-Escape keydown does not close help', () => {
    shell = mountGameShell(container, {
      title: 'Key',
      helpTitle: 'H',
      helpContentHtml: '<p>r</p>',
      modeRadioName: 'w40-key',
      onNavigateHome: () => undefined,
      onStartGame: () => undefined,
    });
    (shell.helpBtn as HTMLElement).click();
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    expect(shell.helpModal!.classList.contains('hidden')).toBe(false);
  });

  it('help close button hides modal', () => {
    shell = mountGameShell(container, {
      title: 'Close',
      helpTitle: 'H',
      helpContentHtml: '<p>r</p>',
      modeRadioName: 'w40-close',
      onNavigateHome: () => undefined,
      onStartGame: () => undefined,
    });
    (shell.helpBtn as HTMLElement).click();
    shell.helpModal!.querySelector('.modal-close')!.dispatchEvent(
      new MouseEvent('click', { bubbles: true })
    );
    expect(shell.helpModal!.classList.contains('hidden')).toBe(true);
  });
});
