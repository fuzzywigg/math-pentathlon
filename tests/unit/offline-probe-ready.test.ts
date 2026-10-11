/**
 * Hermetic coverage for offline probe ready helpers (q-mp-1261 / q-mp-1262):
 * - HTTP 404 must not count as ready
 * - PROBE_BROWSERS trims (and lower-cases) comma-separated names
 *
 * Stays on the default unit-shared (jsdom) project so we do not need a
 * vitest.config nodePureFiles allowlist edit for this ticket.
 */
import { describe, it, expect, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  isHttpResponseReady,
  parseProbeBrowsers,
  waitForUrl,
} from '../../scripts/lib/offline-probe-ready.mjs';

const PROBE_SCRIPTS = [
  'scripts/webkit-offline-probe.mjs',
  'scripts/probe-offline-resilience.mjs',
  'scripts/probe-offline-resilience-dev.mjs',
] as const;

describe('isHttpResponseReady (q-mp-1261)', () => {
  it('accepts 2xx via Response.ok', () => {
    expect(isHttpResponseReady({ ok: true, status: 200 })).toBe(true);
    expect(isHttpResponseReady({ ok: true, status: 204 })).toBe(true);
  });

  it('rejects HTTP 404 and other non-ok statuses', () => {
    expect(isHttpResponseReady({ ok: false, status: 404 })).toBe(false);
    expect(isHttpResponseReady({ ok: false, status: 500 })).toBe(false);
    expect(isHttpResponseReady({ ok: false, status: 0 })).toBe(false);
  });

  it('rejects nullish / missing ok', () => {
    expect(isHttpResponseReady(null)).toBe(false);
    expect(isHttpResponseReady(undefined)).toBe(false);
    expect(isHttpResponseReady({})).toBe(false);
  });
});

describe('waitForUrl (q-mp-1261)', () => {
  it('resolves on first 2xx and ignores prior 404', async () => {
    const statuses = [404, 404, 200];
    const fetchMock = vi.fn(async () => {
      const status = statuses.shift() ?? 200;
      return { ok: status >= 200 && status < 300, status };
    });
    const sleep = vi.fn(async () => undefined);
    let t = 0;
    await waitForUrl('http://127.0.0.1:9/', 10_000, {
      fetch: fetchMock as unknown as typeof fetch,
      sleep,
      now: () => t++,
      pollMs: 1,
    });
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(sleep).toHaveBeenCalled();
  });

  it('throws on timeout when only 404 is returned', async () => {
    const fetchMock = vi.fn(async () => ({ ok: false, status: 404 }));
    const sleep = vi.fn(async () => undefined);
    let t = 0;
    await expect(
      waitForUrl('http://127.0.0.1:9/missing', 5, {
        fetch: fetchMock as unknown as typeof fetch,
        sleep,
        now: () => (t += 3),
        pollMs: 1,
      })
    ).rejects.toThrow(/timeout|Timed out/i);
    expect(fetchMock.mock.calls.length).toBeGreaterThan(0);
  });

  it('uses custom timeoutMessage (probe-offline siblings)', async () => {
    const fetchMock = vi.fn(async () => {
      throw new Error('ECONNREFUSED');
    });
    let t = 0;
    await expect(
      waitForUrl('http://127.0.0.1:9/', 5, {
        fetch: fetchMock as unknown as typeof fetch,
        sleep: async () => undefined,
        now: () => (t += 3),
        pollMs: 1,
        timeoutMessage: (u) => `Timed out waiting for ${u}`,
      })
    ).rejects.toThrow('Timed out waiting for http://127.0.0.1:9/');
  });
});

describe('parseProbeBrowsers (q-mp-1262)', () => {
  it('defaults to webkit when unset or blank', () => {
    expect(parseProbeBrowsers(undefined)).toEqual(['webkit']);
    expect(parseProbeBrowsers(null)).toEqual(['webkit']);
    expect(parseProbeBrowsers('')).toEqual(['webkit']);
    expect(parseProbeBrowsers('   ')).toEqual(['webkit']);
  });

  it('trims spaces so "webkit, firefox" maps cleanly', () => {
    expect(parseProbeBrowsers('webkit, firefox')).toEqual([
      'webkit',
      'firefox',
    ]);
    expect(parseProbeBrowsers(' chromium ,WebKit, FIREFOX ')).toEqual([
      'chromium',
      'webkit',
      'firefox',
    ]);
  });

  it('preserves a single default name without commas', () => {
    expect(parseProbeBrowsers('webkit')).toEqual(['webkit']);
  });
});

describe('probe script wiring (q-mp-1261 / q-mp-1262)', () => {
  it('drops bare status === 404 ready checks from offline probe scripts', () => {
    for (const rel of PROBE_SCRIPTS) {
      const src = readFileSync(resolve(process.cwd(), rel), 'utf8');
      expect(src).not.toMatch(/status\s*===\s*404/);
      expect(src).toMatch(/offline-probe-ready\.mjs/);
    }
  });

  it('webkit-offline-probe uses parseProbeBrowsers for PROBE_BROWSERS', () => {
    const src = readFileSync(
      resolve(process.cwd(), 'scripts/webkit-offline-probe.mjs'),
      'utf8'
    );
    expect(src).toMatch(/parseProbeBrowsers\(process\.env\.PROBE_BROWSERS\)/);
    expect(src).not.toMatch(/PROBE_BROWSERS\?\.split\(/);
  });
});
