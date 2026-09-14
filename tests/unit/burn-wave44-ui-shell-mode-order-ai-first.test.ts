/**
 * Wave 44 overnight HEAVY — shell modeOrder AI-first defaultMode.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mountGameShell, type GameShellElements } from '../../src/ui/components/game-shell';

describe('Wave 44 UI — shell mode order', () => {
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

  it('defaultMode ai puts AI option first selected', () => {
    shell = mountGameShell(container, {
      title: 'O',
      helpTitle: 'H',
      helpContentHtml: '<p>r</p>',
      modeRadioName: 'w44-order',
      defaultMode: 'human-vs-ai',
      onNavigateHome: () => undefined,
      onStartGame: () => undefined,
    });
    const options = [...container.querySelectorAll('.mode-option')];
    expect(options[0].getAttribute('data-mode')).toBe('human-vs-ai');
    expect(options[0].classList.contains('selected')).toBe(true);
  });
});
