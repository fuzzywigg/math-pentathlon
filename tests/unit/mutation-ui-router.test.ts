/**
 * burn-1008-mp-mutation-audit-ui — kill surviving mutants in `src/core/router.ts`.
 * Behavior only; no player-facing copy assertions.
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  addRoute,
  getCurrentPath,
  getPathParams,
  handleRoute,
  initRouter,
  navigate,
  setNotFoundHandler,
} from '../../src/core/router';

describe('mutation-ui router', () => {
  beforeEach(() => {
    window.location.hash = '';
  });

  afterEach(() => {
    window.location.hash = '';
  });

  it('strips hash query when ? is at index 0 (empty path + flags)', () => {
    // Survivor: `q >= 0` → `q > 0` / `0 → 1` on getCurrentPath.
    window.location.hash = '#?board3d=1';
    expect(getCurrentPath()).toBe('');
  });

  it('keeps path before ? when query is present mid-hash', () => {
    window.location.hash = '#/game/hex?board3d=1';
    expect(getCurrentPath()).toBe('/game/hex');
  });

  it('defaults empty hash to /', () => {
    window.location.hash = '';
    expect(getCurrentPath()).toBe('/');
    window.location.hash = '#';
    expect(getCurrentPath()).toBe('/');
  });

  it('getPathParams maps named segments; misses return {}', () => {
    expect(getPathParams('/game/:id', '/game/hex')).toEqual({ id: 'hex' });
    expect(getPathParams('/game/:id', '/other')).toEqual({});
  });

  it('handleRoute invokes first matching route then stops', () => {
    const hits: string[] = [];
    addRoute('/mutation-a', () => hits.push('a'));
    addRoute('/mutation-a', () => hits.push('a2'));
    window.location.hash = '#/mutation-a';
    handleRoute();
    expect(hits).toEqual(['a']);
  });

  it('handleRoute falls through to notFound', () => {
    let notFound = 0;
    setNotFoundHandler(() => {
      notFound += 1;
    });
    window.location.hash = '#/mutation-missing-route-xyz';
    handleRoute();
    expect(notFound).toBe(1);
  });

  it('navigate writes location.hash', () => {
    navigate('/mutation-nav');
    expect(window.location.hash).toBe('#/mutation-nav');
  });

  it('initRouter wires hashchange', () => {
    let count = 0;
    addRoute('/mutation-init', () => {
      count += 1;
    });
    window.location.hash = '#/mutation-init';
    initRouter();
    expect(count).toBeGreaterThanOrEqual(1);
    const before = count;
    window.location.hash = '#/mutation-init';
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    expect(count).toBeGreaterThanOrEqual(before);
  });
});
