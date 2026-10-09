import { describe, expect, it } from 'vitest';
import { isBoard3dEnabled } from '../../src/core/feature-flags';
import {
  parseAllowlistedFlag,
  readUrlOrStorageFlag,
} from '../../src/core/url-flags';

describe('url-flags security', () => {
  it('accepts only allowlisted boolean tokens', () => {
    expect(parseAllowlistedFlag('1')).toBe(true);
    expect(parseAllowlistedFlag('true')).toBe(true);
    expect(parseAllowlistedFlag('0')).toBe(false);
    expect(parseAllowlistedFlag('false')).toBe(false);
    expect(parseAllowlistedFlag('<img>')).toBeNull();
    expect(parseAllowlistedFlag('yes')).toBeNull();
    expect(parseAllowlistedFlag('')).toBeNull();
  });

  it('ignores non-allowlisted URL params (no accidental truthy strings)', () => {
    expect(
      readUrlOrStorageFlag('board3d', 'mp-board3d', '?board3d=<script>', '', null)
    ).toBe(false);
    expect(
      isBoard3dEnabled('?board3d=javascript:alert(1)', null, '')
    ).toBe(false);
  });

  it('honors explicit false over storage', () => {
    const storage = {
      getItem: () => '1',
    };
    expect(
      readUrlOrStorageFlag('board3d', 'mp-board3d', '?board3d=0', '', storage)
    ).toBe(false);
  });

  it('reads hash query allowlisted flags', () => {
    expect(
      readUrlOrStorageFlag(
        'board3d',
        'mp-board3d',
        '',
        '#/game/hex?board3d=1',
        null
      )
    ).toBe(true);
  });
});
