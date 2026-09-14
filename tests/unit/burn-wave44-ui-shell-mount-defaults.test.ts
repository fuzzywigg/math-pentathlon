/**
 * Wave 44 overnight HEAVY — game-shell mount defaults / chrome.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mountGameShell, type GameShellElements } from '../../src/ui/components/game-shell';

describe('Wave 44 UI — shell mount defaults', () => {
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

  it('mounts board/status and stamps human chrome until start', () => {
    shell = mountGameShell(container, {
      title: 'Fab',
      helpTitle: 'Help',
      helpContentHtml: '<p>rules</p>',
      modeRadioName: 'w44-fab',
      onNavigateHome: () => undefined,
      onStartGame: () => undefined,
    });
    expect(shell.board).toBeTruthy();
    expect(shell.status).toBeTruthy();
    expect(container.querySelector('h1')?.textContent).toBe('Fab');
    expect(container.dataset.opponent).toBeUndefined();
    expect(container.querySelector('#tutorial-btn')).toBeNull();
    expect(container.querySelector('#move-history')).toBeNull();
  });
});
