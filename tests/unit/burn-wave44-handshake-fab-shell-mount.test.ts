/**
 * Wave 44 overnight HEAVY — fab title shell mount handshake.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mountGameShell, type GameShellElements } from '../../src/ui/components/game-shell';
import { createInitialState } from '../../src/games/fab-a-diffy/rules';

describe('Wave 44 handshake — fab × shell', () => {
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

  it('shell mounts while fab state opens independently', () => {
    shell = mountGameShell(container, {
      title: 'Fab-a-Diffy',
      helpTitle: 'How to Play',
      helpContentHtml: '<p>Combine fractions</p>',
      modeRadioName: 'fab-mode',
      showTutorial: true,
      onNavigateHome: () => undefined,
      onStartGame: () => undefined,
    });
    const s = createInitialState();
    expect(shell.board).toBeTruthy();
    expect(s.phase).toBe('selectingBar1');
    expect(container.querySelector('h1')?.textContent).toBe('Fab-a-Diffy');
  });
});
