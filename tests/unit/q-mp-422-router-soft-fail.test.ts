/**
 * q-mp-422 — Characterize `router` soft-fail residuals (tests-only).
 *
 * Fresh-module default `notFoundHandler` (`console.error` soft-fail),
 * unknown-path non-throw, query-stripped misses, almost-match misses,
 * match suppresses soft-fail, and replaceable 404 handler. Structural /
 * diagnostic asserts only — no player-facing copy pins. No src edits.
 *
 * Narrowed vs open drafts into tip / siblings:
 * - #888 q-mp-394 knip drift — inventory only; leave open with `contained`
 * - #832 mutation w10 router (base post785) — mutant pins; this is soft-fail matrix
 * - No open tip draft owns `src/core/router.ts` soft-fail characterization
 *
 * Listed in `vitest.config.ts` `isolatedFiles` so `vi.resetModules()` can
 * re-load the module-default soft-fail handler without polluting unit-shared.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const ROUTER_SRC = readFileSync(
  resolve(process.cwd(), 'src/core/router.ts'),
  'utf8'
);

type RouterModule = typeof import('../../src/core/router');

async function loadFreshRouter(): Promise<RouterModule> {
  vi.resetModules();
  return import('../../src/core/router');
}

describe('q-mp-422 router — source soft-fail keep-site', () => {
  it('keeps intentional console.error soft-fail in default notFoundHandler', () => {
    expect(ROUTER_SRC).toMatch(/console\.error\(/);
    expect(ROUTER_SRC).toMatch(/notFoundHandler/);
    // Default handler is the sole console.error keep-site in this file.
    const sites = ROUTER_SRC.match(/console\.error\(/g) ?? [];
    expect(sites).toHaveLength(1);
  });
});

describe('q-mp-422 router — fresh-module default soft-fail', () => {
  beforeEach(() => {
    window.location.hash = '';
  });

  afterEach(() => {
    window.location.hash = '';
    vi.restoreAllMocks();
  });

  it('unknown path soft-fails via default console.error and does not throw', async () => {
    const router = await loadFreshRouter();
    const err = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    window.location.hash = '#/q422-miss-default';
    expect(() => router.handleRoute()).not.toThrow();

    expect(err).toHaveBeenCalledTimes(1);
    expect(String(err.mock.calls[0]?.[0])).toMatch(/Route not found/);
  });

  it('empty registry + / soft-fails (no registered root route)', async () => {
    const router = await loadFreshRouter();
    const err = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    window.location.hash = '#/';
    expect(() => router.handleRoute()).not.toThrow();
    expect(err).toHaveBeenCalledTimes(1);
  });

  it('empty hash soft-fails like / when no routes registered', async () => {
    const router = await loadFreshRouter();
    const err = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    window.location.hash = '';
    expect(router.getCurrentPath()).toBe('/');
    expect(() => router.handleRoute()).not.toThrow();
    expect(err).toHaveBeenCalledTimes(1);
  });

  it('query-stripped unknown path still soft-fails', async () => {
    const router = await loadFreshRouter();
    const err = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    window.location.hash = '#/q422-miss-query?board3d=1&x=2';
    expect(router.getCurrentPath()).toBe('/q422-miss-query');
    expect(() => router.handleRoute()).not.toThrow();
    expect(err).toHaveBeenCalledTimes(1);
  });

  it('repeated unknown handleRoute soft-fails once per call (idempotent residual)', async () => {
    const router = await loadFreshRouter();
    const err = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    window.location.hash = '#/q422-miss-repeat';
    router.handleRoute();
    router.handleRoute();
    router.handleRoute();
    expect(err).toHaveBeenCalledTimes(3);
  });
});

describe('q-mp-422 router — almost-match / miss soft-fail matrix', () => {
  beforeEach(() => {
    window.location.hash = '';
  });

  afterEach(() => {
    window.location.hash = '';
    vi.restoreAllMocks();
  });

  it('trailing-slash almost-match soft-fails (pattern has no trailing slash)', async () => {
    const router = await loadFreshRouter();
    const hits: string[] = [];
    const err = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    router.addRoute('/q422-trail', () => hits.push('hit'));
    window.location.hash = '#/q422-trail/';
    expect(() => router.handleRoute()).not.toThrow();

    expect(hits).toEqual([]);
    expect(err).toHaveBeenCalledTimes(1);
  });

  it('extra path segment soft-fails against exact static route', async () => {
    const router = await loadFreshRouter();
    const hits: string[] = [];
    const err = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    router.addRoute('/q422-exact', () => hits.push('hit'));
    window.location.hash = '#/q422-exact/extra';
    router.handleRoute();

    expect(hits).toEqual([]);
    expect(err).toHaveBeenCalledTimes(1);
  });

  it('param pattern miss soft-fails without throwing', async () => {
    const router = await loadFreshRouter();
    const hits: string[] = [];
    const err = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    router.addRoute('/q422-game/:id', () => hits.push('hit'));
    window.location.hash = '#/q422-game';
    router.handleRoute();

    expect(hits).toEqual([]);
    expect(err).toHaveBeenCalledTimes(1);
    expect(router.getPathParams('/q422-game/:id', '/q422-game')).toEqual({});
  });
});

describe('q-mp-422 router — match suppresses soft-fail; 404 replaceable', () => {
  beforeEach(() => {
    window.location.hash = '';
  });

  afterEach(() => {
    window.location.hash = '';
    vi.restoreAllMocks();
  });

  it('matching route suppresses default soft-fail console.error', async () => {
    const router = await loadFreshRouter();
    const hits: string[] = [];
    const err = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    router.addRoute('/q422-ok', () => hits.push('ok'));
    window.location.hash = '#/q422-ok';
    router.handleRoute();

    expect(hits).toEqual(['ok']);
    expect(err).not.toHaveBeenCalled();
  });

  it('matching route with hash query suppresses soft-fail', async () => {
    const router = await loadFreshRouter();
    const hits: string[] = [];
    const err = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    router.addRoute('/q422-ok-q', () => hits.push('ok'));
    window.location.hash = '#/q422-ok-q?board3d=1';
    expect(router.getCurrentPath()).toBe('/q422-ok-q');
    router.handleRoute();

    expect(hits).toEqual(['ok']);
    expect(err).not.toHaveBeenCalled();
  });

  it('setNotFoundHandler replaces default soft-fail (no console.error)', async () => {
    const router = await loadFreshRouter();
    const err = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const custom = vi.fn();

    router.setNotFoundHandler(custom);
    window.location.hash = '#/q422-custom-404';
    expect(() => router.handleRoute()).not.toThrow();

    expect(custom).toHaveBeenCalledTimes(1);
    expect(err).not.toHaveBeenCalled();
  });

  it('navigate to unknown then handleRoute soft-fails without throw', async () => {
    const router = await loadFreshRouter();
    const err = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    router.navigate('/q422-nav-miss');
    expect(window.location.hash).toBe('#/q422-nav-miss');
    expect(() => router.handleRoute()).not.toThrow();
    expect(err).toHaveBeenCalledTimes(1);
  });

  it('initRouter on unknown soft-fails and still wires hashchange', async () => {
    const router = await loadFreshRouter();
    const err = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const hits: string[] = [];

    router.addRoute('/q422-init-later', () => hits.push('later'));
    window.location.hash = '#/q422-init-unknown';
    expect(() => router.initRouter()).not.toThrow();
    expect(err).toHaveBeenCalledTimes(1);

    window.location.hash = '#/q422-init-later';
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    expect(hits).toEqual(['later']);
  });
});
