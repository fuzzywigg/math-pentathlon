/**
 * Wave 42 — initRouter hashchange dispatch leftovers.
 * Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  addRoute,
  setNotFoundHandler,
  initRouter,
  handleRoute,
  navigate,
  getCurrentPath,
} from '../../src/core/router';

describe('Wave 42 router — hashchange init', () => {
  const tag = `w42-${Math.random().toString(36).slice(2, 8)}`;

  beforeEach(() => {
    window.location.hash = '';
  });

  afterEach(() => {
    window.location.hash = '';
    vi.restoreAllMocks();
  });

  it('initRouter dispatches current hash immediately', () => {
    const hits: string[] = [];
    addRoute(`/w42/init-${tag}`, () => hits.push('init'));
    window.location.hash = `#/w42/init-${tag}`;
    initRouter();
    expect(hits).toContain('init');
  });

  it('hashchange after initRouter invokes handler', () => {
    const hits: string[] = [];
    addRoute(`/w42/chg-${tag}`, () => hits.push('chg'));
    initRouter();
    window.location.hash = `#/w42/chg-${tag}`;
    // jsdom may or may not fire hashchange synchronously — call handleRoute as fallback
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    expect(hits).toContain('chg');
  });

  it('navigate updates getCurrentPath', () => {
    navigate(`/w42/nav-${tag}`);
    expect(getCurrentPath()).toBe(`/w42/nav-${tag}`);
  });

  it('unknown path after init uses notFoundHandler', () => {
    const miss = vi.fn();
    setNotFoundHandler(miss);
    window.location.hash = `#/w42/missing-${tag}`;
    handleRoute();
    expect(miss).toHaveBeenCalled();
  });
});
