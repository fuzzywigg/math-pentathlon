/**
 * Wave 44 overnight HEAVY — shell tutorial + history + custom area.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mountGameShell, type GameShellElements } from '../../src/ui/components/game-shell';

describe('Wave 44 UI — shell optional flags', () => {
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

  it('shows tutorial/history with default area', () => {
    const onTut = vi.fn();
    shell = mountGameShell(container, {
      title: 'T',
      helpTitle: 'H',
      helpContentHtml: '<p>x</p>',
      modeRadioName: 'w44-opt',
      showTutorial: true,
      showMoveHistory: true,
      onNavigateHome: () => undefined,
      onStartGame: () => undefined,
      onTutorial: onTut,
    });
    expect(shell.tutorialBtn).toBeTruthy();
    expect(shell.moveHistoryPanel).toBeTruthy();
    (shell.tutorialBtn as HTMLElement).click();
    expect(onTut).toHaveBeenCalled();
    (shell.moveHistoryPanel!.querySelector('.collapse-toggle') as HTMLElement).click();
    expect(shell.moveHistoryPanel!.classList.contains('collapsed')).toBe(true);
  });

  it('custom gameAreaHtml + mountId replaces default board', () => {
    shell = mountGameShell(container, {
      title: 'T',
      helpTitle: 'H',
      helpContentHtml: '<p>x</p>',
      modeRadioName: 'w44-custom',
      showStatus: false,
      gameAreaHtml: '<div id="custom-mount"></div>',
      mountId: 'custom-mount',
      onNavigateHome: () => undefined,
      onStartGame: () => undefined,
    });
    expect(shell.status).toBeNull();
    expect(shell.board?.id).toBe('custom-mount');
    expect(shell.moveHistoryPanel).toBeNull();
  });
});
