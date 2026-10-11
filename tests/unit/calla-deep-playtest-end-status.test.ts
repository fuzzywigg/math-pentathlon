/**
 * q-mp-1258: Calla deep-playtest end regex must not match "Drawing" / "patience".
 * Pure matcher + source wiring — safe under unit-shared jsdom (no vitest.config edit).
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  CALLA_END_STATUS_RE,
  isCallaEndStatus,
} from '../../scripts/lib/calla-end-status.mjs';

const HARNESS = resolve(process.cwd(), 'scripts/calla-deep-playtest.mjs');

describe('isCallaEndStatus (q-mp-1258)', () => {
  it('does not false-end on Drawing / patience substrings', () => {
    expect(isCallaEndStatus('Drawing card')).toBe(false);
    expect(isCallaEndStatus('Drawing…')).toBe(false);
    expect(isCallaEndStatus('patience')).toBe(false);
    expect(isCallaEndStatus('Have patience')).toBe(false);
  });

  it('still detects real win / tie banners', () => {
    expect(isCallaEndStatus('🎉 You Wins! 🎉')).toBe(true);
    expect(isCallaEndStatus('AI Wins!')).toBe(true);
    expect(isCallaEndStatus('Blue wins!')).toBe(true);
    expect(isCallaEndStatus("🤝 It's a Tie! 🤝")).toBe(true);
    expect(isCallaEndStatus("It's a tie!")).toBe(true);
    expect(isCallaEndStatus('You win!')).toBe(true);
  });

  it('ignores thinking / turn copy', () => {
    expect(isCallaEndStatus('🤖 AI is thinking...')).toBe(false);
    expect(isCallaEndStatus("Blue's turn — sow cubes")).toBe(false);
    expect(isCallaEndStatus('')).toBe(false);
    expect(isCallaEndStatus(null)).toBe(false);
  });

  it('exports a word-boundary regex (not bare /win|tie/i)', () => {
    expect(CALLA_END_STATUS_RE.source).toContain('\\b');
    expect(CALLA_END_STATUS_RE.test('Drawing')).toBe(false);
    expect(CALLA_END_STATUS_RE.test('patience')).toBe(false);
  });
});

describe('calla-deep-playtest harness wiring (q-mp-1258)', () => {
  it('imports isCallaEndStatus and has no bare /win|tie/i end matcher', () => {
    const src = readFileSync(HARNESS, 'utf8');
    expect(src).toMatch(/from ['"]\.\/lib\/calla-end-status\.mjs['"]/);
    expect(src).toMatch(/isCallaEndStatus/);
    expect(src).not.toMatch(/\/win\|tie\/i/);
    expect(src).not.toMatch(/\/thinking\|win\|tie\/i/);
    expect(src).toMatch(/\\b\(\?:wins\?\|tie\)\\b/);
  });
});
