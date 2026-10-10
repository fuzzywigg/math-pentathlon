/**
 * q-mp-636 — Close `game-shell` residual gaps (tests-only).
 *
 * Live tip re-measure (`cursor/mp-tip-post1023` @ `166d132d`):
 *   `src/ui/components/game-shell.ts` under `*game-shell*` suites:
 *     **97.07%** lines (232/239) / **91.58%** branches (185/202)
 *   Uncovered clusters (matches backlog): ~198, 214, 218, 224, 540
 *     (+ keep-sites / adjacent: 113 isDisplayedWithin class|hidden|inert,
 *      146 title.id assign when h2 lacks id).
 *
 * Leave tip-folded / older game-shell drafts with **contained**:
 *   `#989`/`516` nnnull, soft-fail chrome `#776`/`277`, mutation ui7/ui17.
 *
 * Constraints: tests only; ZERO `src/` edits; structural asserts only
 * (classList, focus, defaultPrevented, aria-*, callbacks) — no player-facing
 * copy / aria / label string pins; no AI / rules / scoring; no ratchet JSON;
 * Hex Hard 450ms untouched; no network.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  getFocusableWithin,
  mountGameShell,
  trapTabKey,
  type GameShellElements,
} from '../../src/ui/components/game-shell';

const GAME_SHELL_SRC = readFileSync(
  join(
    dirname(fileURLToPath(import.meta.url)),
    '../../src/ui/components/game-shell.ts'
  ),
  'utf8'
);

describe('q-mp-636 — game-shell residual keep-sites', () => {
  it('source keeps trapTabKey sparse-array defensive return (L223–224)', () => {
    // After length===0 return, `!first || !last` is unreachable for dense
    // Array.from().filter() results — keep-site only (no src edit).
    expect(GAME_SHELL_SRC).toMatch(
      /const first = items\[0\];[\s\S]*?const last = items\[items\.length - 1\];[\s\S]*?if\s*\(\s*!first\s*\|\|\s*!last\s*\)\s*\{\s*return\s*;/
    );
  });

  it('source keeps isDisplayedWithin class|hidden|inert false arm (L108–113)', () => {
    // getFocusableWithin already rejects via isKeyboardReachable, so the
    // matching isDisplayedWithin OR-arm stays cold under modal paths.
    expect(GAME_SHELL_SRC).toMatch(
      /cur\.classList\.contains\('hidden'\)[\s\S]*?cur\.hasAttribute\('hidden'\)[\s\S]*?cur\.hasAttribute\('inert'\)[\s\S]*?return false;/
    );
  });
});

describe('q-mp-636 — game-shell residual branch arms', () => {
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

  function mount(
    overrides: Partial<Parameters<typeof mountGameShell>[1]> = {}
  ): GameShellElements {
    shell = mountGameShell(container, {
      title: 'Shell Residual',
      helpTitle: 'Help',
      helpContentHtml: '<p>rules</p>',
      modeRadioName: 'q636-mode',
      showDifficulty: true,
      defaultDifficulty: 'medium',
      onNavigateHome: () => undefined,
      onStartGame: () => undefined,
      ...overrides,
    });
    return shell;
  }

  it('trapTabKey no-ops on non-Tab keys (L213–214)', () => {
    const probe = document.createElement('div');
    probe.setAttribute('role', 'dialog');
    probe.innerHTML = '<button id="q636-a" type="button">A</button>';
    document.body.appendChild(probe);
    const btn = probe.querySelector('#q636-a') as HTMLButtonElement;
    btn.focus();

    const escape = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true,
      cancelable: true,
    });
    trapTabKey(probe, escape);

    expect(escape.defaultPrevented).toBe(false);
    expect(document.activeElement).toBe(btn);
    probe.remove();
  });

  it('trapTabKey no-ops when dialog has zero focusables (L217–218)', () => {
    const probe = document.createElement('div');
    probe.setAttribute('role', 'dialog');
    probe.innerHTML = '<p id="q636-empty">plain</p>';
    document.body.appendChild(probe);
    expect(getFocusableWithin(probe)).toHaveLength(0);

    const tab = new KeyboardEvent('keydown', {
      key: 'Tab',
      bubbles: true,
      cancelable: true,
    });
    trapTabKey(probe, tab);

    expect(tab.defaultPrevented).toBe(false);
    expect(document.activeElement).not.toBe(probe);
    probe.remove();
  });

  it('new-game modal backdrop click closes the dialog (L538–540)', () => {
    shell = mount();
    const modal = shell.newGameModal as HTMLElement;
    expect(modal.classList.contains('hidden')).toBe(true);

    shell.newGameBtn?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(modal.classList.contains('hidden')).toBe(false);
    expect(modal.getAttribute('aria-hidden')).toBe('false');

    // Mirror help-modal backdrop wiring already covered in wave-24 — target
    // must be the modal root (not .modal-content) to hit L540.
    const backdrop = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperty(backdrop, 'target', {
      value: modal,
      configurable: true,
    });
    modal.dispatchEvent(backdrop);

    expect(modal.classList.contains('hidden')).toBe(true);
    expect(modal.getAttribute('aria-hidden')).toBe('true');
  });

  it('closing an already-hidden modal is a soft no-op (L197–198)', async () => {
    shell = mount();
    const modal = shell.newGameModal as HTMLElement;
    const closeBtn = modal.querySelector('.modal-close') as HTMLButtonElement;

    shell.newGameBtn?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(modal.classList.contains('hidden')).toBe(false);

    closeBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(modal.classList.contains('hidden')).toBe(true);

    // Second close while hidden — closeShellModal early-return arm.
    closeBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(modal.classList.contains('hidden')).toBe(true);
    expect(modal.getAttribute('aria-hidden')).toBe('true');

    // Focus restore microtask from the first close must not throw.
    await Promise.resolve();
    expect(modal.classList.contains('hidden')).toBe(true);
  });

  it('open assigns title id when h2 lacks one (L145–146)', () => {
    shell = mount();
    const modal = shell.newGameModal as HTMLElement;
    const title = modal.querySelector('h2') as HTMLHeadingElement;
    title.removeAttribute('id');
    modal.removeAttribute('aria-labelledby');
    // Drive `modal.id || 'game-modal'` right arm (title id prefix fallback).
    modal.removeAttribute('id');

    shell.newGameBtn?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(title.id).toBe('game-modal-title');
    expect(modal.getAttribute('aria-labelledby')).toBe(title.id);
    expect(modal.classList.contains('hidden')).toBe(false);
  });

  it('trapTabKey Shift+Tab wraps when focus is outside the dialog (L229)', () => {
    const probe = document.createElement('div');
    probe.setAttribute('role', 'dialog');
    probe.innerHTML = `
      <button id="q636-first" type="button">First</button>
      <button id="q636-last" type="button">Last</button>
    `;
    document.body.appendChild(probe);
    const first = probe.querySelector('#q636-first') as HTMLButtonElement;
    const last = probe.querySelector('#q636-last') as HTMLButtonElement;

    const outside = document.createElement('button');
    outside.type = 'button';
    outside.id = 'q636-outside';
    document.body.appendChild(outside);
    outside.focus();
    expect(probe.contains(document.activeElement)).toBe(false);

    const shift = new KeyboardEvent('keydown', {
      key: 'Tab',
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    });
    trapTabKey(probe, shift);

    expect(shift.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(last);
    expect(document.activeElement).not.toBe(first);

    outside.remove();
    probe.remove();
  });

  it('trapTabKey Tab wraps when focus is outside the dialog (L233)', () => {
    const probe = document.createElement('div');
    probe.setAttribute('role', 'dialog');
    probe.innerHTML = `
      <button id="q636-f2" type="button">First</button>
      <button id="q636-l2" type="button">Last</button>
    `;
    document.body.appendChild(probe);
    const first = probe.querySelector('#q636-f2') as HTMLButtonElement;

    const outside = document.createElement('button');
    outside.type = 'button';
    outside.id = 'q636-outside-2';
    document.body.appendChild(outside);
    outside.focus();

    const tab = new KeyboardEvent('keydown', {
      key: 'Tab',
      shiftKey: false,
      bubbles: true,
      cancelable: true,
    });
    trapTabKey(probe, tab);

    expect(tab.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(first);

    outside.remove();
    probe.remove();
  });

  it('help modal close while already hidden is a soft no-op', () => {
    shell = mount();
    const modal = shell.helpModal as HTMLElement;
    const closeBtn = modal.querySelector('.modal-close') as HTMLButtonElement;

    expect(modal.classList.contains('hidden')).toBe(true);
    closeBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(modal.classList.contains('hidden')).toBe(true);
    expect(modal.getAttribute('aria-hidden')).toBe('true');
  });
});
