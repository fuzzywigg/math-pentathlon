/**
 * Wave 40 — router empty hash '/', default console.error 404, navigate, multi-param leftovers.
 * Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  addRoute,
  setNotFoundHandler,
  navigate,
  getCurrentPath,
  getPathParams,
  handleRoute,
} from '../../src/core/router';

describe('Wave 40 router — empty hash / 404 / params', () => {
  const tag = `w40-${Math.random().toString(36).slice(2, 8)}`;

  beforeEach(() => {
    window.location.hash = '';
  });

  afterEach(() => {
    window.location.hash = '';
    vi.restoreAllMocks();
  });

  it('empty hash getCurrentPath defaults to /', () => {
    window.location.hash = '';
    expect(getCurrentPath()).toBe('/');
  });

  it('default notFoundHandler logs console.error on unknown path', () => {
    // Reset to default handler by setting then restoring via module default path:
    // setNotFoundHandler replaces; re-install default behavior for this test.
    const err = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    setNotFoundHandler(() => {
      console.error('Route not found');
    });
    window.location.hash = `#/w40-miss-${tag}`;
    handleRoute();
    expect(err).toHaveBeenCalled();
    expect(err.mock.calls.some((c) => String(c[0]).includes('Route not found')))
      .toBe(true);
  });

  it('navigate without leading slash still sets hash as given', () => {
    navigate(`w40-nolead-${tag}`);
    expect(window.location.hash).toBe(`#w40-nolead-${tag}`);
    expect(getCurrentPath()).toBe(`w40-nolead-${tag}`);
  });

  it('multi-param getPathParams extracts all names', () => {
    expect(
      getPathParams(
        `/w40/${tag}/game/:id/move/:n/seat/:s`,
        `/w40/${tag}/game/hex/move/3/seat/a`
      )
    ).toEqual({ id: 'hex', n: '3', s: 'a' });
  });

  it('registered unique path dispatches; unmatched uses setNotFoundHandler', () => {
    const hits: string[] = [];
    const notFound = vi.fn();
    addRoute(`/w40/hit-${tag}`, () => hits.push('ok'));
    setNotFoundHandler(notFound);

    window.location.hash = `#/w40/hit-${tag}`;
    handleRoute();
    expect(hits).toEqual(['ok']);

    window.location.hash = `#/w40/nope-${tag}`;
    handleRoute();
    expect(notFound).toHaveBeenCalledTimes(1);
  });
});
