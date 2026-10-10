/**
 * q-mp-656 — Close `bootstrap-owl` residual branches under the *bootstrap-owl*
 * verify glob (tests-only; 0 src; injected import stubs — no network).
 *
 * Tip re-measure (`cursor/mp-tip-post1059` @ `be822e75`):
 * - Spec glob `tests/unit/*bootstrap-owl*` (idle-warm + mutation-ui3):
 *   **94.73%** lines / **85.71%** branches; uncovered stmt **L60**.
 * - Broader soft-fail hosts (`q-mp-256`, `q-mp-404`, burn-1007) already close
 *   L60 + default `importOwl` / `importOwlUi` bodies but do **not** match
 *   `*bootstrap-owl*` — same gap pattern as q-mp-653 / q-mp-658.
 *
 * Residual clusters closed here under the verify glob:
 * - Catch soft-fail (~60) when core import / UI init throws
 * - Default dynamic-import factories (~46–47) when injectors are omitted
 *
 * Leave #959/498 (void braces) contained — no void ceiling write.
 * No copy / aria / label / message-body text pins. No AI timing asserts.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { bootstrapOwl } from '../../src/pwa/bootstrap-owl';

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe('q-mp-656 bootstrapOwl — soft-fail catch residual (L60)', () => {
  it('soft-fails when owl core chunk import rejects (no unhandledrejection)', async () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const boom = new Error('q-mp-656 owl core chunk offline');
    const unhandled: unknown[] = [];
    const onUnhandled = (reason: unknown) => {
      unhandled.push(reason);
    };
    process.on('unhandledRejection', onUnhandled);

    bootstrapOwl({
      enabled: true,
      schedule: (cb) => {
        cb();
      },
      importOwl: async () => {
        throw boom;
      },
      importOwlUi: async () => ({ owlComponent: { init: vi.fn() } }) as never,
    });

    await vi.waitFor(() => {
      expect(errSpy).toHaveBeenCalled();
      expect(errSpy.mock.calls.some((c) => c.includes(boom))).toBe(true);
    });
    await Promise.resolve();
    await Promise.resolve();
    expect(unhandled).toHaveLength(0);

    process.off('unhandledRejection', onUnhandled);
  });

  it('soft-fails when owlComponent.init throws (no unhandledrejection)', async () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const boom = new Error('q-mp-656 owl ui init boom');
    const unhandled: unknown[] = [];
    const onUnhandled = (reason: unknown) => {
      unhandled.push(reason);
    };
    process.on('unhandledRejection', onUnhandled);

    const initialize = vi.fn();
    bootstrapOwl({
      enabled: true,
      schedule: (cb) => {
        cb();
      },
      importOwl: async () => ({ owlSystem: { initialize } }) as never,
      importOwlUi: async () =>
        ({
          owlComponent: {
            init: () => {
              throw boom;
            },
          },
        }) as never,
    });

    await vi.waitFor(() => {
      expect(errSpy).toHaveBeenCalled();
      expect(errSpy.mock.calls.some((c) => c.includes(boom))).toBe(true);
    });
    await Promise.resolve();
    await Promise.resolve();
    expect(unhandled).toHaveLength(0);
    expect(initialize).not.toHaveBeenCalled();

    process.off('unhandledRejection', onUnhandled);
  });
});

describe('q-mp-656 bootstrapOwl — default import factories (~46–47)', () => {
  it('omitted importOwl / importOwlUi invoke default dynamic imports', async () => {
    // Exercises the `?? (() => import(...))` factory bodies under the
    // *bootstrap-owl* glob (burn-1007 covers this but does not match that glob).
    let scheduled: (() => void) | undefined;
    bootstrapOwl({
      enabled: true,
      schedule: (cb) => {
        scheduled = cb;
      },
    });
    expect(scheduled).toBeTypeOf('function');
    scheduled!();
    // Allow the async import to settle without asserting DOM or copy.
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
  });

  it('happy path still orders owlComponent.init before owlSystem.initialize', async () => {
    const order: string[] = [];
    bootstrapOwl({
      enabled: true,
      schedule: (cb) => {
        cb();
      },
      importOwl: async () =>
        ({
          owlSystem: {
            initialize: () => {
              order.push('initialize');
            },
          },
        }) as never,
      importOwlUi: async () =>
        ({
          owlComponent: {
            init: () => {
              order.push('init');
            },
          },
        }) as never,
    });

    await vi.waitFor(() => {
      expect(order).toEqual(['init', 'initialize']);
    });
  });
});
