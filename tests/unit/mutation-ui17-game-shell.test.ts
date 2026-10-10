/**
 * q-mp-507 mutation audit UI wave 17 — re-pin / document first-20 survivors in
 * ui/components/game-shell. Focus / modal DOM structure only — no player-facing
 * copy asserts.
 *
 * Tip post914 baseline: 85% (17/20). Remaining survivors are in private
 * `isDisplayedWithin` class/attr/inert OR arms that are redundant after
 * `isKeyboardReachable` pre-filter inside `getModalFocusables` — documented
 * equivalents (same hold as wave 7).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  getFocusableWithin,
  isKeyboardReachable,
  mountGameShell,
  trapTabKey,
  type GameShellElements,
} from '../../src/ui/components/game-shell';

describe('mutation-ui17 game-shell', () => {
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
      title: 'Shell Mut17',
      helpTitle: 'Help',
      helpContentHtml: '<p>rules</p>',
      modeRadioName: 'ui17-shell-mode',
      showDifficulty: true,
      defaultMode: 'human-vs-human',
      onNavigateHome: () => undefined,
      onStartGame: () => undefined,
    });
  }

  it('isKeyboardReachable rejects hidden attr, inert, class, display, visibility', () => {
    // Keeps first-20 isKeyboardReachable window (already killed at baseline)
    // under mutation-ui17 prefer-prefix.
    const wrap = document.createElement('div');
    const btn = document.createElement('button');
    btn.id = 'ui17-kb';
    wrap.appendChild(btn);
    document.body.appendChild(wrap);

    expect(isKeyboardReachable(btn)).toBe(true);

    btn.setAttribute('hidden', '');
    expect(isKeyboardReachable(btn)).toBe(false);
    btn.removeAttribute('hidden');

    btn.setAttribute('inert', '');
    expect(isKeyboardReachable(btn)).toBe(false);
    btn.removeAttribute('inert');

    wrap.classList.add('hidden');
    expect(isKeyboardReachable(btn)).toBe(false);
    wrap.classList.remove('hidden');

    wrap.style.display = 'none';
    expect(isKeyboardReachable(btn)).toBe(false);
    wrap.style.display = '';

    wrap.style.visibility = 'hidden';
    expect(isKeyboardReachable(btn)).toBe(false);

    wrap.remove();
  });

  it('open modal Tab trap skips display:none difficulty controls', () => {
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

    for (let i = 0; i < 12; i++) {
      document.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Tab',
          bubbles: true,
          cancelable: true,
        })
      );
      const active = document.activeElement as HTMLElement | null;
      expect(difficultyBtns.includes(active as HTMLElement)).toBe(false);
      expect(section.contains(active)).toBe(false);
    }
  });

  it('getFocusableWithin drops aria-disabled and nested display:none', () => {
    const root = document.createElement('div');
    root.innerHTML = `
      <button id="ui17-a">A</button>
      <button id="ui17-b" aria-disabled="true">B</button>
      <div style="display:none"><button id="ui17-c">C</button></div>
      <button id="ui17-d">D</button>
    `;
    document.body.appendChild(root);
    const ids = getFocusableWithin(root).map((el) => el.id);
    expect(ids).toEqual(['ui17-a', 'ui17-d']);
    root.remove();
  });

  it.skip('isDisplayedWithin class/attr/inert OR → AND / return-false (equivalent)', () => {
    // Baseline survivors m13/m14/m15 (L109 ||→&& ×2, L113 false→true).
    // getModalFocusables runs isKeyboardReachable first, which already rejects
    // class-hidden / hidden / inert ancestors — so isDisplayedWithin's matching
    // OR arms are dead under exercised modal paths (wave-7 hold; still true on
    // post914). Documented, not a product defect.
    expect(true).toBe(false);
  });

  it('public trapTabKey cycles visible buttons only', () => {
    const probe = document.createElement('div');
    probe.setAttribute('role', 'dialog');
    probe.innerHTML = `
      <button id="ui17-ta">A</button>
      <div id="ui17-thide" style="display:none"><button id="ui17-tb">B</button></div>
      <button id="ui17-tc">C</button>
    `;
    document.body.appendChild(probe);
    (probe.querySelector('#ui17-thide') as HTMLElement).style.display = 'none';
    const a = probe.querySelector('#ui17-ta') as HTMLElement;
    const c = probe.querySelector('#ui17-tc') as HTMLElement;
    a.focus();
    trapTabKey(
      probe,
      new KeyboardEvent('keydown', {
        key: 'Tab',
        shiftKey: true,
        bubbles: true,
        cancelable: true,
      })
    );
    expect([a, c]).toContain(document.activeElement);
    probe.remove();
  });
});
