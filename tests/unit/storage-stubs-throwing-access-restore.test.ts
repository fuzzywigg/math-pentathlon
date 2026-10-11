/**
 * q-mp-1303: withThrowingLocalStorageAccess must not leave a throwing getter
 * when globalThis had no prior own localStorage descriptor.
 */
import { afterEach, describe, expect, it } from 'vitest';

import { withThrowingLocalStorageAccess } from '../helpers/storage-stubs';

function localStorageOwnDescriptor(): PropertyDescriptor | undefined {
  return Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
}

describe('withThrowingLocalStorageAccess restore (q-mp-1303)', () => {
  let saved: PropertyDescriptor | undefined;

  afterEach(() => {
    if (saved) {
      Object.defineProperty(globalThis, 'localStorage', saved);
      saved = undefined;
    } else {
      Reflect.deleteProperty(globalThis, 'localStorage');
    }
  });

  it('deletes the temporary getter when no prior own descriptor existed (sync)', async () => {
    saved = localStorageOwnDescriptor();
    Reflect.deleteProperty(globalThis, 'localStorage');
    expect(localStorageOwnDescriptor()).toBeUndefined();

    const result = await withThrowingLocalStorageAccess(() => 'sync-ok');
    expect(result).toBe('sync-ok');

    const after = localStorageOwnDescriptor();
    expect(after).toBeUndefined();
  });

  it('deletes the temporary getter when no prior own descriptor existed (async)', async () => {
    saved = localStorageOwnDescriptor();
    Reflect.deleteProperty(globalThis, 'localStorage');
    expect(localStorageOwnDescriptor()).toBeUndefined();

    const result = await withThrowingLocalStorageAccess(async () => {
      await Promise.resolve();
      return 'async-ok';
    });
    expect(result).toBe('async-ok');

    const after = localStorageOwnDescriptor();
    expect(after).toBeUndefined();
  });

  it('restores the prior own descriptor when one existed', async () => {
    const stub: Storage = {
      length: 0,
      clear() {},
      getItem() {
        return null;
      },
      key() {
        return null;
      },
      removeItem() {},
      setItem() {},
    };
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: stub,
    });
    saved = localStorageOwnDescriptor();

    await withThrowingLocalStorageAccess(() => {
      expect(() => globalThis.localStorage).toThrow(
        /Safari private|SecurityError|blocked/i
      );
    });

    expect(globalThis.localStorage).toBe(stub);
    expect(localStorageOwnDescriptor()?.value).toBe(stub);
  });
});
