/**
 * Wave 44 overnight HEAVY — a11y live status on shell status mount.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mountGameShell, type GameShellElements } from '../../src/ui/components/game-shell';
import { markStatusLive } from '../../src/ui/board-a11y';

describe('Wave 44 handshake — a11y × shell status', () => {
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

  it('marks shell status as polite live region', () => {
    shell = mountGameShell(container, {
      title: 'G',
      helpTitle: 'H',
      helpContentHtml: '<p>r</p>',
      modeRadioName: 'w44-live',
      onNavigateHome: () => undefined,
      onStartGame: () => undefined,
    });
    markStatusLive(shell.status!);
    expect(shell.status!.getAttribute('role')).toBe('status');
    expect(shell.status!.getAttribute('aria-live')).toBe('polite');
  });
});
