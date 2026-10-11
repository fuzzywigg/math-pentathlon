import { describe, expect, it } from 'vitest';
import { withOracleRandom } from './ai-determinism-helpers';

describe('withOracleRandom async contract (q-mp-1350)', () => {
  it('sync path returns oracle 0 and restores Math.random', () => {
    const native = Math.random;
    const got = withOracleRandom(() => Math.random());
    expect(got).toBe(0);
    expect(Math.random).toBe(native);
  });

  it('rejects async/thenable callbacks with TypeError and restores Math.random', () => {
    const native = Math.random;
    expect(() =>
      withOracleRandom(async () => {
        await Promise.resolve();
        return Math.random();
      })
    ).toThrow(TypeError);
    expect(() =>
      withOracleRandom(async () => {
        await Promise.resolve();
        return Math.random();
      })
    ).toThrow(/does not support async callbacks/);
    expect(Math.random).toBe(native);

    // Same contract for a bare thenable (not a native Promise)
    expect(() =>
      withOracleRandom(() => ({
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
      withOracleRandom(() => {
        throw new Error('boom');
      })
    ).toThrow('boom');
    expect(Math.random).toBe(native);
  });
});
