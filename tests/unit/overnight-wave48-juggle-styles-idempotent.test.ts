/**
 * Wave 48 overnight — Juggle injectStyles idempotent. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

beforeEach(() => document.getElementById('juggle-styles')?.remove());

describe('Wave 48 juggle overnight — styles idempotent', () => {
  it('second call keeps single style tag', () => {
    injectJuggleStyles();
    injectJuggleStyles();
    expect(document.querySelectorAll('#juggle-styles')).toHaveLength(1);
  });
});
