/**
 * q-mp-454 — Characterize `game-selector` soft-fail residuals (tests-only).
 *
 * Structural asserts (classes, attrs, roles, counts, spy calls). No player-facing
 * copy-body pins. No src / selector / menu / AI / scoring / rules edits.
 *
 * Live tip re-measure (`cursor/mp-tip-post898` @ `9b19c5e8`):
 * - `src/ui/game-selector.ts` **445** LOC (matches backlog)
 * - Dedicated `*game-selector*` suites: **4** files / **11** `it` (+ **2** `it.skip`)
 * - Combined coverage before this file: stmts/lines **98.22%** (221/225),
 *   branches **90.47%** (38/42); uncovered **L79** (warm), **L204**
 *   (`toggleAccordion` early-return), **L286–287** (progress navigate)
 *
 * Narrowed vs open drafts into tip / still-unfolded post865 stacks:
 * - Chrome/route/UI-cov drafts (`#915`–`#920`, `#925`, etc.) — leave open
 *   (`contained`); this suite owns residual soft edges on `game-selector.ts` only
 * - `#668` mutation-ui4 game-selector (base post477) — leave open (`contained`);
 *   this file exercises the half-missing DOM early-return that mutation-ui4 skips
 * - Keep disjoint from `q-mp-453` (game-prefetch) per backlog conflict notes
 *
 * Listed in `vitest.config.ts` `isolatedFiles` so registry + prefetch mocks
 * do not leak into unit-shared (same pattern as burn-1008 ui-cov-r3).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../src/core/game-registry', async () => {
  const actual = await vi.importActual<
    typeof import('../../src/core/game-registry')
  >('../../src/core/game-registry');
  const unavailable = {
    id: 'q454-coming-soon-probe',
    name: 'Q454 Probe',
    division: actual.DIVISIONS[0]!.name,
    gradeRange: 'Grades K-1',
    description: 'Unavailable card for soft-fail coverage',
    playerCount: '2',
    difficulty: 'beginner' as const,
    icon: '🧪',
    available: false,
  };
  const games = [...actual.GAMES, unavailable];
  return {
    ...actual,
    GAMES: games,
    getGamesByDivision: (division: string) =>
      games.filter((g) => g.division === division),
  };
});

vi.mock('../../src/ui/game-prefetch', () => ({
  prefetchGameChunk: vi.fn(),
  prefetchGameChunksIdle: vi.fn(),
}));

import { DIVISIONS } from '../../src/core/game-registry';
import * as router from '../../src/core/router';
import { resetSettingsFlagsForTests } from '../../src/core/settings-flags';
import {
  prefetchGameChunk,
  prefetchGameChunksIdle,
} from '../../src/ui/game-prefetch';
import { renderGameSelector } from '../../src/ui/game-selector';

function stubMatchMedia(matches: boolean): void {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockImplementation((query: string) => ({
      matches:
        matches && /prefers-reduced-motion:\s*reduce/.test(String(query)),
      media: String(query),
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
  );
}

describe('q-mp-454 game-selector — soft-fail residuals', () => {
  let root: HTMLElement;
  let scrollSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    localStorage.clear();
    resetSettingsFlagsForTests();
    root = document.createElement('div');
    document.body.appendChild(root);
    scrollSpy = vi.fn();
    HTMLElement.prototype.scrollIntoView = scrollSpy;
    vi.mocked(prefetchGameChunk).mockClear();
    vi.mocked(prefetchGameChunksIdle).mockClear();
  });

  afterEach(() => {
    root.remove();
    document.body.innerHTML = '';
    localStorage.clear();
    resetSettingsFlagsForTests();
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('toggleAccordion early-returns when header is missing (L203–204)', () => {
    renderGameSelector(root);
    const target = root.querySelector(
      `.division-accordion[data-division="${DIVISIONS[1]!.name}"]`
    ) as HTMLElement;
    expect(target.classList.contains('accordion-open')).toBe(false);
    target.querySelector('.accordion-header')?.remove();

    const tab = root.querySelector(
      `.division-tab[data-division="${DIVISIONS[1]!.name}"]`
    ) as HTMLButtonElement;
    expect(() => tab.click()).not.toThrow();
    // Open arm early-returns — section stays closed.
    expect(target.classList.contains('accordion-open')).toBe(false);
    // Tab sync still runs after the soft no-op open.
    expect(tab.getAttribute('aria-selected')).toBe('true');
  });

  it('toggleAccordion early-returns when panel is missing (L203–204)', () => {
    renderGameSelector(root);
    const target = root.querySelector(
      `.division-accordion[data-division="${DIVISIONS[2]!.name}"]`
    ) as HTMLElement;
    target.querySelector('.accordion-panel')?.remove();

    const tab = root.querySelector(
      `.division-tab[data-division="${DIVISIONS[2]!.name}"]`
    ) as HTMLButtonElement;
    expect(() => tab.click()).not.toThrow();
    expect(target.classList.contains('accordion-open')).toBe(false);
  });

  it('orphan data-division tab click is a silent no-op (L388)', () => {
    renderGameSelector(root);
    const openBefore = [
      ...root.querySelectorAll('.division-accordion.accordion-open'),
    ].map((el) => el.getAttribute('data-division'));
    expect(openBefore).toEqual([DIVISIONS[0]!.name]);

    const tab = root.querySelector('.division-tab') as HTMLButtonElement;
    tab.setAttribute('data-division', 'Division IX-orphan');
    expect(() => tab.click()).not.toThrow();

    const openAfter = [
      ...root.querySelectorAll('.division-accordion.accordion-open'),
    ].map((el) => el.getAttribute('data-division'));
    expect(openAfter).toEqual(openBefore);
    // No matching section → syncActiveTab never runs; selection unchanged.
    expect(tab.getAttribute('aria-selected')).toBe('true');
  });

  it('closing the open accordion clears all tab aria-selected (L436)', () => {
    renderGameSelector(root);
    const open = root.querySelector(
      '.division-accordion.accordion-open'
    ) as HTMLElement;
    const header = open.querySelector('.accordion-header') as HTMLButtonElement;
    header.click();

    expect(open.classList.contains('accordion-open')).toBe(false);
    const tabs = [...root.querySelectorAll('.division-tab')] as HTMLElement[];
    expect(tabs.length).toBe(DIVISIONS.length);
    for (const tab of tabs) {
      expect(tab.classList.contains('active')).toBe(false);
      expect(tab.getAttribute('aria-selected')).toBe('false');
    }
  });

  it('unavailable cards never navigate on click / Enter / Space (L64–91)', () => {
    const navigateSpy = vi
      .spyOn(router, 'navigate')
      .mockImplementation(() => undefined);
    renderGameSelector(root);

    const card = root.querySelector('.game-card-disabled') as HTMLElement;
    expect(card).toBeTruthy();
    expect(card.getAttribute('tabindex')).toBe('-1');
    expect(card.querySelector('.game-card-badge')).toBeTruthy();

    card.click();
    card.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    card.dispatchEvent(
      new KeyboardEvent('keydown', { key: ' ', bubbles: true })
    );
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('unavailable cards do not warm-prefetch on focus / pointerenter (L72–82)', () => {
    renderGameSelector(root);
    vi.mocked(prefetchGameChunk).mockClear();

    const card = root.querySelector('.game-card-disabled') as HTMLElement;
    card.dispatchEvent(new Event('pointerenter', { bubbles: true }));
    card.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
    expect(prefetchGameChunk).not.toHaveBeenCalled();
  });

  it('available card non-activation keys do not navigate (L85–89)', () => {
    const navigateSpy = vi
      .spyOn(router, 'navigate')
      .mockImplementation(() => undefined);
    renderGameSelector(root);

    const card = root.querySelector(
      '.accordion-open .game-card:not(.game-card-disabled)'
    ) as HTMLElement;
    expect(card).toBeTruthy();

    for (const key of ['Escape', 'Tab', 'ArrowDown', 'a']) {
      card.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
    }
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('available card focus / pointerenter warms prefetchGameChunk (L78–82)', () => {
    renderGameSelector(root);
    vi.mocked(prefetchGameChunk).mockClear();

    const card = root.querySelector(
      '.accordion-open .game-card:not(.game-card-disabled)'
    ) as HTMLElement;
    card.dispatchEvent(new Event('pointerenter', { bubbles: true }));
    expect(prefetchGameChunk).toHaveBeenCalledTimes(1);
    card.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
    expect(prefetchGameChunk).toHaveBeenCalledTimes(2);
    expect(vi.mocked(prefetchGameChunk).mock.calls[0]?.[0]).toEqual(
      expect.any(String)
    );
  });

  it('idle-warm passes available first-division ids with max 3 (L441–444)', () => {
    renderGameSelector(root);
    expect(prefetchGameChunksIdle).toHaveBeenCalledTimes(1);
    const [ids, opts] = vi.mocked(prefetchGameChunksIdle).mock.calls[0]!;
    expect(Array.isArray(ids)).toBe(true);
    expect(ids.length).toBeGreaterThan(0);
    // Unavailable probe stays out of the idle-warm id list.
    expect(ids).not.toContain('q454-coming-soon-probe');
    expect(opts).toEqual({ max: 3 });
  });

  it('remount clears prior selector DOM to a single root (L221–222)', () => {
    renderGameSelector(root);
    const marker = document.createElement('div');
    marker.className = 'q454-stale-marker';
    root.appendChild(marker);
    expect(root.querySelectorAll('.game-selector').length).toBe(1);
    expect(root.querySelector('.q454-stale-marker')).toBeTruthy();

    renderGameSelector(root);
    expect(root.querySelectorAll('.game-selector').length).toBe(1);
    expect(root.querySelector('.q454-stale-marker')).toBeNull();
    expect(root.children.length).toBe(1);
  });

  it('progress control navigates /stats without throwing (L285–288)', () => {
    const navigateSpy = vi
      .spyOn(router, 'navigate')
      .mockImplementation(() => undefined);
    renderGameSelector(root);

    const link = root.querySelector('.hero-progress-link') as HTMLAnchorElement;
    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toBe('#/stats');

    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    });
    expect(() => link.dispatchEvent(event)).not.toThrow();
    expect(event.defaultPrevented).toBe(true);
    expect(navigateSpy).toHaveBeenCalledWith('/stats');
  });

  it('tab scroll uses auto behavior under reduced-motion (L398–403)', () => {
    stubMatchMedia(true);
    vi.useFakeTimers();
    renderGameSelector(root);
    scrollSpy.mockClear();

    const tab = root.querySelector(
      `.division-tab[data-division="${DIVISIONS[1]!.name}"]`
    ) as HTMLButtonElement;
    tab.click();
    vi.advanceTimersByTime(50);

    expect(scrollSpy).toHaveBeenCalled();
    const opts = scrollSpy.mock.calls.at(-1)?.[0] as ScrollIntoViewOptions;
    expect(opts.behavior).toBe('auto');
    expect(opts.block).toBe('start');
  });

  it('header scroll uses smooth behavior when motion is allowed (L428–433)', () => {
    stubMatchMedia(false);
    vi.useFakeTimers();
    renderGameSelector(root);
    scrollSpy.mockClear();

    const closed = root.querySelector(
      `.division-accordion[data-division="${DIVISIONS[1]!.name}"]`
    ) as HTMLElement;
    const header = closed.querySelector(
      '.accordion-header'
    ) as HTMLButtonElement;
    header.click();
    vi.advanceTimersByTime(50);

    expect(closed.classList.contains('accordion-open')).toBe(true);
    expect(scrollSpy).toHaveBeenCalled();
    const opts = scrollSpy.mock.calls.at(-1)?.[0] as ScrollIntoViewOptions;
    expect(opts.behavior).toBe('smooth');
    expect(opts.block).toBe('start');
  });

  it('missing accordion-header at wire time skips listener attach (L414)', () => {
    // Structural soft edge: optional-chain addEventListener. After render,
    // removing a header leaves that section without a click path — no throw.
    renderGameSelector(root);
    const section = root.querySelector(
      `.division-accordion[data-division="${DIVISIONS[3]!.name}"]`
    ) as HTMLElement;
    section.querySelector('.accordion-header')?.remove();
    expect(section.querySelector('.accordion-header')).toBeNull();
    expect(() =>
      section.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    ).not.toThrow();
    expect(section.classList.contains('accordion-open')).toBe(false);
  });
});
