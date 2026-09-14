/**
 * Wave 36 — mountGameShell defaultMode AI shows difficulty section.
 * Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { mountGameShell, type GameShellElements } from '../../src/ui/components/game-shell';

describe('Wave 36 game-shell — AI default difficulty visible', () => {
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

  it('opens New Game with difficulty section display block when defaultMode is AI', () => {
    const onStart = vi.fn();
    shell = mountGameShell(container, {
      title: 'AI Default',
      helpTitle: 'Help',
      helpContentHtml: '<p>x</p>',
      modeRadioName: 'w36-ai-mode',
      defaultMode: 'human-vs-ai',
      showDifficulty: true,
      onNavigateHome: () => undefined,
      onStartGame: onStart,
    });

    container.querySelector('#new-game-btn')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    const section = container.querySelector('#difficulty-section') as HTMLElement;
    expect(section).toBeTruthy();
    expect(section.style.display).toBe('block');

    (container.querySelector('#start-game-btn') as HTMLElement).click();
    expect(onStart).toHaveBeenCalledWith('human-vs-ai', 'medium');
  });
});
