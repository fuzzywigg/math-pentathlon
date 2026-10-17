/**
 * Hermetic coverage for ramrod deep harness honesty (q-mp-1487):
 * tip-real AI seat — no missing `.ramrod-computer-thinking`.
 * No Playwright launch. Stays on unit-shared so vitest.config nodePureFiles
 * need not change for this harness-only ticket.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  RAMROD_AI_THINKING_STATUS_RE,
  RAMROD_COMPUTER_THINKING_SELECTOR,
  RAMROD_TIP_EMITS_COMPUTER_THINKING_CLASS,
  isRamrodAiSeatFromSignals,
  isRamrodAiThinkingStatus,
  resolveRamrodThinkingMetric,
} from '../../scripts/lib/ramrod-thinking.mjs';

const HARNESS = resolve(process.cwd(), 'scripts/ramrod-deep-playtest.mjs');
const LIB = resolve(process.cwd(), 'scripts/lib/ramrod-thinking.mjs');

function readHarness(): string {
  return readFileSync(HARNESS, 'utf8');
}

describe('q-mp-1487 tip-real AI seat — no missing ramrod-computer-thinking', () => {
  it('documents that tip does not emit ramrod-computer-thinking chrome', () => {
    expect(RAMROD_TIP_EMITS_COMPUTER_THINKING_CLASS).toBe(false);
    expect(RAMROD_COMPUTER_THINKING_SELECTOR).toBe('.ramrod-computer-thinking');
  });

  it('detects AI thinking from tip-real status text (stubbed)', () => {
    expect(isRamrodAiThinkingStatus('🤖 Computer is thinking…')).toBe(true);
    expect(isRamrodAiThinkingStatus('Computer is thinking...')).toBe(true);
    expect(isRamrodAiThinkingStatus("Blue's turn - Select a rod")).toBe(false);
    expect(isRamrodAiThinkingStatus('Red wins with 12cm!')).toBe(false);
    expect(isRamrodAiThinkingStatus('')).toBe(false);
    expect(isRamrodAiThinkingStatus(null)).toBe(false);
    expect(RAMROD_AI_THINKING_STATUS_RE.test('COMPUTER move')).toBe(true);
  });

  it('detects AI seat from tip-real status class / text / history growth', () => {
    expect(
      isRamrodAiSeatFromSignals({
        className: 'ramrod-status player2',
        text: '🤖 Computer is thinking…',
      })
    ).toBe(true);
    expect(
      isRamrodAiSeatFromSignals({
        className: 'ramrod-status player2',
        text: "🔴 Red's turn - Select a rod",
      })
    ).toBe(true);
    expect(
      isRamrodAiSeatFromSignals({
        className: 'ramrod-status player1',
        text: "🔵 Blue's turn - Select a rod",
      })
    ).toBe(false);
    expect(
      isRamrodAiSeatFromSignals({
        className: 'ramrod-status player2',
        text: '🔴 Red wins with 12cm!',
      })
    ).toBe(false);
    expect(
      isRamrodAiSeatFromSignals({
        className: 'ramrod-status player1',
        text: "Blue's turn - Select a rod",
        historyGrew: true,
      })
    ).toBe(true);
  });

  it('thinking metric derives from status text when tip does not emit class', () => {
    // Measured baseline: class query always false → thinking permanently false.
    expect(
      resolveRamrodThinkingMetric({
        statusText: 'Computer is thinking…',
        classPresent: false,
        tipEmitsClass: false,
      })
    ).toBe(true);
    expect(
      resolveRamrodThinkingMetric({
        statusText: "Blue's turn - Select a rod",
        classPresent: false,
        tipEmitsClass: false,
      })
    ).toBe(false);
    // If product chrome ever lands, classPresent can drive the metric.
    expect(
      resolveRamrodThinkingMetric({
        statusText: "Blue's turn - Select a rod",
        classPresent: true,
        tipEmitsClass: true,
      })
    ).toBe(true);
    expect(
      resolveRamrodThinkingMetric({
        statusText: 'Computer is thinking…',
        classPresent: false,
        tipEmitsClass: true,
      })
    ).toBe(false);
  });

  it('harness wires tip-real waits — no live .ramrod-computer-thinking locator/query', () => {
    const src = readHarness();
    expect(src).toMatch(/from ['"]\.\/lib\/ramrod-thinking\.mjs['"]/);
    expect(src).toMatch(/RAMROD_TIP_EMITS_COMPUTER_THINKING_CLASS/);
    expect(src).toMatch(/resolveRamrodThinkingMetric/);
    expect(src).toMatch(/isRamrodAiThinkingStatus/);
    expect(src).toMatch(/RAMROD_AI_THINKING_STATUS_RE/);
    expect(src).toMatch(/historyBefore/);
    expect(src).toMatch(/\.ramrod-status/);

    // Dead product-chrome selectors must not drive wait / measure / capture.
    expect(src).not.toMatch(
      /querySelector\(\s*['"]\.ramrod-computer-thinking['"]\s*\)/
    );
    expect(src).not.toMatch(
      /\.locator\(\s*['"]\.ramrod-computer-thinking['"]\s*\)/
    );
  });

  it('keeps hermetic helpers in scripts/lib (no Playwright side effects)', () => {
    const libSrc = readFileSync(LIB, 'utf8');
    expect(libSrc).toMatch(
      /export const RAMROD_TIP_EMITS_COMPUTER_THINKING_CLASS/
    );
    expect(libSrc).toMatch(/export function isRamrodAiThinkingStatus/);
    expect(libSrc).toMatch(/export function isRamrodAiSeatFromSignals/);
    expect(libSrc).toMatch(/export function resolveRamrodThinkingMetric/);
    expect(libSrc).not.toMatch(/playwright/i);
    expect(libSrc).not.toMatch(/chromium/);
  });
});
