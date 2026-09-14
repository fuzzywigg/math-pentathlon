/**
 * Wave 36 — getPathParams for every registry game id.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { GAMES } from '../../src/core/game-registry';
import { getPathParams } from '../../src/core/router';

describe('Wave 36 router-ids — registry path params', () => {
  it('extracts id for every GAMES entry', () => {
    for (const game of GAMES) {
      expect(getPathParams('/game/:id', `/game/${game.id}`)).toEqual({
        id: game.id,
      });
    }
  });

  it('rejects empty and over-nested game paths', () => {
    expect(getPathParams('/game/:id', '/game/')).toEqual({});
    expect(getPathParams('/game/:id', '/game/a/b')).toEqual({});
  });
});
