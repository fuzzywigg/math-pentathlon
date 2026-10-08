/**
 * Runtime feature flags. Defaults are OFF so production behaviour is unchanged
 * unless explicitly enabled via URL or localStorage.
 */

import { readUrlOrStorageFlag, type StorageLike } from './url-flags';

export const BOARD_3D_PARAM = 'board3d';
export const BOARD_3D_STORAGE_KEY = 'mp-board3d';

/**
 * Whether the optional Three.js 3D board view is enabled.
 * Enable with `?board3d=1` (or `true`) on the search string or hash query,
 * or localStorage key `mp-board3d` = `1`.
 * Explicit `board3d=0` / `false` forces OFF even if localStorage is set.
 * Non-allowlisted tokens are ignored (never treated as truthy strings for DOM).
 */
export function isBoard3dEnabled(
  search: string = typeof window !== 'undefined' ? window.location.search : '',
  storage: StorageLike | null = typeof localStorage !== 'undefined'
    ? localStorage
    : null,
  hash: string = typeof window !== 'undefined' ? window.location.hash : ''
): boolean {
  return readUrlOrStorageFlag(
    BOARD_3D_PARAM,
    BOARD_3D_STORAGE_KEY,
    search,
    hash,
    storage
  );
}
