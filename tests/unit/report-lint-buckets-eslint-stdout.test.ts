/**
 * Hermetic coverage for report-lint-buckets eslint JSON parse path (q-mp-1317).
 * Empty stdout must not become all-zero totals. Does not spawn eslint or write
 * ceilings. Stays on unit-shared (no vitest.config.ts nodePureFiles edit —
 * out of task path scope); pure helper only.
 */
import { describe, it, expect } from 'vitest';
import { parseEslintJsonReport } from '../../scripts/report-lint-buckets.mjs';

describe('report-lint-buckets parseEslintJsonReport (q-mp-1317)', () => {
  it('rejects empty stdout instead of defaulting to []', () => {
    const got = parseEslintJsonReport({
      status: 1,
      stdout: '',
      stderr: 'Oops, eslint crashed before JSON',
    });
    expect(got.ok).toBe(false);
    if (!got.ok) {
      expect(got.message).toMatch(/empty eslint stdout/);
      expect(got.message).toMatch(/refusing all-zero totals/);
      expect(got.detail).toMatch(/crashed/);
    }
  });

  it('rejects whitespace-only stdout', () => {
    const got = parseEslintJsonReport({
      status: 0,
      stdout: '   \n\t  ',
      stderr: '',
    });
    expect(got.ok).toBe(false);
    if (!got.ok) {
      expect(got.message).toMatch(/empty eslint stdout/);
    }
  });

  it('rejects null/undefined stdout as empty', () => {
    const got = parseEslintJsonReport({
      status: 2,
      stdout: null,
      stderr: 'fatal config',
    });
    expect(got.ok).toBe(false);
    if (!got.ok) {
      expect(got.message).toMatch(/empty eslint stdout/);
    }
  });

  it('rejects eslint fatal exit (>=2) even with leftover stdout', () => {
    const got = parseEslintJsonReport({
      status: 2,
      stdout: 'not-json-but-present',
      stderr: 'Invalid option',
    });
    expect(got.ok).toBe(false);
    if (!got.ok) {
      expect(got.message).toMatch(/eslint probe failed \(exit 2\)/);
    }
  });

  it('rejects spawn start errors', () => {
    const got = parseEslintJsonReport({
      status: null,
      stdout: '',
      stderr: '',
      error: new Error('ENOENT: npx'),
    });
    expect(got.ok).toBe(false);
    if (!got.ok) {
      expect(got.message).toMatch(/failed to start/);
      expect(got.detail).toMatch(/ENOENT/);
    }
  });

  it('rejects signal-killed probes', () => {
    const got = parseEslintJsonReport({
      status: null,
      signal: 'SIGTERM',
      stdout: '',
      stderr: '',
    });
    expect(got.ok).toBe(false);
    if (!got.ok) {
      expect(got.message).toMatch(/killed by signal SIGTERM/);
    }
  });

  it('rejects non-JSON stdout', () => {
    const got = parseEslintJsonReport({
      status: 0,
      stdout: 'Error: boom',
      stderr: '',
    });
    expect(got.ok).toBe(false);
    if (!got.ok) {
      expect(got.message).toMatch(/failed to parse eslint JSON/);
    }
  });

  it('rejects non-array JSON', () => {
    const got = parseEslintJsonReport({
      status: 0,
      stdout: '{"messages":[]}',
      stderr: '',
    });
    expect(got.ok).toBe(false);
    if (!got.ok) {
      expect(got.message).toMatch(/not an array/);
    }
  });

  it('accepts exit 0 with a valid empty array (genuine zero findings)', () => {
    const got = parseEslintJsonReport({
      status: 0,
      stdout: '[]',
      stderr: '',
    });
    expect(got.ok).toBe(true);
    if (got.ok) {
      expect(got.report).toEqual([]);
    }
  });

  it('accepts exit 1 with rule hits (normal eslint findings path)', () => {
    const payload = [
      {
        filePath: '/workspace/src/demo.ts',
        messages: [{ ruleId: 'curly', message: 'Expected {', line: 1 }],
      },
    ];
    const got = parseEslintJsonReport({
      status: 1,
      stdout: JSON.stringify(payload),
      stderr: '',
    });
    expect(got.ok).toBe(true);
    if (got.ok) {
      expect(got.report).toHaveLength(1);
      expect(got.report[0]?.messages[0]?.ruleId).toBe('curly');
    }
  });

  it('trims leading/trailing whitespace around valid JSON', () => {
    const got = parseEslintJsonReport({
      status: 1,
      stdout: '\n[{"filePath":"a.ts","messages":[]}]\n',
      stderr: '',
    });
    expect(got.ok).toBe(true);
    if (got.ok) {
      expect(got.report).toHaveLength(1);
    }
  });
});
