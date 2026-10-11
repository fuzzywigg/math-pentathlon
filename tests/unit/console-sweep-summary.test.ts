/**
 * Hermetic coverage for console-sweep load vs play/total error reporting
 * (q-mp-1241). Pure helper — no Playwright / DOM required.
 */
import { describe, it, expect } from 'vitest';
import {
  countConsoleErrors,
  countConsoleWarnings,
  formatConsoleSweepSummaryLine,
  summarizeConsoleSweepResult,
} from '../../scripts/lib/console-sweep-summary.mjs';

describe('console-sweep-summary (q-mp-1241)', () => {
  it('countConsoleErrors / Warnings ignore other types', () => {
    const msgs = [
      { type: 'error', text: 'e1' },
      { type: 'warning', text: 'w1' },
      { type: 'error', text: 'e2' },
      { type: 'log', text: 'noop' },
    ];
    expect(countConsoleErrors(msgs)).toBe(2);
    expect(countConsoleWarnings(msgs)).toBe(1);
    expect(countConsoleErrors(undefined)).toBe(0);
  });

  it('separates load-only errors from play/total (loadConsole used)', () => {
    const r = {
      loadOk: true,
      playNote: null,
      loadConsole: [
        { type: 'error', text: 'load boom' },
        { type: 'warning', text: 'load warn' },
      ],
      loadPageErrors: ['load pageerror'],
      console: [
        { type: 'error', text: 'load boom' },
        { type: 'warning', text: 'load warn' },
        { type: 'error', text: 'play boom' },
        { type: 'warning', text: 'play warn' },
      ],
      pageErrors: ['load pageerror', 'play pageerror'],
      unhandledRejections: ['play reject'],
    };

    const s = summarizeConsoleSweepResult(r);
    // load: 1 console error + 1 pageerror
    expect(s.loadErrors).toBe(2);
    expect(s.loadWarnings).toBe(1);
    // play: 1 console error + 1 pageerror + 1 rejection
    expect(s.playErrors).toBe(3);
    // total: 2 console errors + 2 pageerrors + 1 rejection
    expect(s.totalErrors).toBe(5);
    expect(s.totalWarnings).toBe(2);
  });

  it('labels totalErrors (not bare errors=) and exposes load/play in the line', () => {
    const r = {
      loadOk: true,
      playNote: 'move 1 failed: x',
      loadConsole: [],
      loadPageErrors: [],
      console: [{ type: 'error', text: 'play only' }],
      pageErrors: [],
      unhandledRejections: [],
    };
    const line = formatConsoleSweepSummaryLine(r);
    expect(line).toMatch(/loadOk=true/);
    expect(line).toMatch(/loadErrors=0/);
    expect(line).toMatch(/playErrors=1/);
    expect(line).toMatch(/totalErrors=1/);
    expect(line).toMatch(/warnings=0/);
    expect(line).toMatch(/play=move 1 failed: x/);
    expect(line).not.toMatch(/(^|\s)errors=/);
  });

  it('treats missing load snapshots as zero load errors', () => {
    const s = summarizeConsoleSweepResult({
      console: [{ type: 'error', text: 'e' }],
      pageErrors: ['p'],
      unhandledRejections: [],
    });
    expect(s.loadErrors).toBe(0);
    expect(s.playErrors).toBe(2);
    expect(s.totalErrors).toBe(2);
  });

  it('keeps a clean zero summary when nothing fired', () => {
    const s = summarizeConsoleSweepResult({
      loadConsole: [],
      loadPageErrors: [],
      console: [],
      pageErrors: [],
      unhandledRejections: [],
    });
    expect(s).toEqual({
      loadErrors: 0,
      loadWarnings: 0,
      playErrors: 0,
      totalErrors: 0,
      totalWarnings: 0,
    });
  });
});
