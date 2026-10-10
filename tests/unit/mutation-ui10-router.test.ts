/**
 * q-mp-325 mutation audit UI wave 10 — structural re-pins for router.
 * All 11 mutants already killed at baseline; re-pin hash/query / param arms.
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  addRoute,
  getCurrentPath,
  getPathParams,
  handleRoute,
  navigate,
  setNotFoundHandler,
} from '../../src/core/router';

describe('mutation-ui10 router', () => {
  beforeEach(() => {
    window.location.hash = '';
  });

  afterEach(() => {
    window.location.hash = '';
  });

  it('hash.slice(1) empty defaults to / (kills L39 1→0/2 and ||→&&)', () => {
    window.location.hash = '';
    expect(getCurrentPath()).toBe('/');
    window.location.hash = '#';
    expect(getCurrentPath()).toBe('/');
    window.location.hash = '#/';
    expect(getCurrentPath()).toBe('/');
  });

  it('strips query at index 0 and mid-path (kills L44 >=→> / 0→1)', () => {
    window.location.hash = '#?flag=1';
    expect(getCurrentPath()).toBe('');
    window.location.hash = '#/game/hex?board3d=1';
    expect(getCurrentPath()).toBe('/game/hex');
  });

  it('getPathParams maps multiple named segments; miss returns {}', () => {
    expect(getPathParams('/g/:a/:b', '/g/x/y')).toEqual({ a: 'x', b: 'y' });
    expect(getPathParams('/g/:a/:b', '/g/x')).toEqual({});
    // match[index+1] arm — single param still maps
    expect(getPathParams('/g/:id', '/g/hex')).toEqual({ id: 'hex' });
  });

  it('handleRoute first match wins; unknown hits notFound once', () => {
    const hits: string[] = [];
    addRoute('/w10-a', () => hits.push('a'));
    addRoute('/w10-a', () => hits.push('a2'));
    window.location.hash = '#/w10-a';
    handleRoute();
    expect(hits).toEqual(['a']);

    let notFound = 0;
    setNotFoundHandler(() => {
      notFound += 1;
    });
    window.location.hash = '#/w10-missing-zzz';
    handleRoute();
    expect(notFound).toBe(1);
  });

  it('navigate sets location.hash with leading #', () => {
    navigate('/w10-nav');
    expect(window.location.hash).toBe('#/w10-nav');
  });
});
