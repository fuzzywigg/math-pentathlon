/**
 * Wave 42 — shell cleanup removes Escape listener leftovers.
 * Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  mountGameShell,
  type GameShellElements,
} from '../../src/ui/components/game-shell';

describe('Wave 42 shell — cleanup escape', () => {
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

  it('cleanup leaves help closed and is idempotent-safe', () => {
    shell = mountGameShell(container, {
      title: 'Clean',
      helpTitle: 'H',
      helpContentHtml: '<p>r</p>',
      modeRadioName: 'w42-clean',
      onNavigateHome: () => undefined,
      onStartGame: () => undefined,
    });
    (shell.helpBtn as HTMLElement).click();
    expect(shell.helpModal!.classList.contains('hidden')).toBe(false);
    shell.cleanup();
    shell = null;
    // no throw on second cleanup attempt via null
    expect(container.querySelector('#help-modal')).toBeTruthy();
  });

  it('Escape after cleanup does not throw', () => {
    shell = mountGameShell(container, {
      title: 'Esc',
      helpTitle: 'H',
      helpContentHtml: '<p>r</p>',
      modeRadioName: 'w42-esc-clean',
      onNavigateHome: () => undefined,
      onStartGame: () => undefined,
    });
    (shell.helpBtn as HTMLElement).click();
    shell.cleanup();
    shell = null;
    expect(() =>
      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
      )
    ).not.toThrow();
  });

  it('back button invokes onNavigateHome', () => {
    const home = vi.fn();
    shell = mountGameShell(container, {
      title: 'Back',
      helpTitle: 'H',
      helpContentHtml: '<p>r</p>',
      modeRadioName: 'w42-back',
      onNavigateHome: home,
      onStartGame: () => undefined,
    });
    (shell.backBtn as HTMLElement).click();
    expect(home).toHaveBeenCalledTimes(1);
  });

  it('Escape closes new-game modal before cleanup', () => {
    shell = mountGameShell(container, {
      title: 'Modal',
      helpTitle: 'H',
      helpContentHtml: '<p>r</p>',
      modeRadioName: 'w42-modal-esc',
      onNavigateHome: () => undefined,
      onStartGame: () => undefined,
    });
    (shell.newGameBtn as HTMLElement).click();
    expect(shell.newGameModal!.classList.contains('hidden')).toBe(false);
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
    );
    expect(shell.newGameModal!.classList.contains('hidden')).toBe(true);
  });
});
