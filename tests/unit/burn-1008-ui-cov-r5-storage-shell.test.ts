/**
 * burn-1008-mp-ui-coverage-round-5 — storage wrapper residuals + game-shell
 * focus-trap / modal display edges. Tests-only; no player-facing copy asserts.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { storage, PROGRESS_STORAGE_KEY } from '../../src/core/storage/storage';
import {
  getFocusableWithin,
  trapTabKey,
} from '../../src/ui/components/game-shell';
import { installDomHooks, mountRoot } from './helpers/dom';

installDomHooks();

afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
});

describe('burn-1008 ui-cov-r5 storage residuals', () => {
  it('ignores sessionStorage-area events (does not adopt foreign writes)', () => {
    storage.unlockAchievement('r5-session-guard');
    expect(storage.hasAchievement('r5-session-guard')).toBe(true);
    storage.handleExternalStorageEvent(
      new StorageEvent('storage', {
        key: PROGRESS_STORAGE_KEY,
        newValue: JSON.stringify({
          version: 1,
          profile: { id: 'other', name: 'x', avatar: 'default' },
          settings: {},
          gameStats: {},
          streak: {
            currentStreak: 0,
            bestStreak: 0,
            lastPlayDate: '',
            streakStartDate: '',
          },
          achievements: [],
          owlState: { messagesSeen: [], tutorialsCompleted: [] },
        }),
        storageArea: sessionStorage,
      })
    );
    // sessionStorage area must not adopt foreign writes
    expect(storage.hasAchievement('r5-session-guard')).toBe(true);
  });

  it('ignores unrelated keys; clear() (key null) resets to defaults', () => {
    storage.unlockAchievement('r5-keep');
    expect(storage.hasAchievement('r5-keep')).toBe(true);

    storage.handleExternalStorageEvent(
      new StorageEvent('storage', {
        key: 'not-progress',
        newValue: '{}',
        storageArea: localStorage,
      })
    );
    expect(storage.hasAchievement('r5-keep')).toBe(true);

    storage.handleExternalStorageEvent(
      new StorageEvent('storage', {
        key: null,
        newValue: null,
        storageArea: localStorage,
      })
    );
    expect(storage.hasAchievement('r5-keep')).toBe(false);
  });

  it('updateStreak continues / breaks / first-play branches', () => {
    const today = new Date().toISOString().slice(0, 10);
    const y = new Date();
    y.setDate(y.getDate() - 1);
    const yesterday = y.toISOString().slice(0, 10);

    // First play
    const s1 = storage.updateStreak();
    expect(s1.currentStreak).toBeGreaterThanOrEqual(1);
    expect(s1.lastPlayDate).toBe(today);

    // Same day — no change
    const s2 = storage.updateStreak();
    expect(s2.currentStreak).toBe(s1.currentStreak);

    // Simulate continuing from yesterday via external adopt
    storage.handleExternalStorageEvent(
      new StorageEvent('storage', {
        key: PROGRESS_STORAGE_KEY,
        newValue: JSON.stringify({
          version: 1,
          profile: { id: 'p', name: 'n', avatar: 'default' },
          settings: { reducedMotion: false },
          gameStats: {},
          streak: {
            currentStreak: 3,
            bestStreak: 5,
            lastPlayDate: yesterday,
            streakStartDate: yesterday,
          },
          achievements: [],
          owlState: { messagesSeen: [], tutorialsCompleted: [] },
        }),
        storageArea: localStorage,
      })
    );
    const continued = storage.updateStreak();
    expect(continued.currentStreak).toBe(4);

    // Broken streak — last play older than yesterday
    storage.handleExternalStorageEvent(
      new StorageEvent('storage', {
        key: PROGRESS_STORAGE_KEY,
        newValue: JSON.stringify({
          version: 1,
          profile: { id: 'p', name: 'n', avatar: 'default' },
          settings: {},
          gameStats: {},
          streak: {
            currentStreak: 9,
            bestStreak: 9,
            lastPlayDate: '2000-01-01',
            streakStartDate: '2000-01-01',
          },
          achievements: [],
          owlState: { messagesSeen: [], tutorialsCompleted: [] },
        }),
        storageArea: localStorage,
      })
    );
    const broken = storage.updateStreak();
    expect(broken.currentStreak).toBe(1);
    expect(broken.bestStreak).toBeGreaterThanOrEqual(9);
  });
});

describe('burn-1008 ui-cov-r5 game-shell focus helpers', () => {
  it('getFocusableWithin skips aria-disabled and hidden ancestors', () => {
    const root = mountRoot();
    root.innerHTML = `
      <button id="ok">ok</button>
      <button id="dis" aria-disabled="true">dis</button>
      <div class="hidden"><button id="hid">hid</button></div>
      <div style="display:none"><button id="none">none</button></div>
      <div inert><button id="inert">inert</button></div>
    `;
    const focusable = getFocusableWithin(root);
    const ids = focusable.map((el) => el.id);
    expect(ids).toContain('ok');
    expect(ids).not.toContain('dis');
    expect(ids).not.toContain('hid');
    expect(ids).not.toContain('none');
    expect(ids).not.toContain('inert');
  });

  it('trapTabKey cycles first↔last and no-ops without Tab', () => {
    const modal = mountRoot();
    modal.innerHTML = `
      <button id="a">a</button>
      <button id="b">b</button>
    `;
    const a = modal.querySelector('#a') as HTMLButtonElement;
    const b = modal.querySelector('#b') as HTMLButtonElement;
    a.focus();
    const shift = new KeyboardEvent('keydown', {
      key: 'Tab',
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    });
    trapTabKey(modal, shift);
    expect(document.activeElement).toBe(b);

    b.focus();
    const forward = new KeyboardEvent('keydown', {
      key: 'Tab',
      bubbles: true,
      cancelable: true,
    });
    trapTabKey(modal, forward);
    expect(document.activeElement).toBe(a);

    const other = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
    trapTabKey(modal, other);
  });
});
