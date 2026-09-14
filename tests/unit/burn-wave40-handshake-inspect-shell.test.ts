/**
 * Wave 40 — handshake inspect map × game-shell chrome.
 * Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { mountGameShell, type GameShellElements } from '../../src/ui/components/game-shell';
import { resolveInspectTarget } from '../../src/core/owl/ollie-inspect-map';

describe('Wave 40 handshake — inspect × shell', () => {
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

  it('shell help/tutorial/new-game/back resolve as chrome', () => {
    shell = mountGameShell(container, {
      title: 'Inspect',
      helpTitle: 'H',
      helpContentHtml: '<p>x</p>',
      modeRadioName: 'w40-insp',
      showTutorial: true,
      onNavigateHome: () => undefined,
      onStartGame: () => undefined,
      onTutorial: () => undefined,
    });
    expect(resolveInspectTarget(container.querySelector('#help-btn'))).toEqual({
      kind: 'chrome',
      chrome: 'howto',
    });
    const tut = container.querySelector('#tutorial-btn');
    if (tut) {
      expect(resolveInspectTarget(tut)).toEqual({ kind: 'chrome', chrome: 'tutorial' });
    }
    expect(resolveInspectTarget(container.querySelector('#new-game-btn'))).toEqual({
      kind: 'chrome',
      chrome: 'new-game',
    });
    expect(resolveInspectTarget(container.querySelector('#back-btn'))).toEqual({
      kind: 'chrome',
      chrome: 'back',
    });
  });
});
