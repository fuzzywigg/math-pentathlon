/**
 * q-mp-377 — Characterize game-loading soft-fail residuals (tests-only).
 *
 * Mount / clear / double-start / loading↔error transition edges with
 * structural asserts (testids, roles, classes, child counts, callbacks).
 * No player-facing copy pins. No src edits.
 *
 * Narrowed vs open drafts into tip / siblings:
 * - #846 q-mp-353 game-route-mounts soft-fail — disjoint host
 * - #842 q-mp-358 tablet-gl soft-fail — disjoint host
 * - #844 q-mp-355 board-a11y soft-fail — disjoint host
 * - #768 q-mp-257 game-error-boundary soft-fail — shares chrome classes only
 * - #852 q-mp-359 queens-guards harness — AI/test-harness only
 * - No open draft owns `src/ui/game-loading.ts` characterization
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  renderGameLoadError,
  renderGameLoading,
} from '../../src/ui/game-loading';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

function mountRoot(priorChildren = 0): HTMLElement {
  const root = document.createElement('div');
  for (let i = 0; i < priorChildren; i++) {
    const stale = document.createElement('span');
    stale.dataset.prior = String(i);
    root.appendChild(stale);
  }
  document.body.appendChild(root);
  return root;
}

describe('q-mp-377 game-loading — mount / clear soft-fail', () => {
  it('mount clears prior children and leaves a single status shell', () => {
    const root = mountRoot(3);
    expect(root.querySelectorAll('[data-prior]')).toHaveLength(3);

    renderGameLoading(root, 'Hex');

    expect(root.querySelectorAll('[data-prior]')).toHaveLength(0);
    expect(root.children).toHaveLength(1);
    const status = root.querySelector('[data-testid="game-loading"]');
    expect(status).toBeInstanceOf(HTMLElement);
    expect(status?.parentElement).toBe(root);
    expect(status?.classList.contains('game-loading')).toBe(true);
    expect(status?.getAttribute('role')).toBe('status');
    expect(status?.getAttribute('aria-live')).toBe('polite');
  });

  it('loading shell keeps spinner aria-hidden and text node present', () => {
    const root = mountRoot();
    renderGameLoading(root, 'Calla');

    const status = root.querySelector('[data-testid="game-loading"]');
    const spinner = status?.querySelector('.game-loading-spinner');
    const text = status?.querySelector('.game-loading-text');
    expect(spinner).toBeInstanceOf(HTMLElement);
    expect(spinner?.getAttribute('aria-hidden')).toBe('true');
    expect(text).toBeInstanceOf(HTMLParagraphElement);
    expect(status?.children).toHaveLength(2);
  });

  it('empty game name still mounts a structural loading shell', () => {
    const root = mountRoot(1);
    renderGameLoading(root, '');

    expect(root.querySelector('[data-prior]')).toBeNull();
    const status = root.querySelector('[data-testid="game-loading"]');
    expect(status?.getAttribute('role')).toBe('status');
    expect(root.querySelector('.game-loading-text')).toBeInstanceOf(
      HTMLParagraphElement
    );
  });
});

describe('q-mp-377 game-loading — double-start soft-fail', () => {
  it('second renderGameLoading replaces the first status (one shell)', () => {
    const root = mountRoot();
    renderGameLoading(root, 'Hex');
    const first = root.querySelector('[data-testid="game-loading"]');
    expect(first).not.toBeNull();

    renderGameLoading(root, 'Calla');

    const shells = root.querySelectorAll('[data-testid="game-loading"]');
    expect(shells).toHaveLength(1);
    expect(root.children).toHaveLength(1);
    expect(shells[0]).not.toBe(first);
    expect(shells[0]?.classList.contains('game-loading-error')).toBe(false);
  });

  it('double-start after pre-seeded junk still clears to one child', () => {
    const root = mountRoot(2);
    renderGameLoading(root, 'A');
    renderGameLoading(root, 'B');
    renderGameLoading(root, 'C');

    expect(root.children).toHaveLength(1);
    expect(root.querySelectorAll('[data-testid="game-loading"]')).toHaveLength(
      1
    );
    expect(root.querySelectorAll('[data-prior]')).toHaveLength(0);
  });
});

describe('q-mp-377 game-loading — loading ↔ error transitions', () => {
  it('renderGameLoadError after loading clears status and mounts alert', () => {
    const root = mountRoot();
    renderGameLoading(root, 'Hex');
    expect(root.querySelector('[data-testid="game-loading"]')).not.toBeNull();

    renderGameLoadError(root, 'Hex', vi.fn(), vi.fn());

    expect(root.querySelector('[data-testid="game-loading"]')).toBeNull();
    expect(root.children).toHaveLength(1);
    const alert = root.querySelector('[data-testid="game-load-error"]');
    expect(alert).toBeInstanceOf(HTMLElement);
    expect(alert?.getAttribute('role')).toBe('alert');
    expect(alert?.classList.contains('game-loading')).toBe(true);
    expect(alert?.classList.contains('game-loading-error')).toBe(true);
    expect(alert?.hasAttribute('aria-live')).toBe(false);
  });

  it('renderGameLoading after error clears alert and remounts status', () => {
    const root = mountRoot();
    renderGameLoadError(root, 'Hex', vi.fn(), vi.fn());
    expect(
      root.querySelector('[data-testid="game-load-error"]')
    ).not.toBeNull();

    renderGameLoading(root, 'Hex');

    expect(root.querySelector('[data-testid="game-load-error"]')).toBeNull();
    expect(root.querySelectorAll('[data-testid="game-loading"]')).toHaveLength(
      1
    );
    expect(root.children).toHaveLength(1);
  });

  it('error → error remount leaves a single alert with fresh action nodes', () => {
    const root = mountRoot();
    const onRetryA = vi.fn();
    const onHomeA = vi.fn();
    renderGameLoadError(root, 'Hex', onRetryA, onHomeA);
    const firstRetry = root.querySelector('[data-action="retry"]');

    const onRetryB = vi.fn();
    const onHomeB = vi.fn();
    renderGameLoadError(root, 'Calla', onRetryB, onHomeB);

    expect(
      root.querySelectorAll('[data-testid="game-load-error"]')
    ).toHaveLength(1);
    const retry = root.querySelector(
      '[data-action="retry"]'
    ) as HTMLButtonElement | null;
    const home = root.querySelector(
      '[data-action="home"]'
    ) as HTMLButtonElement | null;
    expect(retry).not.toBe(firstRetry);
    retry?.click();
    home?.click();
    expect(onRetryA).not.toHaveBeenCalled();
    expect(onHomeA).not.toHaveBeenCalled();
    expect(onRetryB).toHaveBeenCalledOnce();
    expect(onHomeB).toHaveBeenCalledOnce();
  });
});

describe('q-mp-377 game-loading — error shell structure / callbacks', () => {
  it('error shell exposes hint + typed action buttons with btn classes', () => {
    const root = mountRoot(1);
    renderGameLoadError(root, 'Hex', vi.fn(), vi.fn(), {});

    expect(root.querySelector('[data-prior]')).toBeNull();
    expect(
      root.querySelector('[data-testid="game-load-error-hint"]')
    ).toBeInstanceOf(HTMLParagraphElement);
    expect(root.querySelector('.game-loading-text')).toBeInstanceOf(
      HTMLParagraphElement
    );
    expect(root.querySelector('.game-loading-actions')).toBeInstanceOf(
      HTMLDivElement
    );

    const retry = root.querySelector(
      '[data-action="retry"]'
    ) as HTMLButtonElement | null;
    const home = root.querySelector(
      '[data-action="home"]'
    ) as HTMLButtonElement | null;
    expect(retry?.type).toBe('button');
    expect(home?.type).toBe('button');
    expect(retry?.classList.contains('btn')).toBe(true);
    expect(retry?.classList.contains('btn-primary')).toBe(true);
    expect(home?.classList.contains('btn')).toBe(true);
    expect(home?.classList.contains('btn-secondary')).toBe(true);
  });

  it('repeated clicks keep invoking the same wired callbacks', () => {
    const root = mountRoot();
    const onRetry = vi.fn();
    const onHome = vi.fn();
    renderGameLoadError(root, 'Hex', onRetry, onHome);

    const retry = root.querySelector(
      '[data-action="retry"]'
    ) as HTMLButtonElement;
    const home = root.querySelector(
      '[data-action="home"]'
    ) as HTMLButtonElement;
    retry.click();
    retry.click();
    home.click();
    home.click();
    home.click();
    expect(onRetry).toHaveBeenCalledTimes(2);
    expect(onHome).toHaveBeenCalledTimes(3);
  });

  it('escapes HTML in the error game name (no raw tag nodes)', () => {
    const root = mountRoot();
    renderGameLoadError(root, '<img src=x onerror=alert(1)>', vi.fn(), vi.fn());

    expect(root.querySelector('img')).toBeNull();
    expect(root.innerHTML).toContain('&lt;img');
    expect(
      root.querySelector('[data-testid="game-load-error"]')
    ).not.toBeNull();
  });

  it('offline option toggles only hint content shape, not shell structure', () => {
    const online = mountRoot();
    renderGameLoadError(online, 'Hex', vi.fn(), vi.fn(), { offline: false });
    const offline = mountRoot();
    renderGameLoadError(offline, 'Hex', vi.fn(), vi.fn(), { offline: true });

    for (const root of [online, offline]) {
      const alert = root.querySelector('[data-testid="game-load-error"]');
      expect(alert?.getAttribute('role')).toBe('alert');
      expect(alert?.classList.contains('game-loading-error')).toBe(true);
      expect(
        root.querySelector('[data-testid="game-load-error-hint"]')
      ).toBeInstanceOf(HTMLParagraphElement);
      expect(root.querySelectorAll('[data-action="retry"]')).toHaveLength(1);
      expect(root.querySelectorAll('[data-action="home"]')).toHaveLength(1);
    }

    const onlineHint = online.querySelector(
      '[data-testid="game-load-error-hint"]'
    )?.textContent;
    const offlineHint = offline.querySelector(
      '[data-testid="game-load-error-hint"]'
    )?.textContent;
    expect(typeof onlineHint).toBe('string');
    expect(typeof offlineHint).toBe('string');
    expect(onlineHint!.length).toBeGreaterThan(0);
    expect(offlineHint!.length).toBeGreaterThan(0);
    expect(onlineHint).not.toBe(offlineHint);
  });
});
