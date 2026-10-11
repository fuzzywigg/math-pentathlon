/**
 * Hermetic coverage for scripts/lib/playtest-url.mjs (q-mp-1305).
 */
import { describe, it, expect } from 'vitest';
import { joinPlaytestGameUrl } from '../../scripts/lib/playtest-url.mjs';

describe('joinPlaytestGameUrl (q-mp-1305)', () => {
  it('strips a trailing slash so BASE/ does not become //#/game/…', () => {
    expect(joinPlaytestGameUrl('http://127.0.0.1:5173/', 'stars-bars')).toBe(
      'http://127.0.0.1:5173/#/game/stars-bars'
    );
  });

  it('keeps a single slash when BASE has no trailing slash', () => {
    expect(joinPlaytestGameUrl('http://127.0.0.1:5173', 'calla')).toBe(
      'http://127.0.0.1:5173/#/game/calla'
    );
  });

  it('strips multiple trailing slashes', () => {
    expect(joinPlaytestGameUrl('http://localhost:5173///', 'hex')).toBe(
      'http://localhost:5173/#/game/hex'
    );
  });

  it('coerces nullish base to empty then joins', () => {
    expect(joinPlaytestGameUrl(undefined, 'ramrod')).toBe('/#/game/ramrod');
    expect(joinPlaytestGameUrl(null, 'par-55')).toBe('/#/game/par-55');
  });
});
