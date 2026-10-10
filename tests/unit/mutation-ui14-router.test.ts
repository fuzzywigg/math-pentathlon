/**
 * q-mp-429 mutation audit UI wave 14 — structural re-pins for router
 * (wave-10 / wave-1 already at 100%; pointer-hygiene owned by open #896 w13).
 * Separate from parallel characterization q-mp-422.
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

describe('mutation-ui14 router', () => {
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

  it('getPathParams maps named segments; miss returns {}', () => {
    expect(getPathParams('/g/:a/:b', '/g/x/y')).toEqual({ a: 'x', b: 'y' });
    expect(getPathParams('/g/:a/:b', '/g/x')).toEqual({});
    expect(getPathParams('/g/:id', '/g/hex')).toEqual({ id: 'hex' });
  });

  it('handleRoute first match wins; unknown hits notFound once', () => {
    const hits: string[] = [];
    addRoute('/w14-a', () => hits.push('a'));
    addRoute('/w14-a', () => hits.push('a2'));
    window.location.hash = '#/w14-a';
    handleRoute();
    expect(hits).toEqual(['a']);

    let notFound = 0;
    setNotFoundHandler(() => {
      notFound += 1;
    });
    window.location.hash = '#/w14-missing-zzz';
    handleRoute();
    expect(notFound).toBe(1);
  });

  it('navigate sets location.hash with leading #', () => {
    navigate('/w14-nav');
    expect(window.location.hash).toBe('#/w14-nav');
  });
});
