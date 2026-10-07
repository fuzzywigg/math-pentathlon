/**
 * Runtime feature flags. Defaults are OFF so production behaviour is unchanged
 * unless explicitly enabled via URL or localStorage.
 */

export const BOARD_3D_PARAM = 'board3d';
export const BOARD_3D_STORAGE_KEY = 'mp-board3d';

type StorageLike = Pick<Storage, 'getItem'>;

function readParam(search: string, hash: string, key: string): string | null {
  const fromSearch = new URLSearchParams(
    search.startsWith('?') ? search : search ? `?${search}` : ''
  ).get(key);
  if (fromSearch !== null) return fromSearch;

  // Hash routers often carry query after the path: #/game/foo?board3d=1
  const hashQueryIndex = hash.indexOf('?');
  if (hashQueryIndex >= 0) {
    return new URLSearchParams(hash.slice(hashQueryIndex)).get(key);
  }
  return null;
}

/**
 * Whether the optional Three.js 3D board view is enabled.
 * Enable with `?board3d=1` (or `true`) on the search string or hash query,
 * or localStorage key `mp-board3d` = `1`.
 * Explicit `board3d=0` / `false` forces OFF even if localStorage is set.
 */
export function isBoard3dEnabled(
  search: string = typeof window !== 'undefined' ? window.location.search : '',
  storage: StorageLike | null = typeof localStorage !== 'undefined'
    ? localStorage
    : null,
  hash: string = typeof window !== 'undefined' ? window.location.hash : ''
): boolean {
  const param = readParam(search, hash, BOARD_3D_PARAM);

  if (param === '1' || param === 'true') {
    return true;
  }
  if (param === '0' || param === 'false') {
    return false;
  }

  if (!storage) {
    return false;
  }

  try {
    return storage.getItem(BOARD_3D_STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}
