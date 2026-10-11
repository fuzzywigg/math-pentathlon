/**
 * Hermetic coverage for check:perf preview waitForUrl (q-mp-1287):
 * HTTP 404 must not count as ready (1261 residual in check-perf only).
 *
 * Shared ready semantics live in scripts/lib/offline-probe-ready.mjs;
 * this file locks the check-perf wiring + the 2xx-only contract used there.
 */
import { describe, it, expect, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  isHttpResponseReady,
  waitForUrl,
} from '../../scripts/lib/offline-probe-ready.mjs';

const CHECK_PERF = 'scripts/check-perf.mjs';

describe('check-perf waitForUrl wiring (q-mp-1287)', () => {
  it('imports offline-probe-ready and drops bare status === 404 ready checks', () => {
    const src = readFileSync(resolve(process.cwd(), CHECK_PERF), 'utf8');
    expect(src).toMatch(/offline-probe-ready\.mjs/);
    expect(src).toMatch(/waitForUrl as waitForUrlReady/);
    expect(src).not.toMatch(/status\s*===\s*404/);
    expect(src).not.toMatch(/res\.ok\s*\|\|\s*res\.status/);
  });
});

describe('check-perf ready contract via offline-probe-ready (q-mp-1287)', () => {
  it('isHttpResponseReady rejects 404', () => {
    expect(isHttpResponseReady({ ok: false, status: 404 })).toBe(false);
    expect(isHttpResponseReady({ ok: true, status: 200 })).toBe(true);
  });

  it('waitForUrl times out when only 404 is returned (check-perf message shape)', async () => {
    const fetchMock = vi.fn(async () => ({ ok: false, status: 404 }));
    let t = 0;
    await expect(
      waitForUrl('http://127.0.0.1:9/missing', 5, {
        fetch: fetchMock as unknown as typeof fetch,
        sleep: async () => undefined,
        now: () => (t += 3),
        pollMs: 1,
        timeoutMessage: (u) => `Timed out waiting for ${u}`,
      })
    ).rejects.toThrow('Timed out waiting for http://127.0.0.1:9/missing');
    expect(fetchMock.mock.calls.length).toBeGreaterThan(0);
  });

  it('waitForUrl resolves on 2xx after prior 404s', async () => {
    const statuses = [404, 200];
    const fetchMock = vi.fn(async () => {
      const status = statuses.shift() ?? 200;
      return { ok: status >= 200 && status < 300, status };
    });
    let t = 0;
    await waitForUrl('http://127.0.0.1:9/', 10_000, {
      fetch: fetchMock as unknown as typeof fetch,
      sleep: async () => undefined,
      now: () => t++,
      pollMs: 1,
      timeoutMessage: (u) => `Timed out waiting for ${u}`,
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
