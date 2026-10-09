/**
 * burn-1008-mp-mutation-audit-ui — kill survivors in feature-flags.ts defaults.
 */
import { afterEach, describe, expect, it } from 'vitest';
import {
  BOARD_3D_STORAGE_KEY,
  isBoard3dEnabled,
} from '../../src/core/feature-flags';

describe('mutation-ui feature-flags', () => {
  afterEach(() => {
    window.history.replaceState(null, '', '/');
    window.location.hash = '';
    localStorage.removeItem(BOARD_3D_STORAGE_KEY);
  });

  it('no-arg call reads window.location.search via default param', () => {
    // Survivors: typeof window !== 'undefined' flipped in search default.
    localStorage.removeItem(BOARD_3D_STORAGE_KEY);
    window.location.hash = '';
    window.history.replaceState(null, '', '/?board3d=1');
    expect(window.location.search).toContain('board3d=1');
    expect(isBoard3dEnabled()).toBe(true);
  });

  it('no-arg call reads window.location.hash via default param', () => {
    localStorage.removeItem(BOARD_3D_STORAGE_KEY);
    window.history.replaceState(null, '', '/');
    window.location.hash = '#/game/hex?board3d=1';
    expect(isBoard3dEnabled()).toBe(true);
  });

  it('no-arg call is OFF when search/hash/storage unset', () => {
    localStorage.removeItem(BOARD_3D_STORAGE_KEY);
    window.history.replaceState(null, '', '/');
    window.location.hash = '';
    expect(isBoard3dEnabled()).toBe(false);
  });
});
