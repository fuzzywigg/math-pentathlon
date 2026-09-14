/**
 * Wave 42 — shell modeOrder + mode chrome leftovers.
 * Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  mountGameShell,
  type GameShellElements,
} from '../../src/ui/components/game-shell';

describe('Wave 42 shell — mode order chrome', () => {
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

  it('default modeOrder places human-vs-human first', () => {
    shell = mountGameShell(container, {
      title: 'Modes',
      helpTitle: 'H',
      helpContentHtml: '<p>r</p>',
      modeRadioName: 'w42-mode-def',
      onNavigateHome: () => undefined,
      onStartGame: () => undefined,
    });
    const modes = [...container.querySelectorAll('.mode-option')].map((el) =>
      (el as HTMLElement).dataset.mode
    );
    expect(modes[0]).toBe('human-vs-human');
    expect(modes).toContain('human-vs-ai');
  });

  it('modeOrder AI-first flips option order', () => {
    shell = mountGameShell(container, {
      title: 'AI First',
      helpTitle: 'H',
      helpContentHtml: '<p>r</p>',
      modeRadioName: 'w42-mode-ai',
      modeOrder: ['human-vs-ai', 'human-vs-human'],
      onNavigateHome: () => undefined,
      onStartGame: () => undefined,
    });
    const modes = [...container.querySelectorAll('.mode-option')].map((el) =>
      (el as HTMLElement).dataset.mode
    );
    expect(modes[0]).toBe('human-vs-ai');
  });

  it('mount starts with human chrome on container', () => {
    shell = mountGameShell(container, {
      title: 'Chrome',
      helpTitle: 'H',
      helpContentHtml: '<p>r</p>',
      modeRadioName: 'w42-chrome',
      defaultMode: 'human-vs-ai',
      onNavigateHome: () => undefined,
      onStartGame: () => undefined,
    });
    // Games init as human until Start — chrome stamped human
    expect(container.dataset.opponent).toBeUndefined();
  });

  it('selecting AI mode and start applies via callback args', () => {
    const onStart = vi.fn();
    shell = mountGameShell(container, {
      title: 'Start',
      helpTitle: 'H',
      helpContentHtml: '<p>r</p>',
      modeRadioName: 'w42-start',
      onNavigateHome: () => undefined,
      onStartGame: onStart,
    });
    (shell.newGameBtn as HTMLElement).click();
    (
      container.querySelector(
        '.mode-option[data-mode="human-vs-ai"]'
      ) as HTMLElement
    ).click();
    (container.querySelector('#start-game-btn') as HTMLElement).click();
    // showDifficulty defaults false → difficulty arg is undefined
    expect(onStart).toHaveBeenCalledWith('human-vs-ai', undefined);
  });

  it('title appears in header chrome', () => {
    shell = mountGameShell(container, {
      title: 'Wave42 Title',
      helpTitle: 'H',
      helpContentHtml: '<p>r</p>',
      modeRadioName: 'w42-title',
      onNavigateHome: () => undefined,
      onStartGame: () => undefined,
    });
    expect(container.textContent).toContain('Wave42 Title');
  });
});
