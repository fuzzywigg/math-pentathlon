/**
 * @vitest-environment node
 *
 * Hermetic coverage for q-mp-1292: runLighthouse must not throw on malformed /
 * non-object Lighthouse JSON — return a per-row ok:false so remaining targets
 * continue. Fixture text only — no network, no real Lighthouse, no Chrome.
 * Leave waitForUrl (q-mp-1287) and score-range paths alone.
 */
import { EventEmitter } from 'node:events';
import { describe, expect, it } from 'vitest';
import { parseLhReportJson, runLighthouse } from '../../scripts/check-perf.mjs';

type MockChild = EventEmitter & {
  killed: boolean;
  exitCode: number | null;
  kill: (signal?: NodeJS.Signals) => boolean;
};

function makeMockChild(): MockChild {
  const child = new EventEmitter() as MockChild;
  child.killed = false;
  child.exitCode = null;
  child.kill = () => true;
  return child;
}

const TARGET = { id: 'menu', path: '/', label: 'Menu' };

const VALID_REPORT = {
  audits: {
    'first-contentful-paint': { displayValue: '1.0 s' },
    'largest-contentful-paint': { displayValue: '1.2 s' },
    'total-blocking-time': { displayValue: '50 ms' },
    'speed-index': { displayValue: '1.1 s' },
    interactive: { displayValue: '1.3 s' },
    'total-byte-weight': {
      numericValue: 1000,
      displayValue: '1.0 KiB',
    },
  },
  categories: { performance: { score: 0.85 } },
};

/**
 * Drive runLighthouse with injectable file text (no disk, no network).
 */
async function runWithText(text: string) {
  const reportPath = 'virtual-lh-malformed.json';
  return runLighthouse('http://127.0.0.1:9', 'mobile', TARGET, reportPath, {
    timeoutMs: 60_000,
    runCmd: () => ({
      promise: Promise.resolve({ code: 0, stdout: '', stderr: '' }),
      child: makeMockChild(),
    }),
    existsSync: (p) => p === reportPath,
    readFileSync: () => text,
    // Virtual path — skip real fs unlink (ENOENT would also be fine).
    unlinkSync: () => undefined,
  });
}

describe('parseLhReportJson (q-mp-1292)', () => {
  it('fails closed on truncated JSON', () => {
    const parsed = parseLhReportJson('{not-json');
    expect(parsed.ok).toBe(false);
    if (!parsed.ok) {
      expect(parsed.error).toMatch(/malformed Lighthouse JSON/);
    }
  });

  it('fails closed on JSON array', () => {
    expect(parseLhReportJson('[]')).toEqual({
      ok: false,
      error: 'malformed Lighthouse JSON: expected object',
    });
  });

  it('fails closed on JSON null', () => {
    expect(parseLhReportJson('null')).toEqual({
      ok: false,
      error: 'malformed Lighthouse JSON: expected object',
    });
  });

  it('accepts a plain object report', () => {
    const parsed = parseLhReportJson(JSON.stringify(VALID_REPORT));
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.report.categories).toEqual(VALID_REPORT.categories);
    }
  });
});

describe('runLighthouse malformed JSON (q-mp-1292)', () => {
  it('returns ok:false without throwing on truncated LH JSON', async () => {
    await expect(runWithText('{not-json')).resolves.toMatchObject({
      ok: false,
      id: 'menu',
      formFactor: 'mobile',
    });
    const row = await runWithText('{not-json');
    expect(row.ok).toBe(false);
    if (!row.ok) {
      expect(row.error).toMatch(/malformed Lighthouse JSON/);
    }
    expect(row).not.toHaveProperty('score');
  });

  it('returns ok:false for non-object JSON array', async () => {
    const row = await runWithText('[]');
    expect(row.ok).toBe(false);
    if (!row.ok) {
      expect(row.error).toMatch(/malformed Lighthouse JSON: expected object/);
    }
  });

  it('keeps valid LH fixture ok:true score 85', async () => {
    const row = await runWithText(JSON.stringify(VALID_REPORT));
    expect(row.ok).toBe(true);
    if (row.ok) {
      expect(row.score).toBe(85);
    }
  });
});
