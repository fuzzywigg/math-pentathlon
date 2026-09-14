/**
 * Wave 25 — hash router path params / navigate / handleRoute / not-found / init.
 * Distinct from wave 24 inventory/seat and wave 23 storage/owl.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  addRoute,
  setNotFoundHandler,
  navigate,
  getCurrentPath,
  getPathParams,
  handleRoute,
  initRouter,
} from '../../src/core/router';

beforeEach(() => {
  window.location.hash = '';
});

afterEach(() => {
  window.location.hash = '';
  vi.restoreAllMocks();
});

describe('Wave 25 router — getPathParams', () => {
  it('extracts single and multi params from matching paths', () => {
    expect(getPathParams('/game/:id', '/game/hex')).toEqual({ id: 'hex' });
    expect(getPathParams('/game/:id/move/:n', '/game/calla/move/3')).toEqual({
      id: 'calla',
      n: '3',
    });
  });

  it('returns empty object on mismatch or trailing junk', () => {
    expect(getPathParams('/game/:id', '/stats')).toEqual({});
    expect(getPathParams('/game/:id', '/game/hex/extra')).toEqual({});
    expect(getPathParams('/game/:id', '/')).toEqual({});
  });

  it('does not treat slash-bearing segments as a single param', () => {
    expect(getPathParams('/game/:id', '/game/a/b')).toEqual({});
    expect(getPathParams('/:a/:b', '/one/two')).toEqual({ a: 'one', b: 'two' });
  });
});

describe('Wave 25 router — getCurrentPath / navigate', () => {
  it('defaults empty hash to /', () => {
    window.location.hash = '';
    expect(getCurrentPath()).toBe('/');
  });

  it('strips leading # and returns hash body', () => {
    window.location.hash = '#/stats';
    expect(getCurrentPath()).toBe('/stats');
    window.location.hash = '#/game/hex';
    expect(getCurrentPath()).toBe('/game/hex');
  });

  it('navigate writes location.hash', () => {
    navigate('/stats');
    expect(window.location.hash).toBe('#/stats');
    navigate('/game/prime-gold');
    expect(window.location.hash).toBe('#/game/prime-gold');
  });
});

describe('Wave 25 router — handleRoute / not-found', () => {
  it('invokes matching registered handler for unique wave25 path', () => {
    const hits: string[] = [];
    addRoute('/wave25-router-alpha', () => hits.push('alpha'));
    addRoute('/wave25-router-beta/:id', () => hits.push('beta'));

    window.location.hash = '#/wave25-router-alpha';
    handleRoute();
    expect(hits).toEqual(['alpha']);

    window.location.hash = '#/wave25-router-beta/z';
    handleRoute();
    expect(hits).toEqual(['alpha', 'beta']);
  });

  it('calls setNotFoundHandler when no route matches', () => {
    const notFound = vi.fn();
    setNotFoundHandler(notFound);
    window.location.hash = '#/wave25-definitely-missing-route';
    handleRoute();
    expect(notFound).toHaveBeenCalledTimes(1);
    // restore quiet default so later suites are not noisy
    setNotFoundHandler(() => undefined);
  });

  it('first matching route wins; later duplicates are skipped', () => {
    const order: string[] = [];
    addRoute('/wave25-first-wins', () => order.push('first'));
    addRoute('/wave25-first-wins', () => order.push('second'));
    window.location.hash = '#/wave25-first-wins';
    handleRoute();
    expect(order).toEqual(['first']);
  });
});

describe('Wave 25 router — initRouter hashchange', () => {
  it('runs handleRoute on init and on hashchange', () => {
    const hits: string[] = [];
    addRoute('/wave25-init-route', () => hits.push('hit'));
    window.location.hash = '#/wave25-init-route';
    initRouter();
    expect(hits.length).toBeGreaterThanOrEqual(1);

    const before = hits.length;
    window.location.hash = '#/wave25-init-route';
    // jsdom may or may not emit hashchange for same-value assigns; force one
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    expect(hits.length).toBeGreaterThan(before);
  });
});
