/**
 * Wave 44 overnight HEAVY — shell help modal + back home.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mountGameShell, type GameShellElements } from '../../src/ui/components/game-shell';

describe('Wave 44 UI — shell help/back', () => {
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

  it('opens help and back navigates home', () => {
    const home = vi.fn();
    shell = mountGameShell(container, {
      title: 'X',
      helpTitle: 'How',
      helpContentHtml: '<p>help-body</p>',
      modeRadioName: 'w44-help',
      onNavigateHome: home,
      onStartGame: () => undefined,
    });
    (shell.helpBtn as HTMLElement).click();
    expect(shell.helpModal!.classList.contains('hidden')).toBe(false);
    expect(shell.helpModal!.textContent).toContain('help-body');
    (shell.backBtn as HTMLElement).click();
    expect(home).toHaveBeenCalled();
  });
});
