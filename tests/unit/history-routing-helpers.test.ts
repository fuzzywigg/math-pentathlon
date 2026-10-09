/**
 * burn-1008-mp-history-routing — unit coverage for router / route-generation
 * helpers used by menu↔game history and deep links.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  addRoute,
  getCurrentPath,
  getPathParams,
  handleRoute,
  navigate,
  setNotFoundHandler,
} from '../../src/core/router';
import {
  getRouteGeneration,
  isCurrentRouteGeneration,
  nextRouteGeneration,
} from '../../src/core/route-generation';

describe('history-routing helpers', () => {
  const tag = `hist-${Math.random().toString(36).slice(2, 8)}`;

  beforeEach(() => {
    window.location.hash = '';
  });

  afterEach(() => {
    window.location.hash = '';
    vi.restoreAllMocks();
  });

  it('navigate writes a hash history entry and getCurrentPath strips query', () => {
    navigate(`/hist-nav-${tag}`);
    expect(window.location.hash).toBe(`#/hist-nav-${tag}`);
    expect(getCurrentPath()).toBe(`/hist-nav-${tag}`);

    window.location.hash = `#/game/hex?board3d=1`;
    expect(getCurrentPath()).toBe('/game/hex');
  });

  it('getPathParams extracts game id for deep links', () => {
    expect(getPathParams('/game/:id', '/game/calla')).toEqual({ id: 'calla' });
    expect(getPathParams('/game/:id', '/stats')).toEqual({});
  });

  it('handleRoute dispatches match; unknown path hits notFound', () => {
    const hit = vi.fn();
    const notFound = vi.fn();
    addRoute(`/hist-hit-${tag}`, hit);
    setNotFoundHandler(notFound);

    window.location.hash = `#/hist-hit-${tag}`;
    handleRoute();
    expect(hit).toHaveBeenCalledTimes(1);

    window.location.hash = `#/hist-miss-${tag}`;
    handleRoute();
    expect(notFound).toHaveBeenCalledTimes(1);
  });

  it('empty hash path is /', () => {
    window.location.hash = '';
    expect(getCurrentPath()).toBe('/');
  });

  it('route generation tokens guard stale async mounts', () => {
    const a = nextRouteGeneration();
    expect(getRouteGeneration()).toBe(a);
    expect(isCurrentRouteGeneration(a)).toBe(true);
    const b = nextRouteGeneration();
    expect(isCurrentRouteGeneration(a)).toBe(false);
    expect(isCurrentRouteGeneration(b)).toBe(true);
  });
});
