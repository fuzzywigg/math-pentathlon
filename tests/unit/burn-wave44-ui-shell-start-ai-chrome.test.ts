/**
 * Wave 44 overnight HEAVY — shell start applies vs-AI chrome.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mountGameShell, type GameShellElements } from '../../src/ui/components/game-shell';

describe('Wave 44 UI — shell AI chrome on start', () => {
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

  it('start vs AI stamps data-opponent and calls onStartGame', () => {
    const onStart = vi.fn();
    shell = mountGameShell(container, {
      title: 'AI',
      helpTitle: 'H',
      helpContentHtml: '<p>r</p>',
      modeRadioName: 'w44-ai',
      showDifficulty: true,
      defaultDifficulty: 'medium',
      onNavigateHome: () => undefined,
      onStartGame: onStart,
    });
    (shell.newGameBtn as HTMLElement).click();
    (container.querySelector('.mode-option[data-mode="human-vs-ai"]') as HTMLElement).click();
    (container.querySelector('#start-game-btn') as HTMLElement).click();
    expect(onStart).toHaveBeenCalledWith('human-vs-ai', 'medium');
    expect(container.dataset.opponent).toBe('ai');
    expect(container.classList.contains('game-vs-ai')).toBe(true);
  });
});
