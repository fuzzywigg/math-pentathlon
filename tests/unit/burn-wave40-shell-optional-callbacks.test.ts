/**
 * Wave 40 — game-shell optional callbacks omit leftovers.
 * Tests-only after #178.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import {
  mountGameShell,
  type GameShellElements,
} from '../../src/ui/components/game-shell';

describe('Wave 40 shell — optional callbacks', () => {
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
  });

  it('minimal mount omits tutorial; cleanup idempotent', () => {
    shell = mountGameShell(container, {
      title: 'Wave40 Shell',
      helpTitle: 'Help',
      helpContentHtml: '<p>rules</p>',
      modeRadioName: 'w40-mode',
      showTutorial: false,
      onNavigateHome: () => undefined,
      onStartGame: () => undefined,
    });
    expect(container.querySelector('#tutorial-btn')).toBeNull();
    expect(container.querySelector('h1')?.textContent).toBe('Wave40 Shell');
    shell.cleanup();
    shell.cleanup();
  });

  it('human-vs-human start does not stamp AI chrome', () => {
    shell = mountGameShell(container, {
      title: 'HvH',
      helpTitle: 'Help',
      helpContentHtml: '<p>x</p>',
      modeRadioName: 'w40-hvh',
      showTutorial: false,
      onNavigateHome: () => undefined,
      onStartGame: () => undefined,
    });
    const hvh = container.querySelector(
      'input[value="human-vs-human"]'
    ) as HTMLInputElement | null;
    hvh?.click();
    container.querySelector('#start-game-btn')?.dispatchEvent(
      new MouseEvent('click', { bubbles: true })
    );
    expect(container.dataset.opponent).toBeUndefined();
  });
});
