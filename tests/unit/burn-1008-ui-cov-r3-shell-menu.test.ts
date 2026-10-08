/**
 * burn-1008-mp-ui-coverage-round-3 — game-shell reachability/trap edges +
 * stats formatLastPlayed catch. Tests-only; pins current behavior.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getFocusableWithin,
  isKeyboardReachable,
  mountGameShell,
  trapTabKey,
  type GameShellElements,
} from '../../src/ui/components/game-shell';
import { formatLastPlayed } from '../../src/ui/stats-dashboard';

describe('burn-1008 ui-cov-r3 game-shell helpers', () => {
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

  it('isKeyboardReachable rejects hidden / inert / display:none ancestors', () => {
    const wrap = document.createElement('div');
    const child = document.createElement('button');
    wrap.appendChild(child);
    document.body.appendChild(wrap);
    expect(isKeyboardReachable(child)).toBe(true);

    wrap.setAttribute('hidden', '');
    expect(isKeyboardReachable(child)).toBe(false);
    wrap.removeAttribute('hidden');

    wrap.setAttribute('inert', '');
    expect(isKeyboardReachable(child)).toBe(false);
    wrap.removeAttribute('inert');

    wrap.classList.add('hidden');
    expect(isKeyboardReachable(child)).toBe(false);
    wrap.classList.remove('hidden');

    wrap.style.display = 'none';
    expect(isKeyboardReachable(child)).toBe(false);
    wrap.style.display = '';
    wrap.style.visibility = 'hidden';
    expect(isKeyboardReachable(child)).toBe(false);
    wrap.remove();
  });

  it('getFocusableWithin skips aria-disabled controls', () => {
    const root = document.createElement('div');
    const ok = document.createElement('button');
    ok.textContent = 'ok';
    const disabled = document.createElement('button');
    disabled.setAttribute('aria-disabled', 'true');
    disabled.textContent = 'no';
    root.append(ok, disabled);
    document.body.appendChild(root);
    const focusable = getFocusableWithin(root);
    expect(focusable).toContain(ok);
    expect(focusable).not.toContain(disabled);
    root.remove();
  });

  it('trapTabKey no-ops for non-Tab and empty focusables', () => {
    const modal = document.createElement('div');
    document.body.appendChild(modal);
    const enter = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
    const preventEnter = vi.spyOn(enter, 'preventDefault');
    trapTabKey(modal, enter);
    expect(preventEnter).not.toHaveBeenCalled();

    const tab = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true });
    const preventTab = vi.spyOn(tab, 'preventDefault');
    trapTabKey(modal, tab);
    expect(preventTab).not.toHaveBeenCalled();
    modal.remove();
  });

  it('trapTabKey wraps focus from last to first and Shift+Tab reverse', () => {
    const modal = document.createElement('div');
    const a = document.createElement('button');
    const b = document.createElement('button');
    a.textContent = 'a';
    b.textContent = 'b';
    modal.append(a, b);
    document.body.appendChild(modal);
    b.focus();
    const tab = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true });
    const prevent = vi.spyOn(tab, 'preventDefault');
    trapTabKey(modal, tab);
    expect(prevent).toHaveBeenCalled();
    expect(document.activeElement).toBe(a);

    a.focus();
    const shift = new KeyboardEvent('keydown', {
      key: 'Tab',
      shiftKey: true,
      bubbles: true,
    });
    const preventShift = vi.spyOn(shift, 'preventDefault');
    trapTabKey(modal, shift);
    expect(preventShift).toHaveBeenCalled();
    expect(document.activeElement).toBe(b);
    modal.remove();
  });

  it('mountGameShell Escape closes help after open', () => {
    shell = mountGameShell(container, {
      title: 'Reachability Shell',
      helpTitle: 'Help',
      helpContentHtml: '<p>ok</p>',
      modeRadioName: 'r3-mode',
      onNavigateHome: () => undefined,
      onStartGame: () => undefined,
    });
    const helpBtn = container.querySelector('#help-btn') as HTMLButtonElement;
    helpBtn.click();
    const helpModal = container.querySelector('#help-modal') as HTMLElement;
    expect(helpModal.classList.contains('hidden')).toBe(false);
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
    );
    expect(helpModal.classList.contains('hidden')).toBe(true);
  });
});

describe('burn-1008 ui-cov-r3 stats-dashboard', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('formatLastPlayed returns em-dash for 0 and on toLocaleDateString throw', () => {
    expect(formatLastPlayed(0)).toBe('—');
    const spy = vi
      .spyOn(Date.prototype, 'toLocaleDateString')
      .mockImplementation(() => {
        throw new RangeError('invalid');
      });
    expect(formatLastPlayed(1_700_000_000_000)).toBe('—');
    spy.mockRestore();
  });
});
