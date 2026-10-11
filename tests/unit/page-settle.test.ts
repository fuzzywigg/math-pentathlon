/**
 * @vitest-environment node
 *
 * Hermetic coverage for scripts/lib/page-settle.mjs (q-mp-920).
 */
import { describe, it, expect, vi } from 'vitest';
import { waitDoubleRaf } from '../../scripts/lib/page-settle.mjs';

describe('waitDoubleRaf (q-mp-920)', () => {
  it('evaluates a double-rAF promise on the page', async () => {
    const rafCalls: Array<() => void> = [];
    const page = {
      evaluate: vi.fn(async (fn: () => Promise<unknown>) => {
        const prevRaf = globalThis.requestAnimationFrame;
        globalThis.requestAnimationFrame = ((cb: FrameRequestCallback) => {
          rafCalls.push(() => cb(0));
          return rafCalls.length;
        }) as typeof requestAnimationFrame;
        try {
          const pending = fn();
          expect(rafCalls).toHaveLength(1);
          rafCalls[0]!();
          expect(rafCalls).toHaveLength(2);
          rafCalls[1]!();
          await pending;
        } finally {
          globalThis.requestAnimationFrame = prevRaf;
        }
      }),
    };

    await waitDoubleRaf(page as never);
    expect(page.evaluate).toHaveBeenCalledTimes(1);
  });

  it('awaits page.evaluate resolution (settle completes)', async () => {
    let resolveEval: (() => void) | undefined;
    const page = {
      evaluate: vi.fn(
        () =>
          new Promise<void>((resolve) => {
            resolveEval = resolve;
          })
      ),
    };

    let settled = false;
    const done = waitDoubleRaf(page as never).then(() => {
      settled = true;
    });
    expect(settled).toBe(false);
    resolveEval!();
    await done;
    expect(settled).toBe(true);
  });
});
