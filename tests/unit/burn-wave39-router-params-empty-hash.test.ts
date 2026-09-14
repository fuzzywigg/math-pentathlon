/**
 * Wave 39 — router empty hash / params / navigate leftovers.
 * Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  getCurrentPath,
  getPathParams,
  navigate,
  addRoute,
  handleRoute,
  setNotFoundHandler,
} from '../../src/core/router';

describe('Wave 39 router — empty hash params', () => {
  const original = window.location.hash;

  beforeEach(() => {
    window.location.hash = '';
  });

  afterEach(() => {
    window.location.hash = original;
  });

  it('getCurrentPath empty hash → /', () => {
    window.location.hash = '';
    expect(getCurrentPath()).toBe('/');
  });

  it('getPathParams miss → {} ; hit extracts id', () => {
    expect(getPathParams('/game/:id', '/other')).toEqual({});
    expect(getPathParams('/game/:id', '/game/star-track')).toEqual({
      id: 'star-track',
    });
  });

  it('navigate + handleRoute hits registered handler', () => {
    let hit = '';
    addRoute('/wave39-probe', () => {
      hit = 'ok';
    });
    setNotFoundHandler(() => {
      hit = '404';
    });
    navigate('/wave39-probe');
    handleRoute();
    expect(hit).toBe('ok');
    expect(getCurrentPath()).toBe('/wave39-probe');
  });
});
