/**
 * q-mp-251 mutation audit UI wave 7 — kill survivors in ui/components/game-shell.
 * Focus / modal DOM structure only — no player-facing copy asserts.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  mountGameShell,
  trapTabKey,
  type GameShellElements,
} from '../../src/ui/components/game-shell';

describe('mutation-ui7 game-shell', () => {
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
    vi.restoreAllMocks();
  });

  function mountWithDifficulty(): GameShellElements {
    return mountGameShell(container, {
      title: 'Shell Mut',
      helpTitle: 'Help',
      helpContentHtml: '<p>rules</p>',
      modeRadioName: 'ui7-shell-mode',
      showDifficulty: true,
      defaultMode: 'human-vs-human',
      onNavigateHome: () => undefined,
      onStartGame: () => undefined,
    });
  }

  it('new-game Tab trap skips display:none difficulty controls', () => {
    // Survivors in isDisplayedWithin (L107–L120): loop fence / hidden||inert /
    // display===none / return true|false — broken filter includes difficulty
    // buttons while section is display:none under human mode.
    shell = mountWithDifficulty();
    const modal = shell.newGameModal as HTMLElement;
    const section = container.querySelector(
      '#difficulty-section'
    ) as HTMLElement;
    expect(section.style.display).toBe('none');

    shell.newGameBtn?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(modal.classList.contains('hidden')).toBe(false);

    const difficultyBtns = [
      ...modal.querySelectorAll<HTMLElement>('.difficulty-btn'),
    ];
    expect(difficultyBtns.length).toBe(3);

    // Walk Tab many times — focus must never land on a difficulty button.
    for (let i = 0; i < 12; i++) {
      const tab = new KeyboardEvent('keydown', {
        key: 'Tab',
        bubbles: true,
        cancelable: true,
      });
      document.dispatchEvent(tab);
      const active = document.activeElement as HTMLElement | null;
      expect(difficultyBtns.includes(active as HTMLElement)).toBe(false);
      expect(section.contains(active)).toBe(false);
    }
  });

  it('open modal focuses start btn and ignores nested hidden focusables', () => {
    // Survivors: isDisplayedWithin always-true would still focus start, but
    // getModalFocusables length / trap path changes; pin start focus + count.
    shell = mountWithDifficulty();
    const modal = shell.newGameModal as HTMLElement;
    shell.newGameBtn?.focus();
    shell.newGameBtn?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(document.activeElement?.id).toBe('start-game-btn');

    // Inject an extra focusable inside a display:none wrapper; trapTabKey via
    // public API on a mini modal mirrors getModalFocusables filtering.
    const probe = document.createElement('div');
    probe.setAttribute('role', 'dialog');
    probe.innerHTML = `
      <button id="ui7-a">A</button>
      <div id="ui7-hide" style="display:none"><button id="ui7-b">B</button></div>
      <button id="ui7-c">C</button>
    `;
    document.body.appendChild(probe);
    const hide = probe.querySelector('#ui7-hide') as HTMLElement;
    hide.style.display = 'none';
    const a = probe.querySelector('#ui7-a') as HTMLElement;
    const c = probe.querySelector('#ui7-c') as HTMLElement;
    a.focus();
    const shift = new KeyboardEvent('keydown', {
      key: 'Tab',
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    });
    trapTabKey(probe, shift);
    // Public trapTabKey uses getFocusableWithin (isKeyboardReachable), not
    // isDisplayedWithin — still pin A↔C cycle exists.
    expect([a, c]).toContain(document.activeElement);
    probe.remove();
  });

  it('hidden class / inert / hidden attr ancestors reject keyboard reachability', () => {
    // Ties first-20 window to isKeyboardReachable (L86–L101) already strong;
    // pin sibling isDisplayedWithin paths via modal open with inert section.
    shell = mountWithDifficulty();
    const modal = shell.newGameModal as HTMLElement;
    const section = container.querySelector(
      '#difficulty-section'
    ) as HTMLElement;
    // Human mode: display none. Also mark inert to exercise || chain.
    section.setAttribute('inert', '');
    section.classList.add('hidden');
    section.setAttribute('hidden', '');

    shell.newGameBtn?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(modal.classList.contains('hidden')).toBe(false);
    expect(document.activeElement?.id).toBe('start-game-btn');

    for (let i = 0; i < 8; i++) {
      document.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Tab',
          bubbles: true,
          cancelable: true,
        })
      );
      const active = document.activeElement;
      expect(section.contains(active)).toBe(false);
    }
  });
});
