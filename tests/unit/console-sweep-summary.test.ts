/**
 * Hermetic coverage for console-sweep load vs play/total error reporting
 * (q-mp-1241 / q-mp-1332). Pure helper — no Playwright / DOM required.
 */
import { describe, it, expect } from 'vitest';
import {
  countConsoleErrors,
  countConsoleWarnings,
  formatConsoleSweepSummaryLine,
  summarizeConsoleSweepResult,
} from '../../scripts/lib/console-sweep-summary.mjs';

describe('console-sweep-summary (q-mp-1241 / q-mp-1332)', () => {
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
    // total: load + play
    expect(s.totalErrors).toBe(5);
    expect(s.totalWarnings).toBe(2);
    expect(s.loadErrors).toBeLessThanOrEqual(s.totalErrors);
    expect(s.loadWarnings).toBeLessThanOrEqual(s.totalWarnings);
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
    expect(line).toMatch(/loadWarnings=0/);
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

  it('keeps loadErrors ≤ totalErrors when play console is a later snapshot (q-mp-1332)', () => {
    // Play-phase console replaced the load messages with warnings-only;
    // pageErrors still records a play failure.
    const r = {
      loadConsole: [
        { type: 'error', text: 'load a' },
        { type: 'error', text: 'load b' },
      ],
      loadPageErrors: [],
      console: [{ type: 'warning', text: 'play warn' }],
      pageErrors: ['play pageerror'],
      unhandledRejections: [],
    };
    const s = summarizeConsoleSweepResult(r);
    expect(s.loadErrors).toBe(2);
    expect(s.playErrors).toBe(1);
    expect(s.totalErrors).toBe(3);
    expect(s.loadErrors).toBeLessThanOrEqual(s.totalErrors);
    expect(s.totalWarnings).toBe(1);
  });

  it('keeps loadWarnings ≤ totalWarnings and surfaces them in the line (q-mp-1332)', () => {
    const r = {
      loadOk: true,
      playNote: null,
      loadConsole: [
        { type: 'warning', text: 'load a' },
        { type: 'warning', text: 'load b' },
      ],
      loadPageErrors: [],
      console: [],
      pageErrors: [],
      unhandledRejections: [],
    };
    const s = summarizeConsoleSweepResult(r);
    expect(s.loadWarnings).toBe(2);
    expect(s.totalWarnings).toBe(2);
    expect(s.loadWarnings).toBeLessThanOrEqual(s.totalWarnings);
    const line = formatConsoleSweepSummaryLine(r);
    expect(line).toMatch(/loadWarnings=2/);
    expect(line).toMatch(/warnings=2/);
  });
});
