import { describe, it, expect, afterEach } from 'vitest';
import {
  isBoard3dEnabled,
  BOARD_3D_STORAGE_KEY,
} from '../../src/core/feature-flags';

function memoryStorage(initial: Record<string, string> = {}): Storage {
  const data = { ...initial };
  return {
    get length() {
      return Object.keys(data).length;
    },
    clear() {
      for (const k of Object.keys(data)) delete data[k];
    },
    getItem(key: string) {
      return Object.prototype.hasOwnProperty.call(data, key)
        ? data[key]!
        : null;
    },
    key(index: number) {
      return Object.keys(data)[index] ?? null;
    },
    removeItem(key: string) {
      delete data[key];
    },
    setItem(key: string, value: string) {
      data[key] = String(value);
    },
  };
}

describe('mp3d feature flags', () => {
  afterEach(() => {
    // no shared mutable state in the helper
  });

  it('defaults OFF with empty search and empty storage', () => {
    expect(isBoard3dEnabled('', memoryStorage())).toBe(false);
    expect(isBoard3dEnabled('?', memoryStorage())).toBe(false);
  });

  it('turns ON via hash query #/game/...?board3d=1', () => {
    expect(
      isBoard3dEnabled(
        '',
        memoryStorage(),
        '#/game/kings-quadraphages?board3d=1'
      )
    ).toBe(true);
  });

  it('turns ON via ?board3d=1 or true', () => {
    expect(isBoard3dEnabled('?board3d=1', memoryStorage())).toBe(true);
    expect(isBoard3dEnabled('?board3d=true', memoryStorage())).toBe(true);
  });

  it('turns ON via localStorage mp-board3d=1', () => {
    const storage = memoryStorage({ [BOARD_3D_STORAGE_KEY]: '1' });
    expect(isBoard3dEnabled('', storage)).toBe(true);
  });

  it('URL ?board3d=0 forces OFF even when storage is set', () => {
    const storage = memoryStorage({ [BOARD_3D_STORAGE_KEY]: '1' });
    expect(isBoard3dEnabled('?board3d=0', storage)).toBe(false);
    expect(isBoard3dEnabled('?board3d=false', storage)).toBe(false);
  });
});
