/**
 * Wave 36 — addRoute first-match order leftovers.
 * Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { addRoute, handleRoute, setNotFoundHandler } from '../../src/core/router';

describe('Wave 36 router-order — first registered wins', () => {
  const tag = `w36-${Math.random().toString(36).slice(2, 8)}`;

  beforeEach(() => {
    window.location.hash = '';
  });

  afterEach(() => {
    window.location.hash = '';
    vi.restoreAllMocks();
  });

  it('param route registered first beats later static', () => {
    const hits: string[] = [];
    addRoute(`/w36/${tag}/:id`, () => hits.push('param'));
    addRoute(`/w36/${tag}/hex`, () => hits.push('static'));
    window.location.hash = `#/w36/${tag}/hex`;
    handleRoute();
    expect(hits).toEqual(['param']);
  });

  it('static registered first beats later param', () => {
    const hits: string[] = [];
    addRoute(`/w36b/${tag}/hex`, () => hits.push('static'));
    addRoute(`/w36b/${tag}/:id`, () => hits.push('param'));
    window.location.hash = `#/w36b/${tag}/hex`;
    handleRoute();
    expect(hits).toEqual(['static']);
  });

  it('notFound when nothing matches unique path', () => {
    const notFound = vi.fn();
    setNotFoundHandler(notFound);
    window.location.hash = `#/w36-miss-${tag}`;
    handleRoute();
    expect(notFound).toHaveBeenCalledTimes(1);
  });
});
