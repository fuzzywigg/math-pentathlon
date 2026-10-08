/**
 * Shared URL / localStorage flag parsing for opt-in toggles.
 * Only allowlisted boolean tokens are accepted — never feed raw param
 * strings into the DOM.
 */

import { safeGetItem } from './safe-web-storage';

export type StorageLike = Pick<Storage, 'getItem'>;

const TRUE_TOKENS = new Set(['1', 'true']);
const FALSE_TOKENS = new Set(['0', 'false']);

/** Normalize a raw query/storage token to a boolean, or null if unknown. */
export function parseAllowlistedFlag(raw: string | null): boolean | null {
  if (raw === null) return null;
  const token = raw.trim().toLowerCase();
  if (TRUE_TOKENS.has(token)) return true;
  if (FALSE_TOKENS.has(token)) return false;
  return null;
}

/**
 * Read a flag from search, then hash query (`#/path?key=1`), then storage.
 * Explicit false in the URL wins over storage.
 * When `storage` is null, peeks localStorage via the safe wrapper (SecurityError /
 * missing store → treated as unset / false).
 */
export function readUrlOrStorageFlag(
  key: string,
  storageKey: string,
  search: string,
  hash: string,
  storage: StorageLike | null
): boolean {
  const fromSearch = new URLSearchParams(
    search.startsWith('?') ? search : search ? `?${search}` : ''
  ).get(key);
  const searchFlag = parseAllowlistedFlag(fromSearch);
  if (searchFlag !== null) return searchFlag;

  const hashQueryIndex = hash.indexOf('?');
  if (hashQueryIndex >= 0) {
    const fromHash = new URLSearchParams(hash.slice(hashQueryIndex)).get(key);
    const hashFlag = parseAllowlistedFlag(fromHash);
    if (hashFlag !== null) return hashFlag;
  }

  if (storage) {
    try {
      return parseAllowlistedFlag(storage.getItem(storageKey)) === true;
    } catch {
      return false;
    }
  }

  return parseAllowlistedFlag(safeGetItem(storageKey)) === true;
}
