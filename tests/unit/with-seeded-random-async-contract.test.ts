import { describe, expect, it } from 'vitest';
import { createSeededRng, withSeededRandom } from '../helpers/rng';

describe('withSeededRandom async contract (q-mp-1302)', () => {
  it('sync path returns the seeded first draw and restores Math.random', () => {
    const native = Math.random;
    const expected = createSeededRng(1)();
    const got = withSeededRandom(1, () => Math.random());
    expect(got).toBe(expected);
    expect(Math.random).toBe(native);
  });

  it('rejects async/thenable callbacks with TypeError and restores Math.random', async () => {
    const native = Math.random;
    expect(() =>
      withSeededRandom(1, async () => {
        await Promise.resolve();
        return Math.random();
      })
    ).toThrow(TypeError);
    expect(() =>
      withSeededRandom(1, async () => {
        await Promise.resolve();
        return Math.random();
      })
    ).toThrow(/does not support async callbacks/);
    expect(Math.random).toBe(native);

    // Same contract for a bare thenable (not a native Promise)
    expect(() =>
      withSeededRandom(1, () => ({
        then(onFulfilled: (v: number) => unknown) {
          return Promise.resolve(onFulfilled(0.5));
        },
      }))
    ).toThrow(TypeError);
    expect(Math.random).toBe(native);
  });

  it('restores Math.random when the sync callback throws', () => {
    const native = Math.random;
    expect(() =>
      withSeededRandom(1, () => {
        throw new Error('boom');
      })
    ).toThrow('boom');
    expect(Math.random).toBe(native);
  });
});
