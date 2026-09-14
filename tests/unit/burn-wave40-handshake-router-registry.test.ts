/**
 * Wave 40 — handshake router × registry game ids.
 * Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { addRoute, handleRoute, getPathParams } from '../../src/core/router';
import { GAMES } from '../../src/core/game-registry';

describe('Wave 40 handshake — router × registry', () => {
  const tag = `w40reg-${Math.random().toString(36).slice(2, 8)}`;
  const seen: string[] = [];
  const pattern = `/w40game/${tag}/:id`;

  beforeEach(() => {
    seen.length = 0;
    window.location.hash = '';
    addRoute(pattern, () => {
      const path = window.location.hash.slice(1);
      const p = getPathParams(pattern, path);
      if (p.id) seen.push(p.id);
    });
  });

  afterEach(() => {
    window.location.hash = '';
  });

  it('navigating each game id hits handler with that id', () => {
    for (const g of GAMES.slice(0, 5)) {
      window.location.hash = `#/w40game/${tag}/${g.id}`;
      handleRoute();
    }
    expect(seen).toEqual(GAMES.slice(0, 5).map((g) => g.id));
  });
});
