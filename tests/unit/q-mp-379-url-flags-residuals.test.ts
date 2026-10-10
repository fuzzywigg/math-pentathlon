/**
 * q-mp-379 — characterize `src/core/url-flags.ts` parse / empty /
 * conflicting-query residuals. Tests only. Structural boolean asserts —
 * no player-facing copy pins, no settings-flags (q-mp-378) ownership,
 * no AI / rules / scoring paths.
 */
import { afterEach, describe, expect, it } from 'vitest';
import {
  parseAllowlistedFlag,
  readUrlOrStorageFlag,
} from '../../src/core/url-flags';

const KEY = 'board3d';
const STORAGE_KEY = 'mp-board3d-q379';

describe('q-mp-379 url-flags residuals', () => {
  afterEach(() => {
    localStorage.removeItem(STORAGE_KEY);
  });

  describe('parseAllowlistedFlag empty / unknown', () => {
    it('rejects whitespace-only and non-boolean tokens as unset', () => {
      expect(parseAllowlistedFlag('   ')).toBeNull();
      expect(parseAllowlistedFlag('\t')).toBeNull();
      expect(parseAllowlistedFlag('on')).toBeNull();
      expect(parseAllowlistedFlag('off')).toBeNull();
      expect(parseAllowlistedFlag('yes')).toBeNull();
      expect(parseAllowlistedFlag('no')).toBeNull();
      expect(parseAllowlistedFlag('01')).toBeNull();
      expect(parseAllowlistedFlag('10')).toBeNull();
      expect(parseAllowlistedFlag('trueish')).toBeNull();
    });

    it('accepts trimmed mixed-case allowlist tokens only', () => {
      expect(parseAllowlistedFlag(' 1 ')).toBe(true);
      expect(parseAllowlistedFlag(' TrUe ')).toBe(true);
      expect(parseAllowlistedFlag('TRUE\n')).toBe(true);
      expect(parseAllowlistedFlag(' 0 ')).toBe(false);
      expect(parseAllowlistedFlag(' FaLsE ')).toBe(false);
    });
  });

  describe('empty search / hash surfaces', () => {
    it('empty search, bare ?, and hash without ? leave storage as sole source', () => {
      const storageOn = { getItem: () => '1' as string | null };
      expect(readUrlOrStorageFlag(KEY, STORAGE_KEY, '', '', storageOn)).toBe(
        true
      );
      expect(readUrlOrStorageFlag(KEY, STORAGE_KEY, '?', '', storageOn)).toBe(
        true
      );
      expect(
        readUrlOrStorageFlag(KEY, STORAGE_KEY, '', '#/game/hex', storageOn)
      ).toBe(true);
      expect(
        readUrlOrStorageFlag(KEY, STORAGE_KEY, '', '#/game/hex?', storageOn)
      ).toBe(true);
    });

    it('present key with empty value is unset and falls through', () => {
      const storageOn = { getItem: () => '1' as string | null };
      expect(
        readUrlOrStorageFlag(KEY, STORAGE_KEY, `?${KEY}=`, '', storageOn)
      ).toBe(true);
      expect(
        readUrlOrStorageFlag(
          KEY,
          STORAGE_KEY,
          '',
          `#/game/hex?${KEY}=`,
          storageOn
        )
      ).toBe(true);
    });

    it('unrelated query keys never enable the target flag', () => {
      expect(
        readUrlOrStorageFlag(
          KEY,
          STORAGE_KEY,
          '?other=1&board3dLQ=1',
          '',
          null
        )
      ).toBe(false);
      expect(
        readUrlOrStorageFlag(
          KEY,
          STORAGE_KEY,
          '',
          '#/game/hex?other=1&board3dLQ=1',
          null
        )
      ).toBe(false);
    });
  });

  describe('conflicting query precedence', () => {
    it('search wins over opposite hash when both are allowlisted', () => {
      expect(
        readUrlOrStorageFlag(
          KEY,
          STORAGE_KEY,
          `?${KEY}=1`,
          `#/game/hex?${KEY}=0`,
          { getItem: () => '0' }
        )
      ).toBe(true);
      expect(
        readUrlOrStorageFlag(
          KEY,
          STORAGE_KEY,
          `?${KEY}=0`,
          `#/game/hex?${KEY}=1`,
          { getItem: () => '1' }
        )
      ).toBe(false);
    });

    it('hash allowlisted false beats storage true when search is unset', () => {
      expect(
        readUrlOrStorageFlag(
          KEY,
          STORAGE_KEY,
          '',
          `#/game/hex?${KEY}=0`,
          { getItem: () => '1' }
        )
      ).toBe(false);
      expect(
        readUrlOrStorageFlag(
          KEY,
          STORAGE_KEY,
          '',
          `#/game/hex?${KEY}=false`,
          { getItem: () => 'true' }
        )
      ).toBe(false);
    });

    it('hash allowlisted true beats storage false when search is unset', () => {
      expect(
        readUrlOrStorageFlag(
          KEY,
          STORAGE_KEY,
          '',
          `#/game/hex?${KEY}=1`,
          { getItem: () => '0' }
        )
      ).toBe(true);
    });

    it('first duplicate search value wins (URLSearchParams.get)', () => {
      expect(
        readUrlOrStorageFlag(
          KEY,
          STORAGE_KEY,
          `?${KEY}=1&${KEY}=0`,
          '',
          { getItem: () => '0' }
        )
      ).toBe(true);
      expect(
        readUrlOrStorageFlag(
          KEY,
          STORAGE_KEY,
          `?${KEY}=0&${KEY}=1`,
          '',
          { getItem: () => '1' }
        )
      ).toBe(false);
    });

    it('non-allowlisted search falls through to allowlisted hash', () => {
      expect(
        readUrlOrStorageFlag(
          KEY,
          STORAGE_KEY,
          `?${KEY}=maybe`,
          `#/game/hex?${KEY}=1`,
          { getItem: () => '0' }
        )
      ).toBe(true);
    });

    it('non-allowlisted search and hash fall through to storage true-only', () => {
      expect(
        readUrlOrStorageFlag(
          KEY,
          STORAGE_KEY,
          `?${KEY}=yes`,
          `#/game/hex?${KEY}=no`,
          { getItem: () => '1' }
        )
      ).toBe(true);
      expect(
        readUrlOrStorageFlag(
          KEY,
          STORAGE_KEY,
          `?${KEY}=yes`,
          `#/game/hex?${KEY}=no`,
          { getItem: () => '0' }
        )
      ).toBe(false);
      expect(
        readUrlOrStorageFlag(
          KEY,
          STORAGE_KEY,
          `?${KEY}=yes`,
          `#/game/hex?${KEY}=no`,
          { getItem: () => null }
        )
      ).toBe(false);
    });
  });

  describe('null-storage safeGetItem path residuals', () => {
    it('reads allowlisted localStorage when search and hash are empty', () => {
      localStorage.setItem(STORAGE_KEY, 'true');
      expect(readUrlOrStorageFlag(KEY, STORAGE_KEY, '', '', null)).toBe(true);
    });

    it('treats storage false / junk / missing as disabled', () => {
      localStorage.setItem(STORAGE_KEY, 'false');
      expect(readUrlOrStorageFlag(KEY, STORAGE_KEY, '', '', null)).toBe(false);
      localStorage.setItem(STORAGE_KEY, 'yes');
      expect(readUrlOrStorageFlag(KEY, STORAGE_KEY, '', '', null)).toBe(false);
      localStorage.removeItem(STORAGE_KEY);
      expect(readUrlOrStorageFlag(KEY, STORAGE_KEY, '', '', null)).toBe(false);
    });

    it('explicit search false still wins over localStorage true', () => {
      localStorage.setItem(STORAGE_KEY, '1');
      expect(
        readUrlOrStorageFlag(KEY, STORAGE_KEY, `?${KEY}=0`, '', null)
      ).toBe(false);
    });
  });
});
