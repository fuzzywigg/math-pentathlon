/**
 * q-mp-1303: withThrowingLocalStorageAccess must not leave a throwing getter
 * when globalThis had no prior own localStorage descriptor.
 */
import { afterEach, beforeAll, describe, expect, it } from 'vitest';

import { withThrowingLocalStorageAccess } from '../helpers/storage-stubs';

function localStorageOwnDescriptor(): PropertyDescriptor | undefined {
  return Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
}

describe('withThrowingLocalStorageAccess restore (q-mp-1303)', () => {
  /** Happy-dom / jsdom own descriptor for this worker — always restored. */
  let envDescriptor: PropertyDescriptor | undefined;

  beforeAll(() => {
    envDescriptor = localStorageOwnDescriptor();
  });

  afterEach(() => {
    if (envDescriptor) {
      Object.defineProperty(globalThis, 'localStorage', envDescriptor);
    } else {
      Reflect.deleteProperty(globalThis, 'localStorage');
    }
  });

  it('deletes the temporary getter when no prior own descriptor existed (sync)', async () => {
    Reflect.deleteProperty(globalThis, 'localStorage');
    expect(localStorageOwnDescriptor()).toBeUndefined();

    const result = await withThrowingLocalStorageAccess(() => 'sync-ok');
    expect(result).toBe('sync-ok');

    expect(localStorageOwnDescriptor()).toBeUndefined();
  });

  it('deletes the temporary getter when no prior own descriptor existed (async)', async () => {
    Reflect.deleteProperty(globalThis, 'localStorage');
    expect(localStorageOwnDescriptor()).toBeUndefined();

    const result = await withThrowingLocalStorageAccess(async () => {
      await Promise.resolve();
      return 'async-ok';
    });
    expect(result).toBe('async-ok');

    expect(localStorageOwnDescriptor()).toBeUndefined();
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

    await withThrowingLocalStorageAccess(() => {
      expect(() => globalThis.localStorage).toThrow(
        /Safari private|SecurityError|blocked/i
      );
    });

    expect(globalThis.localStorage).toBe(stub);
    expect(localStorageOwnDescriptor()?.value).toBe(stub);
  });
});
