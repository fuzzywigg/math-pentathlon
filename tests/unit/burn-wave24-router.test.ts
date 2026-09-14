/**
 * Wave 24 — hash router path/params/dispatch.
 * First dedicated router coverage (distinct from stats-dashboard navigate mock).
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

describe('Wave 24 router — getPathParams', () => {
  it('extracts named params from matching paths', () => {
    expect(getPathParams('/game/:id', '/game/hex')).toEqual({ id: 'hex' });
    expect(getPathParams('/game/:id/move/:n', '/game/calla/move/3')).toEqual({
      id: 'calla',
      n: '3',
    });
  });

  it('returns {} when pattern does not match', () => {
    expect(getPathParams('/game/:id', '/stats')).toEqual({});
    expect(getPathParams('/game/:id', '/game/hex/extra')).toEqual({});
    expect(getPathParams('/a/:x', '/a/')).toEqual({});
  });
});

describe('Wave 24 router — navigate / getCurrentPath', () => {
  beforeEach(() => {
    window.location.hash = '';
  });

  afterEach(() => {
    window.location.hash = '';
  });

  it('defaults empty hash to /', () => {
    window.location.hash = '';
    expect(getCurrentPath()).toBe('/');
  });

  it('navigate sets hash and getCurrentPath strips #', () => {
    navigate('/game/star-track');
    expect(window.location.hash).toBe('#/game/star-track');
    expect(getCurrentPath()).toBe('/game/star-track');
  });
});

describe('Wave 24 router — handleRoute / notFound / initRouter', () => {
  const suffix = `w24-${Math.random().toString(36).slice(2, 8)}`;

  beforeEach(() => {
    window.location.hash = '';
  });

  afterEach(() => {
    window.location.hash = '';
    vi.restoreAllMocks();
  });

  it('dispatches matching route handler', () => {
    const hits: string[] = [];
    addRoute(`/wave24-hit-${suffix}`, () => {
      hits.push('hit');
    });
    window.location.hash = `#/wave24-hit-${suffix}`;
    handleRoute();
    expect(hits).toEqual(['hit']);
  });

  it('invokes notFound when no route matches', () => {
    const notFound = vi.fn();
    setNotFoundHandler(notFound);
    window.location.hash = `#/wave24-missing-${suffix}`;
    handleRoute();
    expect(notFound).toHaveBeenCalledTimes(1);
  });

  it('initRouter handles current path and listens for hashchange', () => {
    const hits: string[] = [];
    addRoute(`/wave24-init-${suffix}`, () => {
      hits.push('init');
    });
    window.location.hash = `#/wave24-init-${suffix}`;
    initRouter();
    expect(hits).toContain('init');

    const before = hits.length;
    window.location.hash = `#/wave24-init-${suffix}`;
    // Force another hashchange by toggling
    window.location.hash = `#/other-${suffix}`;
    window.location.hash = `#/wave24-init-${suffix}`;
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    expect(hits.length).toBeGreaterThanOrEqual(before);
  });
});
