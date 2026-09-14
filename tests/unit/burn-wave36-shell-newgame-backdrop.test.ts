/**
 * Wave 36 — New Game modal backdrop close leftover.
 * Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { mountGameShell, type GameShellElements } from '../../src/ui/components/game-shell';

describe('Wave 36 game-shell — new-game backdrop', () => {
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

  it('backdrop click closes; inner content click does not', () => {
    shell = mountGameShell(container, {
      title: 'Backdrop',
      helpTitle: 'Help',
      helpContentHtml: '<p>x</p>',
      modeRadioName: 'w36-bg',
      onNavigateHome: () => undefined,
      onStartGame: () => undefined,
    });
    const modal = container.querySelector('#new-game-modal') as HTMLElement;
    (container.querySelector('#new-game-btn') as HTMLElement).click();
    expect(modal.classList.contains('hidden')).toBe(false);

    const content = modal.querySelector('.modal-content') as HTMLElement;
    content.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(modal.classList.contains('hidden')).toBe(false);

    modal.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(modal.classList.contains('hidden')).toBe(true);
  });
});
