/**
 * burn-1008-mp-mutation-audit-ui — kill survivors in url-flags + feature-flags.
 * No player-facing copy assertions.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  parseAllowlistedFlag,
  readUrlOrStorageFlag,
} from '../../src/core/url-flags';
import { isBoard3dEnabled } from '../../src/core/feature-flags';

describe('mutation-ui url-flags', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    window.history.replaceState(null, '', '/');
  });

  it('parseAllowlistedFlag trims and lowercases tokens', () => {
    expect(parseAllowlistedFlag('  TRUE  ')).toBe(true);
    expect(parseAllowlistedFlag(' False ')).toBe(false);
    expect(parseAllowlistedFlag(null)).toBeNull();
  });

  it('hash query at index 0 still counts (?key=1 with empty path)', () => {
    // Survivors: hashQueryIndex >= 0 → > / 0 → 1
    expect(
      readUrlOrStorageFlag('board3d', 'mp-board3d', '', '?board3d=1', null)
    ).toBe(true);
  });

  it('storage getItem true only when parseAllowlistedFlag === true', () => {
    const storage = {
      getItem: () => '1',
    };
    expect(
      readUrlOrStorageFlag('board3d', 'mp-board3d', '', '', storage)
    ).toBe(true);
    const storageFalse = { getItem: () => '0' };
    expect(
      readUrlOrStorageFlag('board3d', 'mp-board3d', '', '', storageFalse)
    ).toBe(false);
    const storageJunk = { getItem: () => 'yes' };
    expect(
      readUrlOrStorageFlag('board3d', 'mp-board3d', '', '', storageJunk)
    ).toBe(false);
  });

  it('storage getItem throw soft-fails to false', () => {
    const storage = {
      getItem: () => {
        throw new Error('blocked');
      },
    };
    expect(
      readUrlOrStorageFlag('board3d', 'mp-board3d', '', '', storage)
    ).toBe(false);
  });

  it('null storage peeks safe localStorage allowlisted true', () => {
    localStorage.setItem('mp-board3d-mut', '1');
    expect(
      readUrlOrStorageFlag('board3d', 'mp-board3d-mut', '', '', null)
    ).toBe(true);
    localStorage.removeItem('mp-board3d-mut');
  });

  it('search without leading ? is still parsed', () => {
    expect(
      readUrlOrStorageFlag('board3d', 'mp-board3d', 'board3d=1', '', null)
    ).toBe(true);
  });
});

describe('mutation-ui feature-flags defaults', () => {
  afterEach(() => {
    window.history.replaceState(null, '', '/');
    localStorage.removeItem('mp-board3d');
  });

  it('no-arg call reads live window.location.search (default param)', () => {
    // Survivors: typeof window !== 'undefined' flipped in default params.
    window.history.replaceState(null, '', '/?board3d=1');
    expect(isBoard3dEnabled()).toBe(true);
  });

  it('no-arg call reads live window.location.hash query', () => {
    window.history.replaceState(null, '', '/');
    window.location.hash = '#/game/hex?board3d=1';
    expect(isBoard3dEnabled()).toBe(true);
    window.location.hash = '';
  });
});
