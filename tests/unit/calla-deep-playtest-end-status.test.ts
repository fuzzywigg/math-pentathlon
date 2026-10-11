/**
 * q-mp-1258 / q-mp-1405: Calla deep-playtest end matcher.
 * Pure matcher + source wiring — safe under unit-shared jsdom (no vitest.config edit).
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  CALLA_END_STATUS_RE,
  CALLA_END_STATUS_RE_SOURCE,
  isCallaEndStatus,
} from '../../scripts/lib/calla-end-status.mjs';

const HARNESS = resolve(process.cwd(), 'scripts/calla-deep-playtest.mjs');
const LIB = resolve(process.cwd(), 'scripts/lib/calla-end-status.mjs');

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
    expect(isCallaEndStatus('Red wins!')).toBe(true);
  });

  it('ignores thinking / turn copy', () => {
    expect(isCallaEndStatus('🤖 AI is thinking...')).toBe(false);
    expect(isCallaEndStatus("Blue's turn — sow cubes")).toBe(false);
    expect(isCallaEndStatus('')).toBe(false);
    expect(isCallaEndStatus(null)).toBe(false);
  });

  it('exports a banner-shaped regex (not bare /win|tie/i)', () => {
    expect(CALLA_END_STATUS_RE_SOURCE).toContain('(?<![A-Za-z0-9_-])');
    expect(CALLA_END_STATUS_RE.source).toBe(CALLA_END_STATUS_RE_SOURCE);
    expect(CALLA_END_STATUS_RE.test('Drawing')).toBe(false);
    expect(CALLA_END_STATUS_RE.test('patience')).toBe(false);
  });
});

describe('isCallaEndStatus (q-mp-1405)', () => {
  it('does not false-end on hyphenated tie/wins forms', () => {
    expect(isCallaEndStatus('pre-tie')).toBe(false);
    expect(isCallaEndStatus('pre-wins')).toBe(false);
    expect(isCallaEndStatus('tie-breaker')).toBe(false);
    expect(isCallaEndStatus('re-wins')).toBe(false);
  });

  it('does not false-end on non-banner "No tie yet" / interrogative wins', () => {
    expect(isCallaEndStatus('No tie yet')).toBe(false);
    expect(isCallaEndStatus('Who wins the round?')).toBe(false);
    expect(isCallaEndStatus('who wins?')).toBe(false);
  });

  it('still detects genuine calla end banners (positive fixtures)', () => {
    expect(isCallaEndStatus("It's a Tie!")).toBe(true);
    expect(isCallaEndStatus('Blue wins!')).toBe(true);
    expect(isCallaEndStatus("🤝 It's a Tie! 🤝")).toBe(true);
    expect(isCallaEndStatus('🎉 You Wins! 🎉')).toBe(true);
    expect(isCallaEndStatus('AI Wins!')).toBe(true);
  });
});

describe('calla-deep-playtest harness wiring (q-mp-1258 / q-mp-1405)', () => {
  it('imports isCallaEndStatus + RE_SOURCE and has no bare /win|tie/i end matcher', () => {
    const src = readFileSync(HARNESS, 'utf8');
    expect(src).toMatch(/from ['"]\.\/lib\/calla-end-status\.mjs['"]/);
    expect(src).toMatch(/isCallaEndStatus/);
    expect(src).toMatch(/CALLA_END_STATUS_RE_SOURCE/);
    expect(src).not.toMatch(/\/win\|tie\/i/);
    expect(src).not.toMatch(/\/thinking\|win\|tie\/i/);
    expect(src).not.toMatch(/\\b\(\?:wins\?\|tie\)\\b/);
  });

  it('keeps CALLA_END_STATUS_RE built from the exported source string', () => {
    const libSrc = readFileSync(LIB, 'utf8');
    expect(libSrc).toMatch(/CALLA_END_STATUS_RE_SOURCE/);
    expect(libSrc).toMatch(/new RegExp\(CALLA_END_STATUS_RE_SOURCE/);
  });
});
